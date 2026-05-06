import './Sidebar.css';

// ─── UI text translations ────────────────────────────────────
const UI_TEXT = {
  en: { newChat: 'New Chat', history: '📜 Chat History', language: '🌐 Language', noHistory: 'No chats yet — start a conversation!' },
  ur: { newChat: 'نئی چیٹ', history: '📜 چیٹ ہسٹری', language: '🌐 زبان', noHistory: 'ابھی کوئی چیٹ نہیں — بات شروع کریں!' },
  sd: { newChat: 'نئين چيٽ', history: '📜 چيٽ جي تاريخ', language: '🌐 ٻولي', noHistory: 'اڃا ڪا چيٽ ناهي — ڳالهه شروع ڪريو!' },
  pa: { newChat: 'نویں چیٹ', history: '📜 چیٹ ریکارڈ', language: '🌐 بولی', noHistory: 'ہالے کوئی چیٹ نہیں — گل شروع کرو!' },
  ps: { newChat: 'نوې خبرې', history: '📜 د خبرو تاریخ', language: '🌐 ژبه', noHistory: 'لا خبرې نشته — یوه خبره پیل کړئ!' }
};

// Language buttons config
const LANG_BUTTONS = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'ur', label: '🇵🇰 اردو' },
  { code: 'sd', label: '🇵🇰 سنڌي' },
  { code: 'pa', label: '🇵🇰 پنجابی' },
  { code: 'ps', label: '🇵🇰 پښتو' }
];

/**
 * Sidebar component with chat history and language selector.
 * Collapsible on mobile for responsive design.
 * Supports English, Urdu, Sindhi, Punjabi, and Pashto.
 * Now dynamically shows real chat history from App state.
 */
export default function Sidebar({
  chatHistory,
  activeChatId,
  language,
  onLanguageChange,
  onNewChat,
  onSelectChat,
  isOpen,
  onToggle
}) {
  const t = UI_TEXT[language] || UI_TEXT.en;

  // Group chats by date
  const groupedChats = chatHistory.reduce((groups, chat) => {
    if (!groups[chat.date]) groups[chat.date] = [];
    groups[chat.date].push(chat);
    return groups;
  }, {});

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* New Chat Button */}
        <button className="sidebar__new-chat" onClick={onNewChat}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t.newChat}
        </button>

        {/* Chat History */}
        <div className="sidebar__history">
          <h3 className="sidebar__section-title">{t.history}</h3>
          {chatHistory.length === 0 ? (
            <p className="sidebar__empty-hint">{t.noHistory}</p>
          ) : (
            Object.entries(groupedChats).map(([date, chats]) => (
              <div key={date} className="sidebar__date-group">
                <span className="sidebar__date-label">{date}</span>
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`sidebar__chat-item ${activeChatId === chat.id ? 'sidebar__chat-item--active' : ''}`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="sidebar__chat-title">{chat.title}</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Language Selector */}
        <div className="sidebar__footer">
          <div className="sidebar__language">
            <h3 className="sidebar__section-title">{t.language}</h3>
            <div className="sidebar__language-buttons">
              {LANG_BUTTONS.map(btn => (
                <button
                  key={btn.code}
                  className={`sidebar__lang-btn ${language === btn.code ? 'sidebar__lang-btn--active' : ''}`}
                  onClick={() => onLanguageChange(btn.code)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="sidebar__app-info">
            <span>AI Agriculture Assistant v1.0</span>
            <span>Final Year Project 2026</span>
          </div>
        </div>
      </aside>
    </>
  );
}
