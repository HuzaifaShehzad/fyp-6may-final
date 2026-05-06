"""
Text-to-speech (TTS) utilities using Google TTS (gTTS).

Responsibilities:
- Map logical language names to gTTS language codes.
- Convert text to speech and save as WAV file.
- Handle gTTS API calls and error handling.
"""

import os
import re
from typing import Optional

import tempfile

import config

try:
    from gtts import gTTS  # type: ignore
except Exception:  # gTTS is optional if Edge TTS is available
    gTTS = None  # type: ignore


_LAST_TTS_ENGINE_INFO: str = "Unknown"


def get_last_tts_engine_info() -> str:
    """
    Return a short human-readable description of the last TTS engine used.
    """
    return _LAST_TTS_ENGINE_INFO


def _sanitize_unicode_text(text: str) -> str:
    """
    Sanitize Unicode text by removing invalid surrogate characters.
    
    This fixes issues where text contains invalid UTF-8 surrogate pairs
    that cannot be encoded properly (e.g., from translation APIs).
    
    Args:
        text: Input text that may contain invalid Unicode characters.
        
    Returns:
        Sanitized text with invalid surrogates removed.
    """
    if not text:
        return text
    
    # First, try to fix any encoding issues by encoding/decoding with error handling
    # This catches surrogates and other invalid characters
    try:
        # Try to encode as UTF-8 - this will fail if there are surrogates
        text.encode('utf-8')
        # If encoding succeeds, check for surrogates manually
        sanitized = text
    except UnicodeEncodeError:
        # If encoding fails, use replace strategy to remove problematic chars
        sanitized = text.encode('utf-8', errors='replace').decode('utf-8', errors='replace')
    
    # Remove invalid surrogate characters (U+D800 to U+DFFF) explicitly
    # These are invalid in UTF-8 and cause encoding errors when passed to external tools
    # Surrogates are in the range U+D800 (55296) to U+DFFF (57343)
    SURROGATE_START = 0xD800
    SURROGATE_END = 0xDFFF
    
    sanitized = ''.join(
        char for char in sanitized 
        if not (SURROGATE_START <= ord(char) <= SURROGATE_END)
    )
    
    # Final safety check: ensure the result can be encoded as UTF-8
    try:
        sanitized.encode('utf-8')
    except UnicodeEncodeError:
        # If encoding still fails, use replace strategy one more time
        sanitized = sanitized.encode('utf-8', errors='replace').decode('utf-8', errors='replace')
    
    return sanitized


def _get_gtts_lang_code(lang: str) -> str:
    """
    Map logical language name to gTTS language code.
    
    Note: Google TTS (gTTS) does not support Sindhi. Sindhi requests will
    fallback to Urdu (ur) as they are related languages with similar scripts.
    
    Args:
        lang: Logical language name (e.g., "urdu", "hindi", "english").
        
    Returns:
        gTTS language code (e.g., "ur", "hi", "en").
    """
    lang_key = (lang or "").strip().lower()
    
    # Mapping from logical language names to gTTS language codes
    # Note: Sindhi is not supported by gTTS, so we use Urdu as fallback
    lang_mapping = {
        "english": "en",
        "urdu": "ur",
        "hindi": "hi",
        "punjabi": "ur",  # Use Urdu since gTTS 'pa' expects Gurmukhi script, but we use Pakistani Punjabi (Shahmukhi/Urdu script)
        "sindhi": "ur",  # Fallback to Urdu since gTTS doesn't support Sindhi
        "pashto": "ur",  # Fallback to Urdu to handle unsupported characters smoothly via transliteration
        "balochi": "ur",
    }
    
    lang_code = lang_mapping.get(lang_key)
    if not lang_code:
        # Fallback to English if language not found
        print(f"Warning: Language '{lang}' not found in mapping, using English (en) as fallback.")
        lang_code = "en"
    
    return lang_code


def _prepare_tts_text(text: str) -> str:
    """
    Prepare text for TTS so it sounds natural and doesn't read markup/symbols.

    Goals:
    - Remove markdown formatting characters (*, _, backticks, headings)
    - Remove code blocks that TTS reads awkwardly
    - Convert bullets/newlines into spoken-friendly sentences
    """
    if not text:
        return text

    # Remove fenced code blocks entirely
    text = re.sub(r"```[\s\S]*?```", " ", text)

    # Remove inline code markers but keep content
    text = re.sub(r"`([^`]*)`", r"\1", text)

    # Remove common markdown emphasis/formatting symbols
    text = text.replace("*", " ")
    text = text.replace("_", " ")
    text = text.replace("~", " ")
    text = text.replace("#", " ")

    # Replace list bullets with pauses
    text = re.sub(r"(?m)^\s*[-•]\s+", " ", text)
    text = re.sub(r"(?m)^\s*\d+\.\s+", " ", text)

    # Collapse multiple punctuation that gets spelled out oddly
    text = re.sub(r"[|<>[\]{}^=]+", " ", text)

    # Normalize whitespace and newlines into sentence-like pauses
    text = text.replace("\r", "\n")
    text = re.sub(r"\n{2,}", ". ", text)
    text = re.sub(r"\n", ". ", text)

    # Final whitespace normalize
    text = ' '.join(text.split()).strip()
    return text


