import { useMemo, useState, useEffect } from 'react';
import './VoiceVisualizer.css';

// ─── UI text translations ────────────────────────────────────
const UI_TEXT = {
  en: { listening: 'Listening...', youSaid: 'You said:', stop: 'Stop Recording', waiting: 'Speak now...' },
  ur: { listening: 'سن رہا ہے...', youSaid: 'آپ نے کہا:', stop: 'رکیں', waiting: 'بولیں...' },
  sd: { listening: 'ٻڌي رهيو آهي...', youSaid: 'توهان چيو:', stop: 'بند ڪريو', waiting: 'هاڻي ڳالهايو...' },
  pa: { listening: 'سن رہیا اے...', youSaid: 'تسیں کہیا:', stop: 'رکو', waiting: 'ہنے بولو...' },
  ps: { listening: 'اورېدلو...', youSaid: 'تاسو ووېل:', stop: 'ثبت بند کړئ', waiting: 'اوس غږ وکړئ...' }
};

/**
 * Audio waveform visualizer shown when microphone is active.
 * Displays animated bars and a LIVE transcript from speech recognition.
 * No hardcoded text — shows real-time recognized speech.
 */
export default function VoiceVisualizer({ isListening, language, onClose, liveTranscript }) {
  const [showTranscript, setShowTranscript] = useState(false);

  const t = UI_TEXT[language] || UI_TEXT.en;
  const isRTL = ['ur', 'sd', 'pa', 'ps'].includes(language);
  const bars = useMemo(() => {
    // Stable pseudo-random durations without Math.random in render.
    const len = 20;
    return Array.from({ length: len }, (_, i) => {
      const seed = (i * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      return 0.4 + rnd * 0.6;
    });
  }, []);

  // Show transcript area after a small delay when listening starts
  useEffect(() => {
    if (!isListening) {
      const t = setTimeout(() => setShowTranscript(false), 0);
      return () => clearTimeout(t);
    }

    const timer = setTimeout(() => {
      setShowTranscript(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [isListening]);

  if (!isListening) return null;

  return (
    <div className="voice-visualizer" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="voice-visualizer__overlay" onClick={onClose} />
      <div className="voice-visualizer__panel">
        {/* Pulsing circle */}
        <div className="voice-visualizer__pulse-container">
          <div className="voice-visualizer__pulse-ring voice-visualizer__pulse-ring--1" />
          <div className="voice-visualizer__pulse-ring voice-visualizer__pulse-ring--2" />
          <div className="voice-visualizer__pulse-ring voice-visualizer__pulse-ring--3" />
          <div className="voice-visualizer__mic-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            </svg>
          </div>
        </div>

        {/* Waveform bars */}
        <div className="voice-visualizer__waveform">
          {bars.map((dur, i) => (
            <div
              key={i}
              className="voice-visualizer__bar"
              style={{
                animationDelay: `${i * 0.06}s`,
                animationDuration: `${dur}s`
              }}
            />
          ))}
        </div>

        {/* Status */}
        <div className="voice-visualizer__status">
          <div className="voice-visualizer__status-dot" />
          <span>{t.listening}</span>
        </div>

        {/* Live transcript preview */}
        <div className={`voice-visualizer__transcript ${showTranscript ? 'voice-visualizer__transcript--visible' : ''}`}>
          <span className="voice-visualizer__transcript-label">
            {liveTranscript ? t.youSaid : t.waiting}
          </span>
          <p className="voice-visualizer__transcript-text">
            {liveTranscript || ''}
            <span className="voice-visualizer__cursor" />
          </p>
        </div>

        {/* Stop button */}
        <button className="voice-visualizer__stop-btn" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
          {t.stop}
        </button>
      </div>
    </div>
  );
}
