import { useState, useEffect } from 'react';
import './Header.css';

// ─── UI text translations ────────────────────────────────────
const UI_TEXT = {
  en: { title: 'AI Agriculture Assistant', subtitle: 'Your Smart Farming Companion', cloudSync: 'Cloud Synced', offline: 'Offline Mode', newChat: 'New Chat', back: 'Back' },
  ur: { title: 'اے آئی زرعی معاون', subtitle: 'آپ کا ذہین کھیتی باڑی ساتھی', cloudSync: 'کلاؤڈ سنک', offline: 'آف لائن موڈ', newChat: 'نئی چیٹ', back: 'واپس' },
  sd: { title: 'اي آئي زرعي مددگار', subtitle: 'توهانجو سمجهدار کيتي ساٿي', cloudSync: 'ڪلاؤڊ سنڪ', offline: 'آف لائن', newChat: 'نئين چيٽ', back: 'واپس' },
  pa: { title: 'اے آئی زرعی مددگار', subtitle: 'تہاڈا سیانا کھیتی ساتھی', cloudSync: 'کلاؤڈ سنک', offline: 'آف لائن', newChat: 'نویں چیٹ', back: 'واپس' },
  ps: { title: 'اي آئی کرنیزی مرسته', subtitle: 'ستاسو هوښيار کرنیز ملگری', cloudSync: 'کلاوډ همغږي', offline: 'آف لائن', newChat: 'نوې خبرې', back: 'بیرته' }
};

// Language buttons config
const LANG_OPTIONS = [
  { code: 'en', label: 'EN', title: 'Switch to English' },
  { code: 'ur', label: 'اردو', title: 'اردو میں تبدیل کریں' },
  { code: 'sd', label: 'سنڌي', title: 'سنڌيءَ ۾ تبديل ڪريو' },
  { code: 'pa', label: 'پنجابی', title: 'پنجابی وچ بدلو' },
  { code: 'ps', label: 'پښتو', title: 'پښتو ته بدل کړئ' }
];

/**
 * Header component with:
 * - App branding (logo + title)
 * - Language toggle inline (includes Pashto)
 * - Connection/offline indicator
 * - Mobile menu toggle
 */
export default function Header({ language, onLanguageChange, onMenuToggle, onNewChat, hasMessages }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = UI_TEXT[language] || UI_TEXT.en;

  return (
    <header className="header">
      {/* Mobile left-side controls */}
      <div className="header__mobile-left">
        {/* Mobile Menu Toggle */}
        <button className="header__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Mobile Back Button — shown when there are messages */}
        {hasMessages && (
          <button className="header__back-btn" onClick={onNewChat} aria-label={t.back} title={t.back}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile New Chat Button — ALWAYS visible on mobile */}
      <button className="header__new-chat-btn" onClick={onNewChat} aria-label={t.newChat} title={t.newChat}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* App Logo & Title */}
      <div className="header__brand">
        <div className="header__logo-wrapper">
          <img src="/logo.png" alt="AI Agriculture Assistant Logo" className="header__logo" />
        </div>
        <div className="header__titles">
          <h1 className="header__title">{t.title}</h1>
          <p className="header__subtitle">{t.subtitle}</p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="header__actions">
        {/* Language Toggle — 4 languages */}
        <div className="header__lang-toggle">
          {LANG_OPTIONS.map(opt => (
            <button
              key={opt.code}
              className={`header__lang-btn ${language === opt.code ? 'header__lang-btn--active' : ''}`}
              onClick={() => onLanguageChange(opt.code)}
              title={opt.title}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Connection Status / Offline Indicator */}
        <div className={`header__status ${!isOnline ? 'header__status--offline' : ''}`}>
          {isOnline ? (
            <>
              <svg className="header__status-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l4.59-4.59L16 11l-6 6z" />
              </svg>
              <span className="header__status-text">{t.cloudSync}</span>
              <div className="header__status-dot header__status-dot--online" />
            </>
          ) : (
            <>
              <svg className="header__status-icon header__status-icon--offline" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2 1.27-1.27L4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z" />
              </svg>
              <span className="header__status-text">{t.offline}</span>
              <div className="header__status-dot header__status-dot--offline" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