def _edge_voice_candidates(lang: str) -> list[str]:
    """
    Voice candidates for Edge TTS. We try multiple to avoid hard failures.
    """
    key = (lang or "").strip().lower()
    mapping: dict[str, list[str]] = {
        "english": ["en-US-JennyNeural", "en-US-GuyNeural"],
        "urdu": ["ur-PK-UzmaNeural", "ur-PK-AsadNeural"],
        "punjabi": ["ur-PK-UzmaNeural", "ur-PK-AsadNeural"],  # Pakistani Punjabi (Shahmukhi) requires Urdu TTS voices
        "sindhi": ["ur-PK-UzmaNeural", "ur-PK-AsadNeural"],  # fallback
        "pashto": ["ur-PK-UzmaNeural", "ur-PK-AsadNeural"],  # Route through Urdu to avoid ps-AF failing on unknown characters
        "balochi": ["ur-PK-UzmaNeural", "ur-PK-AsadNeural"],  # fallback
    }
    return mapping.get(key, ["en-US-JennyNeural"])


def _try_edge_tts_to_wav(text: str, lang: str, output_path: str) -> bool:
    """
    Try to synthesize speech using Edge TTS (more natural than gTTS).
    Returns True on success, False if Edge TTS isn't available or fails.
    """
    try:
        import asyncio
        import edge_tts  # type: ignore
    except Exception:
        return False

    text = _prepare_tts_text(text)
    if not text:
        return False

    # Edge TTS writes audio bytes to a file path.
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_mp3:
        tmp_mp3_path = tmp_mp3.name

    async def _synth() -> None:
        last_exc: Optional[Exception] = None
        for voice in _edge_voice_candidates(lang):
            try:
                communicate = edge_tts.Communicate(
                    text=text,
                    voice=voice,
                    rate="+8%",   # slightly faster = more natural
                    pitch="+0Hz",
                    volume="+0%",
                )
                await communicate.save(tmp_mp3_path)
                global _LAST_TTS_ENGINE_INFO
                _LAST_TTS_ENGINE_INFO = f"Edge TTS ({voice})"
                return
            except Exception as e:  # try next voice
                last_exc = e
                continue
        if last_exc:
            raise last_exc

    try:
        # Always use a dedicated loop here to avoid "coroutine was never awaited"
        # warnings that can happen when asyncio.run() fails in certain runtimes.
        loop = asyncio.new_event_loop()
        try:
            asyncio.set_event_loop(loop)
            loop.run_until_complete(_synth())
        finally:
            loop.close()
            asyncio.set_event_loop(None)
    except Exception:
        try:
            os.unlink(tmp_mp3_path)
        except Exception:
            pass
        return False

    # Convert to WAV if possible; otherwise, keep MP3 with .wav extension (same fallback as current gTTS behavior)
    try:
        from pydub import AudioSegment  # type: ignore
        audio = AudioSegment.from_mp3(tmp_mp3_path)
        audio.export(output_path, format="wav")
        os.unlink(tmp_mp3_path)
        return True
    except Exception:
        try:
            import shutil
            shutil.copy(tmp_mp3_path, output_path)
            os.unlink(tmp_mp3_path)
            return True
        except Exception:
            try:
                os.unlink(tmp_mp3_path)
            except Exception:
                pass
            return False


