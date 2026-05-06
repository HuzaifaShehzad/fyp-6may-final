import os
import io
import time
import threading
import queue

import numpy as np
import sounddevice as sd
import soundfile as sf
import streamlit as st

import config
import stt
import translate
import tts


st.set_page_config(
    page_title="AI Agriculture Assistant |  اے آئی زرعی معاون",
    page_icon="",
    layout="wide",
)

# Custom CSS for greenish theme and text display
st.markdown("""
    <style>
    /* Main background - greenish theme */
    .stApp {
        background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
    }
    
    /* Main content area */
    .main .block-container {
        background-color: #f1f8e9;
        padding: 2rem;
        border-radius: 10px;
    }
    
    /* Urdu text styling - simple white box with black text */
    .urdu-text {
        font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Al Qalam Taj Nastaleeq', 'Nafees Web Naskh', Arial, sans-serif;
        font-size: 24px !important;
        line-height: 1.8;
        direction: rtl;
        text-align: right;
        padding: 20px;
        background: #ffffff;
        color: #000000;
        border-radius: 8px;
        border: 1px solid #c8e6c9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 10px 0;
    }
    
    /* LTR text styling - simple white box with black text */
    .ltr-text {
        font-family: Arial, sans-serif;
        font-size: 24px !important;
        line-height: 1.8;
        direction: ltr;
        text-align: left;
        padding: 20px;
        background: #ffffff;
        color: #000000;
        border-radius: 8px;
        border: 1px solid #c8e6c9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 10px 0;
    }
    
    /* Text area styling */
    .stTextArea textarea {
        font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Al Qalam Taj Nastaleeq', 'Nafees Web Naskh', Arial, sans-serif !important;
        font-size: 22px !important;
        line-height: 1.8 !important;
        direction: rtl !important;
        text-align: right !important;
        padding: 15px !important;
        background: #ffffff !important;
        color: #000000 !important;
    }
    
    /* Section headers */
    h3, h4 {
        color: #2e7d32;
        margin-top: 20px;
    }
    
    /* Button styling */
    .stButton > button {
        width: 100%;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 8px;
        transition: all 0.3s;
        background-color: #4caf50;
        color: white;
    }
    
    .stButton > button:hover {
        background-color: #45a049;
    }
    
    /* Recording status indicator */
    .recording-status {
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
        font-weight: bold;
        text-align: center;
    }
    
    .recording-active {
        background-color: #ff4444;
        color: white;
        animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    /* Info boxes */
    .stInfo {
        background-color: #e8f5e9;
        border-left: 4px solid #4caf50;
    }
    
    /* Success messages */
    .stSuccess {
        background-color: #c8e6c9;
    }
    </style>
""", unsafe_allow_html=True)


def _record_from_mic(seconds: int) -> str:
    """Record audio from system microphone, save to temp WAV, and return path."""
    samplerate = config.SAMPLE_RATE
    st.info(f"Recording for {seconds} seconds...")
    audio = sd.rec(int(seconds * samplerate), samplerate=samplerate, channels=1, dtype="float32")
    sd.wait()

    out_path = config.TEMP_INPUT_WAV_PATH
    sf.write(out_path, audio.flatten(), samplerate)
    return out_path


def _record_continuous(samplerate: int, stop_event: threading.Event, audio_queue: queue.Queue):
    """Record audio continuously until stop_event is set."""
    audio_data = []
    
    def callback(indata, frames, time, status):
        if status:
            print(status)
        audio_data.append(indata.copy())
    
    with sd.InputStream(samplerate=samplerate, channels=1, dtype="float32", callback=callback):
        while not stop_event.is_set():
            time.sleep(0.1)
    
    if audio_data:
        audio_queue.put(np.concatenate(audio_data, axis=0))


