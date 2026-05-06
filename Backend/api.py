from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import shutil
import os
import subprocess
import time
import requests
from pathlib import Path

import stt
import translate
import tts

app = FastAPI()

# 📁 Ensure audio folder exists
os.makedirs("audio", exist_ok=True)
_AUDIO_DIR = Path("audio").resolve()

# 📡 Serve audio files
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# 🌐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# ☁️ WEATHER (OpenWeatherMap)
# =====================================================
@app.get("/weather")
def get_weather(lat: float, lon: float):
    api_key = (os.getenv("OPENWEATHER_API_KEY") or "").strip()
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENWEATHER_API_KEY is not configured on the server.",
        )
    url = "https://api.openweathermap.org/data/2.5/weather"

    try:
        resp = requests.get(
            url,
            params={"lat": lat, "lon": lon, "appid": api_key, "units": "metric"},
            timeout=10,
        )
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Weather service unreachable: {str(e)}")

    if resp.status_code != 200:
        if resp.status_code == 401:
            # Upstream key/auth issue; don't expose as a client auth failure.
            raise HTTPException(
                status_code=502,
                detail="OpenWeatherMap rejected the API key (401). Verify the key / plan / API access.",
            )
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text
        raise HTTPException(
            status_code=502,
            detail={
                "message": "OpenWeatherMap request failed",
                "upstream_status": resp.status_code,
                "upstream_detail": detail,
            },
        )

    try:
        data = resp.json()
        return {
            "city": data.get("name"),
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "description": (data.get("weather") or [{}])[0].get("description"),
        }
    except Exception:
        raise HTTPException(status_code=502, detail="Unexpected response from weather provider")

# 🎧 Convert audio to WAV
def convert_to_wav(input_file, output_file):
    result = subprocess.run(
        ["ffmpeg", "-y", "-i", input_file, output_file],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg failed: {result.stderr.decode()}")


def _needs_script_normalization(text: str) -> bool:
    if not text:
        return False
    # Check if there are Devanagari characters
    if any('\u0900' <= ch <= '\u097F' for ch in text):
        return True
    
    # Check if mostly ASCII (Roman Urdu/Sindhi)
    letters = [ch for ch in text if ch.isalpha()]
    if not letters:
        return False
    ascii_letters = sum(1 for ch in letters if ord(ch) < 128)
    if (ascii_letters / len(letters)) >= 0.6:
        return True
        
    return False


# =====================================================
# 🎤 TEXT REQUEST MODEL
# =====================================================
class TextRequest(BaseModel):
    text: str
    target_lang: str


class DeleteAudioRequest(BaseModel):
    audio_url: str


# =====================================================
# 💬 TEXT → TRANSLATION
# =====================================================
@app.post("/translate-text")
def translate_text_api(req: TextRequest):

    translated = translate.translate_text(req.text, req.target_lang)

    tts_text = translated
    lang_lower = req.target_lang.lower().strip()
    if lang_lower in {"sindhi", "pashto", "balochi"}:
        tts_text = translate.transliterate_regional_for_tts(translated, lang_lower)

    filename = f"audio/output_{int(time.time())}.wav"
    tts.text_to_speech(tts_text, lang=req.target_lang, output_path=filename)
    tts_engine = getattr(tts, "get_last_tts_engine_info", lambda: "Unknown")()

    return {
        "translated_text": translated,
        "tts_engine": tts_engine,
        "audio_url": f"/{filename}"
    }


# =====================================================
# 🗑 DELETE AUDIO FILE (generated outputs only)
# =====================================================
@app.delete("/delete-audio")
def delete_audio(req: DeleteAudioRequest):
    audio_url = (req.audio_url or "").strip()
    if not audio_url:
        raise HTTPException(status_code=400, detail="audio_url is required")

    # Accept "/audio/output_123.wav" or "audio/output_123.wav"
    rel = audio_url.lstrip("/")
    if rel.startswith("audio/"):
        rel = rel[len("audio/") :]

    filename = os.path.basename(rel)
    if not filename.lower().endswith(".wav"):
        raise HTTPException(status_code=400, detail="Only .wav files can be deleted")
    # Only allow deleting generated outputs
    if not filename.startswith("output_"):
        raise HTTPException(status_code=403, detail="Not allowed to delete this file")

    path = (_AUDIO_DIR / filename).resolve()
    if not path.is_relative_to(_AUDIO_DIR):
        raise HTTPException(status_code=400, detail="Invalid audio path")

    if not path.exists():
        return {"deleted": False, "reason": "not_found", "file": filename}

    try:
        path.unlink()
        return {"deleted": True, "file": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")


# =====================================================
# 🎤 VOICE UPLOAD (HOLD-TO-RECORD FRONTEND)
# =====================================================
@app.post("/speech-to-speech-record")
def speech_to_speech_record(
    file: UploadFile = File(...),
    target_lang: str = "urdu"
):

    input_path = f"temp_{int(time.time())}.webm"
    wav_path = f"temp_{int(time.time())}.wav"

    # 1. Save uploaded audio
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 2. Convert to wav
        convert_to_wav(input_path, wav_path)

        # 3. Normalize requested target language
        target_lang = target_lang.lower().strip()

        # 4. Speech to text (use selected target language as Whisper hint)
        text, detected_lang = stt.speech_to_text(wav_path, target_lang=target_lang)

        if not text:
            return {"error": "No speech detected"}

        # 5. Translate
        translated = translate.translate_text(text, target_lang)

        display_text = text
        # Optional transcript normalization (only if helper exists in translate.py).
        normalizer = getattr(translate, "normalize_transcript_for_display", None)
        if callable(normalizer):
            if target_lang == "pashto":
                display_text = normalizer(text, target_lang)
            elif _needs_script_normalization(text) and target_lang in {"urdu", "sindhi", "punjabi", "balochi"}:
                display_text = normalizer(text, target_lang)

        # 6. Text to speech
        tts_text = translated
        if target_lang in {"sindhi", "pashto", "balochi"}:
            tts_text = translate.transliterate_regional_for_tts(translated, target_lang)
            
        filename = f"audio/output_{int(time.time())}.wav"
        tts.text_to_speech(tts_text, lang=target_lang, output_path=filename)
        tts_engine = getattr(tts, "get_last_tts_engine_info", lambda: "Unknown")()

        return {
            "original_text": display_text,
            "detected_language": detected_lang,
            "target_language": target_lang,
            "translated_text": translated,
            "tts_engine": tts_engine,
            "audio_url": f"/{filename}"
        }

    finally:
        # 🧹 cleanup temp files safely
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)


