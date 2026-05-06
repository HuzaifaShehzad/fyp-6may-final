import { useState, useEffect, useRef, useCallback } from 'react';
import { placeholderTexts, quickReplyChips } from '../data/responses';
import './ChatInput.css';

const UI_TEXT = {
  en: {
    recording: 'Listening...',
    imageNotice: 'Audio uploaded — processing...',
    disclaimer: 'AI Assistant provides general guidance.',
    uploadTitle: 'Upload audio'
  },
  ur: {
    recording: 'سن رہا ہے...',
    imageNotice: 'آڈیو اپلوڈ ہوگئی — پروسیسنگ جاری ہے...',
    disclaimer: 'اے آئی معاون مشورہ فراہم کرتا ہے۔',
    uploadTitle: 'آڈیو اپلوڈ کریں'
  },
  sd: {
    recording: 'ٻڌي رهيو آهي...',
    imageNotice: 'آڈیو اپلوڈ ٿي وئي — پروسيس ٿي رهي آهي...',
    disclaimer: 'AI مددگار عام صلاح ڏئي ٿو۔',
    uploadTitle: 'آڈیو اپلوڈ ڪريو'
  },
  pa: {
    recording: 'سن رہیا اے...',
    imageNotice: 'آڈیو اپلوڈ ہو گئی — پروسیسنگ ہو رہی ہے...',
    disclaimer: 'AI مددگار عمومی صلاح دیندا اے۔',
    uploadTitle: 'آڈیو اپلوڈ کرو'
  },
  ps: {
    recording: 'اورېدلو...',
    imageNotice: 'غږ وسپاری شو — په چار کې دی...',
    disclaimer: 'AI مرسته عمومې لارښوونه ورکوي.',
    uploadTitle: 'غږ فایل پورته کړئ'
  }
};

const langMap = {
  en: "english",
  ur: "urdu",
  sd: "sindhi",
  pa: "punjabi",
  ps: "pashto",
};

export default function ChatInput({
  onSend,
  language,
  disabled,
  onUploadComplete,
  onToggleMic,
  isRecording
}){

  const [input, setInput] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showFileNotice, setShowFileNotice] = useState(false);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = UI_TEXT[language] || UI_TEXT.en;
  const isRTL = ['ur', 'sd', 'pa', 'ps'].includes(language);

  // placeholder rotation
  useEffect(() => {
    const placeholders = placeholderTexts[language] || placeholderTexts.en;

    const interval = setInterval(() => {
      setTimeout(() => {
        setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [language]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setInput('');
    inputRef.current?.focus();
  }, [input, disabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ FIX ONLY: correct backend endpoint
  const handleAudioUpload = async (e) => {
    const target = e.target;
    const file = target.files?.[0];
    if (!file) return;

    setShowFileNotice(true);

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/speech-to-speech-record?target_lang=${langMap[language]}`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      // SEND RESULT TO APP.JSX ONLY
      if (onUploadComplete) {
        onUploadComplete(data);
      }

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
    } finally {
      setShowFileNotice(false);
      target.value = "";
    }
  };
  const handleAudioClick = () => {
    
    fileInputRef.current?.click();
  }

  const placeholders = placeholderTexts[language] || placeholderTexts.en;
  const currentPlaceholder = placeholders[placeholderIndex % placeholders.length];
  const chips = quickReplyChips[language] || quickReplyChips.en;

  return (
    <div className="chat-input">

      <div className="chat-input__chips" dir={isRTL ? 'rtl' : 'ltr'}>
        {chips.map((chip, i) => (
          <button
            key={i}
            className="chat-input__chip"
            onClick={() => onSend(chip.query)}
            disabled={disabled}
          >
            <span>{chip.icon}</span>
            {chip.label}
          </button>
        ))}
      </div>

      {showFileNotice && (
        <div className="chat-input__file-notice">
          {t.imageNotice}
        </div>
      )}

      {/* ✅ YOUR ORIGINAL UI (UNCHANGED) */}
      <div className="chat-input__container">

        {/* 🎤 MIC BUTTON */}
        <button
          className={`chat-input__icon-btn ${isRecording ? 'chat-input__icon-btn--recording' : ''}`}
          onClick={onToggleMic}
          type="button"
          aria-label={isRecording ? "Stop recording" : "Start voice input"}
          title={isRecording ? "Click to stop" : "Click to speak"}
        >
          {isRecording ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="7" y="7" width="10" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 3.07-2.13 5.64-5 6.32V21h-2v-3.68C7.13 16.64 5 14.07 5 11H3c0 3.53 2.61 6.43 6 6.92V22h6v-4.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </button>
        {/* 📎 UPLOAD BUTTON (UNCHANGED) */}
        <button
          className="chat-input__icon-btn"
          onClick={handleAudioClick}
          type="button"
          aria-label="Attach file"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 6.5l-7.79 7.79a3 3 0 104.24 4.24l8.49-8.49a5 5 0 10-7.07-7.07L5.88 11.46a7 7 0 109.9 9.9l7.07-7.07"/>
          </svg>
        </button>

        <input
  ref={fileInputRef}
  type="file"
  accept="audio/*"
  onChange={(e) => {
    console.log("INPUT TRIGGERED");
    handleAudioUpload(e);
  }}
  style={{ display: "none" }}
/>

        {isRecording ? (
          <div className="chat-input__recording-overlay" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="chat-input__recording-dot"></div>
            {t.recording}
          </div>
        ) : (
          <textarea
            className="chat-input__textarea"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
            disabled={disabled}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        )}

        {/* ➤ SEND BUTTON (UNCHANGED) */}
        <button
          className="chat-input__send-btn"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          type="button"
        >
          ➤
        </button>

      </div>

      <p className="chat-input__disclaimer">
        {t.disclaimer}
      </p>
    </div>
  );
}