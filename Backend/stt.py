"""
Speech-to-text (STT) utilities using OpenAI Whisper (local).

Responsibilities:
- Record microphone audio
- Transcribe using Whisper "medium" model
- Focus on Urdu language detection and transcription
"""

import queue
import sys
from typing import TYPE_CHECKING, Tuple, Optional

import numpy as np
import sounddevice as sd
import soundfile as sf

import config

if TYPE_CHECKING:  # Only imported for type checkers; avoids runtime/lint errors if not installed yet.
    import whisper  # pragma: no cover


_whisper_model: Optional["whisper.Whisper"] = None


def _get_whisper_model() -> "whisper.Whisper":
    """Lazily load and cache the Whisper model."""
    global _whisper_model
    if _whisper_model is None:
        try:
            import whisper  # type: ignore[import]
        except ImportError as exc:
            raise ImportError(
                "The 'openai-whisper' package is required but not installed. "
                "Install it with 'pip install openai-whisper'."
            ) from exc
        print(f"Loading Whisper model '{config.WHISPER_MODEL_NAME}' (this may take a while)...")
        _whisper_model = whisper.load_model(config.WHISPER_MODEL_NAME)
        print("Whisper model loaded.")
    return _whisper_model


def record_audio(duration: int = config.DEFAULT_RECORD_SECONDS, output_path: str = config.TEMP_INPUT_WAV_PATH) -> str:
    """
    Record audio from the default microphone for the given duration (seconds).

    Returns the path to the saved WAV file.
    """
    samplerate = config.SAMPLE_RATE
    print(f"Recording audio for {duration} seconds at {samplerate} Hz...")

    audio_q: "queue.Queue[np.ndarray]" = queue.Queue()

    def callback(indata, frames, time, status):  # type: ignore[override]
        if status:
            print(f"Recording status: {status}", file=sys.stderr)
        audio_q.put(indata.copy())

    with sd.InputStream(samplerate=samplerate, channels=1, callback=callback):
        frames = []
        for _ in range(int(duration * samplerate / 1024) + 1):
            frames.append(audio_q.get())

    audio_data = np.concatenate(frames, axis=0).flatten()

    # Save as 16-bit PCM WAV
    sf.write(output_path, audio_data, samplerate)
    print(f"Audio saved to: {output_path}")
    return output_path


def _target_lang_to_whisper_code(target_lang: Optional[str]) -> Optional[str]:
    """
    Map app logical language names to Whisper language codes.

    Notes:
    - Whisper doesn't have a dedicated Balochi code; we map it to Urdu script as a best-effort.
    """
    if not target_lang:
        return None

    lang = target_lang.strip().lower()
    mapping = {
        "urdu": "ur",
        "english": "en",
        "punjabi": "pa",
        "sindhi": "sd",
        "pashto": "ps",
        "balochi": "ur",
    }
    return mapping.get(lang)


def speech_to_text(audio_path: str, *, target_lang: Optional[str] = None) -> Tuple[str, str]:
    """
    Transcribe speech in the given audio file using Whisper.
    If target_lang is provided, transcription is forced to that language.

    Returns:
        (text, detected_language_code)
    """
    model = _get_whisper_model()

    print(f"Transcribing audio: {audio_path}")
    forced_code = _target_lang_to_whisper_code(target_lang)
    
    initial_prompt = None
    if target_lang == "sindhi":
        initial_prompt = "هيءَ هڪ سنڌي عبارت آهي، جنهن کي عربي رسم الخط ۾ لکيو ويو آهي."
    elif target_lang == "urdu":
        initial_prompt = "یہ اردو زبان کی عبارت ہے۔"
    elif target_lang == "punjabi":
        initial_prompt = "ایہ پنجابی زبان دی گل بات اے۔"
    elif target_lang == "pashto":
        initial_prompt = "دا د پښتو ژبې یوه جمله ده."

    kwargs = {"fp16": False}
    if forced_code:
        kwargs["language"] = forced_code
    if initial_prompt:
        kwargs["initial_prompt"] = initial_prompt

    result = model.transcribe(audio_path, **kwargs)

    text: str = result.get("text", "").strip()
    lang: str = result.get("language", "ur")

    print(f"Detected language: {lang}")
    print(f"Transcription: {text}")
    return text, lang


def map_whisper_lang_to_name(lang_code: str) -> str:
    """
    Map a Whisper language code to the logical language name used in this project.

    Examples:
        'ur' -> 'urdu'
        'en' -> 'english'
        'pa' -> 'punjabi'
        'sd' -> 'sindhi'
        'ps' -> 'pashto'
        'hi' -> 'urdu'  (Hindi input, treat as Urdu)
        anything else -> 'urdu'  (safe default)
    """
    code = (lang_code or "").lower()
    mapping = {
        "ur": "urdu",
        "hi": "urdu",    # Hindi → Urdu (very similar script/language)
        "en": "english",
        "pa": "punjabi",
        "sd": "sindhi",
        "ps": "pashto",
        # Balochi has no dedicated Whisper code; it may detect as 'ur' or 'ar'
    }
    return mapping.get(code, "urdu")  # Safe fallback


__all__ = ["record_audio", "speech_to_text", "map_whisper_lang_to_name"]