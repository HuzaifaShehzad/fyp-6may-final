"""
Configuration for the multilingual speech-to-speech translation project.
Edit this file to change defaults for target language, model paths, and API keys.
"""

import os

# =========================
# Gemini API configuration
# =========================

# Prefer environment variable so secrets are not committed to disk.
# Fallback to hard-coded placeholder that the user can edit.
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

# Target language for translation (logical language name, not locale code)
# Set to "urdu" for Urdu-focused translation with Urdu script (Nastaliq/Perso-Arabic) output
TARGET_LANGUAGE: str = "urdu"

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
# Supported languages: English, Urdu, Hindi, Punjabi
# Note: Sindhi is not directly supported by gTTS, so it falls back to Urdu TTS
# 
# INSTALLATION:
#    pip install gtts pydub
#
# Note: gTTS requires an active internet connection to work.

# Default audio output file paths
OUTPUT_WAV_PATH: str = os.path.join(os.path.dirname(__file__), "output.wav")
TEMP_INPUT_WAV_PATH: str = os.path.join(os.path.dirname(__file__), "input.wav")


