## Multilingual Speech-to-Speech Translator

This project provides a **local speech-to-speech translation pipeline**:

- **Microphone input** in many languages (Hindi, Urdu, Punjabi, Sindhi, English, etc.)
- **Whisper (local)** for speech-to-text
- **Gemini 2.5 Flash (free tier)** for text translation
- **Piper TTS (local)** for text-to-speech
- **Audio playback** of the translated speech

Everything runs **locally** except the **Gemini translation API**.

---

### Features

- **Multilingual STT** with Whisper `medium` model and automatic language detection.
- **Gemini 2.5 Flash** for high-quality translation using a **free-tier API key**.
- **Piper TTS** with configurable voices:
  - Hindi → `hin-IN-sharma-medium.onnx`
  - Urdu → e.g. `ur_PK-ameen-medium.onnx`
  - Punjabi → falls back to Hindi voice
  - Sindhi → falls back to Urdu voice
  - English → `en_US-lessac-medium.onnx`
- **Menu-driven CLI**:
  1. Speak → Translate → Listen  
  2. Translate existing audio file  
  3. Change target language  
  4. Change TTS voice  
  5. Exit

---

### Project Structure

```text
multilingual_s2s_project/
│── main.py
│── stt.py
│── translate.py
│── tts.py
│── audio_utils.py
│── config.py
│── requirements.txt
└── README.md
```

---

### Installation

#### 1. Create and activate a virtual environment (recommended)

```bash
cd multilingual_s2s_project/..
python -m venv .venv
.\.venv\Scripts\activate  # on Windows PowerShell
```

#### 2. Install Python dependencies

From inside the `multilingual_s2s_project` parent directory:

```bash
pip install -r multilingual_s2s_project/requirements.txt
```

This installs:

- `openai-whisper`
- `sounddevice`
- `soundfile`
- `numpy`
- `google-generativeai`

> Note: Whisper downloads model weights on first use. The `medium` model is larger and slower but gives better multilingual accuracy.

#### 3. Install Whisper

`openai-whisper` is already in `requirements.txt`. If you prefer, you can install manually:

```bash
pip install openai-whisper
```

The first time you run the project, Whisper will download the `medium` model automatically.

#### 4. Install Piper TTS and download voices

1. Download Piper binary for your platform from the official repository (e.g. `piper.exe` for Windows).  
2. Ensure `piper` (or `piper.exe`) is on your **PATH**, or update `PIPER_EXECUTABLE` in `config.py`.
3. Create a `voices` directory inside `multilingual_s2s_project`:

```bash
mkdir multilingual_s2s_project\voices
```

4. Download voice models (ONNX files) into `multilingual_s2s_project\voices`. Example suggestions:

- **Hindi**: `hin-IN-sharma-medium.onnx`
- **Urdu**: any `ur_PK-*.onnx` voice, e.g. `ur_PK-ameen-medium.onnx`
- **English**: `en_US-lessac-medium.onnx`

Punjabi and Sindhi will **fallback** to Hindi and Urdu voices respectively.

5. Make sure the filenames in `config.PIPER_VOICE_MODELS` match the downloaded files.

#### 5. Configure API keys with `.env`

Create a local env file from the template:

```bash
copy .env.example .env   # Windows PowerShell / CMD
```

Then fill `Backend/.env` with your real keys.

You can also set the values via environment variables:

```bash
$env:GEMINI_API_KEY="your_real_key_here"  # PowerShell
$env:OPENWEATHER_API_KEY="your_openweather_key_here"  # PowerShell
```

The code uses:

```python
import google.generativeai as genai

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")
```

Only Gemini is used for translation; no local LLMs are used.

---

### Supported Languages

Thanks to Whisper and Gemini, the system can handle many languages. It is **explicitly configured and tested** for:

- **Hindi**
- **Punjabi** (via Whisper + translation; TTS uses Hindi voice)
- **Sindhi** (via Whisper + translation; TTS uses Urdu voice)
- **Urdu**
- **English**
- And many more via Whisper + Gemini translation

Whisper automatically **detects the input language**, and Gemini automatically detects the source language when translating.

---

### How to Run

From the project root (where `multilingual_s2s_project` lives):

```bash
python -m multilingual_s2s_project.main
```

Or, if you `cd` into `multilingual_s2s_project`:

```bash
python main.py
```

You will see a menu:

```text
1. Speak → Translate → Listen
2. Translate existing audio file
3. Change target language
4. Change TTS voice
5. Exit
```

Typical flow:

1. Choose **option 1**.
2. Speak in any supported language (Hindi, Urdu, Punjabi, Sindhi, English, etc.).
3. Whisper transcribes and auto-detects language.
4. Gemini translates into the configured **target language** (default: Urdu).
5. Piper TTS generates audio and the app plays it back.

---

### Configuration

Edit `config.py` to adjust:

- **Target language**:

  ```python
  TARGET_LANGUAGE = "urdu"
  ```

- **Piper settings**:

  ```python
  PIPER_EXECUTABLE = "piper"  # or full path to piper.exe on Windows
  PIPER_VOICES_DIR = os.path.join(os.path.dirname(__file__), "voices")
  PIPER_VOICE_MODELS = {
      "hindi": "hin-IN-sharma-medium.onnx",
      "urdu": "ur_PK-ameen-medium.onnx",
      "sindhi": "ur_PK-ameen-medium.onnx",   # fallback to Urdu
      "punjabi": "hin-IN-sharma-medium.onnx",  # fallback to Hindi
      "english": "en_US-lessac-medium.onnx",
  }
  ```

- **Whisper settings**:

  ```python
  WHISPER_MODEL_NAME = "medium"
  SAMPLE_RATE = 16000
  DEFAULT_RECORD_SECONDS = 10
  ```

You can also change voices at runtime using menu option **4. Change TTS voice**.

---

### Troubleshooting

- **Microphone issues**
  - Error like “No default input device”: configure your microphone in the OS audio settings.
  - Try specifying a different device index with `sounddevice` if needed.

- **Piper model missing**
  - Error similar to: `Piper model not found at '...onnx'`.
  - Ensure you downloaded the `.onnx` voice model into the `voices` directory.
  - Confirm filenames match those in `config.PIPER_VOICE_MODELS`.

- **Piper not found**
  - Error like: `Could not run Piper executable 'piper'`.
  - Make sure `piper` is installed and added to `PATH`, or set `PIPER_EXECUTABLE` in `config.py` to the full path (e.g., `C:\\tools\\piper.exe`).

- **Gemini API quota or key errors**
  - Errors from `google-generativeai` such as invalid API key or quota exceeded.
  - Verify `GEMINI_API_KEY` is set correctly and that you are using a free-tier key with active quota.

- **Whisper slow on CPU**
  - The `medium` model is accurate but heavy.
  - If performance is too slow, temporarily change in `config.py`:

    ```python
    WHISPER_MODEL_NAME = "small"
    ```

  - This will reduce accuracy slightly but speed up transcriptions.

- **No sound on playback**
  - Make sure your speakers are set as default output in the OS.
  - Check system volume and ensure other apps can play audio.

---

### Notes

- All STT and TTS are **local** (Whisper + Piper).
- **Only translation** uses the **Gemini 2.5 Flash** API.
- No Ollama or other local LLMs are used.