def main() -> None:
    st.title("AI Agriculture Assistant | اے آئی زرعی معاون")
    st.markdown(
        "Local **Whisper** (STT) + **Gemini 2.5 Flash** (translation) + **Google TTS** (TTS)."
    )

    # Sidebar configuration
    st.sidebar.header("Settings")
    language_options = ["urdu", "english", "punjabi", "sindhi", "pashto"]
    default_index = language_options.index(config.TARGET_LANGUAGE) if config.TARGET_LANGUAGE in language_options else 0
    target_lang = st.sidebar.selectbox("Target language", language_options, index=default_index)

    tab_mic, tab_upload = st.tabs(["Microphone", "Upload Audio File"])

    with tab_mic:
        st.subheader("Record from Microphone")
        st.caption("Use your system default microphone. Whisper will auto-detect the spoken language.")

        # Initialize session state for recording
        if 'recording' not in st.session_state:
            st.session_state.recording = False
        if 'stop_recording' not in st.session_state:
            st.session_state.stop_recording = threading.Event()
        if 'audio_queue' not in st.session_state:
            st.session_state.audio_queue = queue.Queue()
        if 'recording_thread' not in st.session_state:
            st.session_state.recording_thread = None
        if 'processed_audio_path' not in st.session_state:
            st.session_state.processed_audio_path = None

        col1, col2 = st.columns([1, 2])
        with col1:
            # Recording controls
            button_col1, button_col2 = st.columns(2)
            
            with button_col1:
                if st.button("START", type="primary", disabled=st.session_state.recording):
                    # Clear previous results and processing state
                    st.session_state.processed_audio_path = None
                    st.session_state.processing_step = None
                    if 'transcribed_text' in st.session_state:
                        del st.session_state.transcribed_text
                    if 'translated_text' in st.session_state:
                        del st.session_state.translated_text
                    if 'translated_text_display' in st.session_state:
                        del st.session_state.translated_text_display
                    if 'translated_text_audio' in st.session_state:
                        del st.session_state.translated_text_audio
                    if 'output_audio_path' in st.session_state:
                        del st.session_state.output_audio_path
                    
                    st.session_state.recording = True
                    st.session_state.stop_recording.clear()
                    st.session_state.audio_queue = queue.Queue()
                    st.session_state.recording_thread = threading.Thread(
                        target=_record_continuous,
                        args=(config.SAMPLE_RATE, st.session_state.stop_recording, st.session_state.audio_queue)
                    )
                    st.session_state.recording_thread.start()
                    st.rerun()
            
            with button_col2:
                if st.button("STOP", disabled=not st.session_state.recording):
                    st.session_state.recording = False
                    st.session_state.stop_recording.set()
                    if st.session_state.recording_thread:
                        st.session_state.recording_thread.join(timeout=3)
                    
                    # Wait a bit for audio to be queued
                    time.sleep(0.5)
                    
                    # Process the recorded audio
                    if not st.session_state.audio_queue.empty():
                        audio_data = st.session_state.audio_queue.get()
                        if audio_data is not None and len(audio_data) > 0:
                            out_path = config.TEMP_INPUT_WAV_PATH
                            sf.write(out_path, audio_data.flatten(), config.SAMPLE_RATE)
                            st.session_state.processed_audio_path = out_path
                            st.rerun()
                        else:
                            st.error("No audio data captured. Please try recording again.")
                    else:
                        st.warning("Recording stopped, but no audio was captured. Please try again.")
            
            # Recording status
            if st.session_state.recording:
                st.markdown(
                    '<div class="recording-status recording-active"> RECORDING... Click Stop when finished</div>',
                    unsafe_allow_html=True
                )
            
            # Process audio if available
            if st.session_state.processed_audio_path and os.path.exists(st.session_state.processed_audio_path):
                audio_path = st.session_state.processed_audio_path
                st.success("Audio recorded successfully")
                
                # Show raw audio
                with open(audio_path, "rb") as f:
                    audio_bytes = f.read()
                st.audio(audio_bytes, format="audio/wav")
                
                # Initialize processing state
                if 'processing_step' not in st.session_state:
                    st.session_state.processing_step = None
                
                # Process audio step by step
                if st.button("PROCESS"):
                    st.session_state.processing_step = 'transcribing'
                    st.rerun()
                
                # Step 1: Transcribing
                if st.session_state.processing_step == 'transcribing':
                    with st.spinner(" Transcribing audio..."):
                        text, detected_lang_code = stt.speech_to_text(audio_path)
                        detected_lang_name = stt.map_whisper_lang_to_name(detected_lang_code)
                        
                        # Store results in session state
                        st.session_state.detected_lang = detected_lang_name
                        st.session_state.detected_lang_code = detected_lang_code
                        st.session_state.transcribed_text = text
                        st.session_state.processing_step = 'translating'
                        st.rerun()
                
                # Step 2: Translation (only if transcription is done)
                if st.session_state.processing_step == 'translating' and 'transcribed_text' in st.session_state:
                    with st.spinner("Translating..."):
                        translated = translate.translate_text(st.session_state.transcribed_text, target_lang=target_lang)
                        # For Punjabi, render the LLM response itself in Shahmukhi (Urdu) script for display,
                        # while keeping the Punjabi response for TTS.
                        if target_lang == "punjabi":
                            display_prompt = (
                                "Convert the following Punjabi response into Shahmukhi (Urdu) script only. "
                                "Do not change wording or meaning. "
                                "Return only Punjabi in Shahmukhi script without explanations.\n\n"
                                f"Punjabi response:\n{translated}"
                            )
                            display_translation = translate.translate_text(display_prompt, target_lang="punjabi")
                            st.session_state.translated_text_display = display_translation
                            st.session_state.translated_text_audio = translated
                        else:
                            st.session_state.translated_text_display = translated
                            st.session_state.translated_text_audio = translated
                        st.session_state.processing_step = 'synthesizing'
                        st.rerun()
                
                # Step 3: TTS (only if translation is done)
                if (
                    st.session_state.processing_step == 'synthesizing'
                    and 'translated_text_audio' in st.session_state
                    and st.session_state.translated_text_audio
                ):
                    with st.spinner("Synthesizing speech..."):
                        out_path = tts.text_to_speech(st.session_state.translated_text_audio, lang=target_lang, output_path=config.OUTPUT_WAV_PATH)
                        st.session_state.output_audio_path = out_path
                        st.session_state.processing_step = 'complete'
                        st.rerun()
        
        with col2:
            st.info(
                "Click **Start Recording** to begin capturing audio from your microphone. "
                "Click **Stop Recording** when finished, then click **Process Audio** to transcribe, "
                "translate, and synthesize speech in the selected target language."
            )
            
            # Display results incrementally as they become available
            if 'transcribed_text' in st.session_state and st.session_state.transcribed_text:
                st.markdown("---")
                st.markdown("### Results")
                
                # Step 1: Show transcribed text
                st.markdown("####  Step 1: Transcribed Text")
                st.write(f"**Detected Language:** {st.session_state.detected_lang} (`{st.session_state.detected_lang_code}`)")
                
                transcribed_display = st.session_state.transcribed_text
                st.markdown(
                    f'<div class="urdu-text" dir="rtl">{transcribed_display}</div>',
                    unsafe_allow_html=True
                )
                
                # Step 2: Show translated text (if available)
                if 'translated_text_display' in st.session_state and st.session_state.translated_text_display:
                    st.markdown("####  Step 2: Translated Text")
                    translated_display = st.session_state.translated_text_display
                    # Show Urdu-style box for Urdu or Punjabi (Punjabi displayed in Urdu script)
                    if target_lang in ("urdu", "punjabi"):
                        st.markdown(
                            f'<div class="urdu-text" dir="rtl">{translated_display}</div>',
                            unsafe_allow_html=True
                        )
                    else:
                        st.markdown(
                            f'<div class="ltr-text" dir="ltr">{translated_display}</div>',
                            unsafe_allow_html=True
                        )
                    
                    # Step 3: Show output audio (if available)
                    if 'output_audio_path' in st.session_state and os.path.exists(st.session_state.output_audio_path):
                        st.markdown("####  Step 3: Output Audio")
                        with open(st.session_state.output_audio_path, "rb") as f:
                            out_bytes = f.read()
                        st.audio(out_bytes, format="audio/wav")

    with tab_upload:
        st.subheader("Upload Audio File")
        uploaded_file = st.file_uploader("Upload audio file (WAV recommended)", type=["wav", "mp3", "m4a"])

        if uploaded_file is not None:
            # Save uploaded audio to temp path
            temp_path = config.TEMP_INPUT_WAV_PATH
            # Read file-like into bytes then write out
            raw = uploaded_file.read()
            with open(temp_path, "wb") as f:
                f.write(raw)

            st.markdown("#### Input Audio")
            st.audio(raw)
            
            # Initialize processing state for upload tab
            if 'upload_processing_step' not in st.session_state:
                st.session_state.upload_processing_step = None
            
            # Process audio step by step
            if st.button(" Process Uploaded Audio", type="primary"):
                # Clear previous results when starting new processing
                st.session_state.upload_processing_step = None
                if 'upload_transcribed_text' in st.session_state:
                    del st.session_state.upload_transcribed_text
                if 'upload_translated_text' in st.session_state:
                    del st.session_state.upload_translated_text
                if 'upload_translated_text_display' in st.session_state:
                    del st.session_state.upload_translated_text_display
                if 'upload_translated_text_audio' in st.session_state:
                    del st.session_state.upload_translated_text_audio
                if 'upload_output_audio_path' in st.session_state:
                    del st.session_state.upload_output_audio_path
                st.session_state.upload_processing_step = 'transcribing'
                st.rerun()
            
            # Step 1: Transcribing
            if st.session_state.upload_processing_step == 'transcribing':
                with st.spinner(" Transcribing audio..."):
                    text, detected_lang_code = stt.speech_to_text(temp_path)
                    detected_lang_name = stt.map_whisper_lang_to_name(detected_lang_code)
                    
                    # Store in session state for upload tab
                    st.session_state.upload_detected_lang = detected_lang_name
                    st.session_state.upload_detected_lang_code = detected_lang_code
                    st.session_state.upload_transcribed_text = text
                    st.session_state.upload_processing_step = 'translating'
                    st.rerun()
            
            # Step 2: Translation (only if transcription is done)
            if st.session_state.upload_processing_step == 'translating' and 'upload_transcribed_text' in st.session_state:
                with st.spinner(" Translating text..."):
                    translated = translate.translate_text(st.session_state.upload_transcribed_text, target_lang=target_lang)
                    # For Punjabi, render the LLM response itself in Shahmukhi (Urdu) script for display,
                    # while keeping the Punjabi response for TTS.
                    if target_lang == "punjabi":
                        display_prompt = (
                            "Convert the following Punjabi response into Shahmukhi (Urdu) script only. "
                            "Do not change wording or meaning. "
                            "Return only Punjabi in Shahmukhi script without explanations.\n\n"
                            f"Punjabi response:\n{translated}"
                        )
                        display_translation = translate.translate_text(display_prompt, target_lang="punjabi")
                        st.session_state.upload_translated_text_display = display_translation
                        st.session_state.upload_translated_text_audio = translated
                    else:
                        st.session_state.upload_translated_text_display = translated
                        st.session_state.upload_translated_text_audio = translated
                    st.session_state.upload_processing_step = 'synthesizing'
                    st.rerun()
            
            # Step 3: TTS (only if translation is done)
            if (
                st.session_state.upload_processing_step == 'synthesizing'
                and 'upload_translated_text_audio' in st.session_state
                and st.session_state.upload_translated_text_audio
            ):
                with st.spinner(" Synthesizing speech..."):
                    out_path = tts.text_to_speech(st.session_state.upload_translated_text_audio, lang=target_lang, output_path=config.OUTPUT_WAV_PATH)
                    st.session_state.upload_output_audio_path = out_path
                    st.session_state.upload_processing_step = 'complete'
                    st.rerun()
            
            # Display results incrementally if available
            if 'upload_transcribed_text' in st.session_state and st.session_state.upload_transcribed_text:
                st.markdown("---")
                st.markdown("###  Results")
                
                # Step 1: Show transcribed text
                st.markdown("####  Step 1: Transcribed Text")
                st.write(f"**Detected Language:** {st.session_state.upload_detected_lang} (`{st.session_state.upload_detected_lang_code}`)")
                
                transcribed_display = st.session_state.upload_transcribed_text
                st.markdown(
                    f'<div class="urdu-text" dir="rtl">{transcribed_display}</div>',
                    unsafe_allow_html=True
                )
                
                # Step 2: Show translated text (if available)
                if 'upload_translated_text_display' in st.session_state and st.session_state.upload_translated_text_display:
                    st.markdown("####  Step 2: Translated Text")
                    translated_display = st.session_state.upload_translated_text_display
                    # Show Urdu-style box for Urdu or Punjabi (Punjabi displayed in Urdu script)
                    if target_lang in ("urdu", "punjabi"):
                        st.markdown(
                            f'<div class="urdu-text" dir="rtl">{translated_display}</div>',
                            unsafe_allow_html=True
                        )
                    else:
                        st.markdown(
                            f'<div class="ltr-text" dir="ltr">{translated_display}</div>',
                            unsafe_allow_html=True
                        )
                    
                    # Step 3: Show output audio (if available)
                    if 'upload_output_audio_path' in st.session_state and os.path.exists(st.session_state.upload_output_audio_path):
                        st.markdown("####  Step 3: Output Audio")
                        with open(st.session_state.upload_output_audio_path, "rb") as f:
                            out_bytes = f.read()
                        st.audio(out_bytes, format="audio/wav")


if __name__ == "__main__":
    main()