def text_to_speech(text: str, lang: str, output_path: Optional[str] = None) -> str:
    """
    Convert text to speech using Google TTS (gTTS) and save as a WAV file.

    Args:
        text: Text to be spoken (in target language).
        lang: Logical language name (e.g., "urdu", "hindi", "english").
        output_path: Optional path to output WAV file; defaults to config.OUTPUT_WAV_PATH.

    Returns:
        Path to the generated WAV file.

    Raises:
        ValueError: If text is empty.
        RuntimeError: If gTTS fails to generate audio.
    """
    if not text:
        raise ValueError("text_to_speech called with empty text.")

    # Sanitize text to remove invalid Unicode surrogates that cause encoding errors
    text = _sanitize_unicode_text(text)
    text = _prepare_tts_text(text)
    
    if not text:
        raise ValueError("text_to_speech called with text that became empty after sanitization.")

    # Normalize text: remove extra whitespace
    text = ' '.join(text.split())  # Normalize whitespace
    text = text.strip()
    
    if not text:
        raise ValueError("text_to_speech called with text that became empty after normalization.")

    output_path = output_path or config.OUTPUT_WAV_PATH
    
    # Ensure output directory exists (handle both absolute and relative paths)
    output_dir = os.path.dirname(output_path)
    if output_dir:  # Only create directory if path contains a directory component
        os.makedirs(output_dir, exist_ok=True)

    # Get gTTS language code
    lang_code = _get_gtts_lang_code(lang)
    
    # Debug: log what we're sending to gTTS
    print(f"[TTS Debug] Language: {lang} (code: {lang_code})")
    print(f"[TTS Debug] Text length: {len(text)} chars")
    print(f"[TTS Debug] Text preview (first 100 chars): {repr(text[:100])}")

    try:
        # Prefer Edge TTS (more natural) when available; fallback to gTTS.
        if _try_edge_tts_to_wav(text=text, lang=lang, output_path=output_path):
            if not os.path.isfile(output_path):
                raise RuntimeError("Edge TTS reported success but output file not found.")
            print(f"TTS audio generated at: {output_path}")
            return output_path

        if gTTS is None:
            raise RuntimeError(
                "No TTS engine available. Install either 'edge-tts' (recommended) or 'gTTS'."
            )

        if lang.strip().lower() == "sindhi":
            print("Warning: Edge TTS failed or was unavailable. Falling back to Google TTS.")
            print("Warning: Google TTS does not support Sindhi. Using Urdu (ur) as fallback.")

        global _LAST_TTS_ENGINE_INFO
        _LAST_TTS_ENGINE_INFO = f"gTTS ({lang_code})"

        # Create gTTS object
        tts = gTTS(text=text, lang=lang_code, slow=False)
        
        # gTTS saves as MP3 by default, so we need to:
        # 1. Save to a temporary MP3 file
        # 2. Convert MP3 to WAV if needed
        # For simplicity, we'll save directly as MP3 and rename to .wav
        # (most audio players can handle MP3 even with .wav extension, but let's convert properly)
        
        # Use a temporary file for MP3
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_mp3:
            tmp_mp3_path = tmp_mp3.name
        
        # Save MP3 to temporary file
        tts.save(tmp_mp3_path)
        
        # Convert MP3 to WAV using pydub (if available) or just copy if not
        try:
            from pydub import AudioSegment
            # Load MP3 and export as WAV
            audio = AudioSegment.from_mp3(tmp_mp3_path)
            audio.export(output_path, format="wav")
            # Clean up temporary MP3 file
            os.unlink(tmp_mp3_path)
        except ImportError:
            # If pydub is not available, just copy the MP3 file with .wav extension
            # This works for most players, but is not ideal
            print("Warning: pydub not available. Saving as MP3 with .wav extension.")
            import shutil
            shutil.copy(tmp_mp3_path, output_path)
            os.unlink(tmp_mp3_path)
        except Exception as e:
            # If conversion fails, try to copy the file anyway
            print(f"Warning: Failed to convert MP3 to WAV: {e}. Saving as MP3 with .wav extension.")
            import shutil
            shutil.copy(tmp_mp3_path, output_path)
            os.unlink(tmp_mp3_path)
            
    except Exception as e:
        error_msg = f"Google TTS failed: {str(e)}\n"
        error_msg += f"Language: {lang} (code: {lang_code})\n"
        error_msg += f"Text length: {len(text)} characters\n"
        
        # Provide specific guidance for common errors
        if "429" in str(e) or "rate limit" in str(e).lower():
            error_msg += "\n" + "="*60 + "\n"
            error_msg += "TROUBLESHOOTING RATE LIMIT ERROR:\n"
            error_msg += "="*60 + "\n"
            error_msg += "Google TTS has rate limits. Please wait a few moments and try again.\n"
        elif "network" in str(e).lower() or "connection" in str(e).lower():
            error_msg += "\n" + "="*60 + "\n"
            error_msg += "TROUBLESHOOTING NETWORK ERROR:\n"
            error_msg += "="*60 + "\n"
            error_msg += "Check your internet connection. Google TTS requires an active internet connection.\n"
        
        raise RuntimeError(error_msg) from e

    # Verify output file was created
    if not os.path.isfile(output_path):
        raise RuntimeError(
            f"Google TTS completed but output file was not created at '{output_path}'. "
            "Check error messages above for details."
        )

    print(f"TTS audio generated at: {output_path}")
    return output_path


def check_gtts_available() -> bool:
    """
    Check if Google TTS (gTTS) is available.
    
    Since gTTS is a Python library, this checks if it can be imported.
    It also requires an internet connection to work.
    
    Returns:
        True if gTTS can be imported, False otherwise.
    """
    try:
        from gtts import gTTS
        return True
    except ImportError:
        return False


__all__ = ["text_to_speech", "check_gtts_available", "get_last_tts_engine_info"]