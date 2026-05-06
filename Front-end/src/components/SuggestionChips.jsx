import './SuggestionChips.css';

// ─── UI text translations ────────────────────────────────────
const LABEL_TEXT = {
  en: 'Suggested questions:',
  ur: 'تجویز کردہ سوالات:',
  sd: 'صلاح ڏنل سوال:',
  pa: 'تجویز کیتے سوال:'
};

/**
 * Predefined suggestion chips/buttons displayed in the chat.
 * Allows users to quickly ask common farming questions.
 * Fully localized for all 4 languages.
 */
export default function SuggestionChips({ suggestions, onSelect, language }) {
  const label = LABEL_TEXT[language] || LABEL_TEXT.en;

  return (
    <div className="suggestion-chips">
      <p className="suggestion-chips__label">{label}</p>
      <div className="suggestion-chips__grid">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-chips__chip"
            onClick={() => onSelect(suggestion.query)}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
}
