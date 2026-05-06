"""
Configuration for the multilingual speech-to-speech translation project.
Edit this file to change defaults for target language, model paths, and API keys.
"""

import os
from pathlib import Path

# Load `Backend/.env` if present so local runs work
try:
    from dotenv import load_dotenv  # type: ignore

    load_dotenv(dotenv_path=Path(__file__).with_name(".env"), override=False)
except Exception:
    # dotenv is optional; environment variables can be set by the shell/host.
    pass

# =========================
# Gemini API configuration
# =========================

# Prefer environment variable so secrets are not committed.
# Supports legacy env var name `GEMINI_API` (some .env files use it).
GEMINI_API_KEY: str = (os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API") or "").strip()

# Default model for generation
GEMINI_MODEL_NAME: str = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash")

# Target language for translation (logical language name, not locale code)
# Set to "urdu" for Urdu-focused translation with Urdu script (Nastaliq/Perso-Arabic) output
TARGET_LANGUAGE: str = "urdu"

# Model for generation
QWEN_MODEL_NAME: str = "qwen2.5_agri"

# =========================
# Whisper configuration
# =========================

# Whisper model name – use "medium" as requested for better multilingual accuracy.
WHISPER_MODEL_NAME: str = "medium"

# Sample rate for recording audio (Whisper expects 16 kHz)
SAMPLE_RATE: int = 16000

# Duration (seconds) for microphone recording in menu option 1 (can be overridden)
DEFAULT_RECORD_SECONDS: int = 10

# =========================
# Google TTS configuration
# =========================

# Google TTS (gTTS) is used for text-to-speech conversion.
# No additional configuration needed - gTTS automatically handles language selection.
# Supported languages: English, Urdu, Hindi, Punjabi, Pashto
# Note: Sindhi and Pashto are not supported by gTTS; both fall back to Urdu TTS
# 
# INSTALLATION:
#    pip install gtts pydub
#
# Note: gTTS requires an active internet connection to work.

# Default audio output file paths
OUTPUT_WAV_PATH: str = os.path.join(os.path.dirname(__file__), "output.wav")
TEMP_INPUT_WAV_PATH: str = os.path.join(os.path.dirname(__file__), "input.wav")


