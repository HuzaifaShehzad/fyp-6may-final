import { useMemo, useRef, useState } from 'react';
import { parseMarkdown } from '../utils/parseMarkdown';
import './ChatMessage.css';

// ─── UI text translations ────────────────────────────────────
const UI_TEXT = {
  en: { you: 'You', ai: 'AI Assistant', stop: 'Stop', delete: 'Delete', readAloud: 'Read aloud' },
  ur: { you: 'آپ', ai: 'اے آئی معاون', stop: 'رکیں', delete: 'ڈیلیٹ', readAloud: 'زور سے پڑھیں' },
  sd: { you: 'توهان', ai: 'اي آئي مددگار', stop: 'بند', delete: 'ڊليٽ', readAloud: 'آواز سان پڙهو' },
  pa: { you: 'تسیں', ai: 'اے آئی مددگار', stop: 'رکو', delete: 'ڈیلیٹ', readAloud: 'اچی آواز نال پڑھو' },
  ps: { you: 'تاسو', ai: 'AI مرسته', stop: 'بندېدن', delete: 'ړنګول', readAloud: 'په غوږ واخلئ' }
};

/**
 * Individual chat message bubble.
 * Supports both user and AI messages with different styling.
 * AI messages render markdown content and include a speaker button for TTS.
 * Localized strings for all UI languages including Pashto.
 */
export default function ChatMessage({
  message,
  onSpeak,
  isSpeaking,
  language = 'en',
  onStopAudio,
  onDeleteAudio
}) {
  const isUser = message.role === 'user';
  const isStatus = message.role === 'status';
  const t = UI_TEXT[language] || UI_TEXT.en;
  const audioElRef = useRef(null);
  const [showAudioActions, setShowAudioActions] = useState(false);

  // Parse markdown for AI messages
  const renderedContent = useMemo(() => {
    if (isUser || isStatus) return null;
    return parseMarkdown(message.text);
  }, [message.text, isUser, isStatus]);

  return (
    <div
      className={`chat-message ${
        isUser ? 'chat-message--user' : isStatus ? 'chat-message--status' : 'chat-message--ai'
      }`}
    >
      {/* Avatar */}
      <div
        className={`chat-message__avatar ${
          isUser ? 'chat-message__avatar--user' : 'chat-message__avatar--ai'
        }`}
      >
        {isUser ? (
          // User avatar icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        ) : (
          // AI avatar — leaf/plant icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.5S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div className="chat-message__content">
        <div className="chat-message__header">
          <span className="chat-message__sender">{isUser ? t.you : t.ai}</span>
          <span className="chat-message__time">{message.time}</span>
        </div>
        <div className="chat-message__bubble">
          {isUser ? (
            <p className="chat-message__text">{message.text}</p>
          ) : isStatus ? (
            <p className="chat-message__text chat-message__text--status">{message.text}</p>
          ) : (
            <div
              className="chat-message__markdown"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          )}

          {!!message.audio_url && (
            <div className="chat-message__audio">
              <div
                className="chat-message__audio-player"
                onClick={() => setShowAudioActions(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setShowAudioActions(true);
                }}
                aria-label="Audio message"
              >
                <audio
                  ref={audioElRef}
                  controls
                  src={`http://127.0.0.1:8000${message.audio_url}`}
                  preload="none"
                />
              </div>

              {showAudioActions && (
                <div className="chat-message__audio-actions">
                  <button
                    type="button"
                    className="chat-message__audio-btn"
                    onClick={() => {
                      try {
                        audioElRef.current?.pause();
                        if (audioElRef.current) audioElRef.current.currentTime = 0;
                      } catch {
                        // ignore
                      }
                      onStopAudio?.();
                    }}
                  >
                    {t.stop}
                  </button>
                  <button
                    type="button"
                    className="chat-message__audio-btn chat-message__audio-btn--danger"
                    onClick={() => {
                      try {
                        audioElRef.current?.pause();
                      } catch {
                        // ignore
                      }
                      onDeleteAudio?.(message.audio_url);
                      setShowAudioActions(false);
                    }}
                  >
                    {t.delete}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* TTS Button for AI messages */}
        {!isUser && !isStatus && (
          <button
            className={`chat-message__speak-btn ${isSpeaking ? 'chat-message__speak-btn--active' : ''}`}
            onClick={() => onSpeak(message.text)}
            title={t.readAloud}
          >
            
          </button>
        )}
      </div>
    </div>
  );
}
