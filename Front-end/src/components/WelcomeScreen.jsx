import './WelcomeScreen.css';

// ─── UI text translations ────────────────────────────────────
const UI_TEXT = {
  en: {
    title: 'AI Agriculture Assistant',
    subtitle: 'Your intelligent farming companion — ask about crops, weather, fertilizers, and more',
    tryAsking: 'Try asking:',
    features: [
      { icon: '🌾', title: 'Crop Advice', desc: 'Season-based crop recommendations' },
      { icon: '🐛', title: 'Pest Management', desc: 'Identify and solve pest problems' },
      { icon: '🧪', title: 'Soil & Fertilizer', desc: 'Soil testing and fertilizer guidance' },
      { icon: '💧', title: 'Irrigation', desc: 'Smart water management practices' },
    ]
  },
  ur: {
    title: 'اے آئی زرعی معاون',
    subtitle: 'آپ کا ذہین کھیتی باڑی ساتھی — فصلوں، موسم، کھادوں اور مزید کے بارے میں پوچھیں',
    tryAsking: 'یہ پوچھ کر شروع کریں:',
    features: [
      { icon: '🌾', title: 'فصل کا مشورہ', desc: 'موسم کے مطابق بہترین فصل کی سفارش' },
      { icon: '🐛', title: 'کیڑوں کا انتظام', desc: 'کیڑوں کی شناخت اور حل' },
      { icon: '🧪', title: 'مٹی اور کھاد', desc: 'مٹی کی جانچ اور کھاد کی رہنمائی' },
      { icon: '💧', title: 'آبپاشی', desc: 'پانی کے بہتر انتظام کے طریقے' },
    ]
  },
  sd: {
    title: 'اي آئي زرعي مددگار',
    subtitle: 'توهانجو سمجهدار کيتي ساٿي — فصلن، موسم، کادن ۽ وڌيڪ بابت پڇو',
    tryAsking: 'هي پڇي شروع ڪريو:',
    features: [
      { icon: '🌾', title: 'فصل جو مشورو', desc: 'موسم موجب بهترين فصل جي صلاح' },
      { icon: '🐛', title: 'ڪيڙن جو انتظام', desc: 'ڪيڙن جي سڃاڻپ ۽ حل' },
      { icon: '🧪', title: 'مٽي ۽ کاد', desc: 'مٽيءَ جي جانچ ۽ کاد جي رهنمائي' },
      { icon: '💧', title: 'پاڻي ڏيڻ', desc: 'پاڻي جي بهتر انتظام جا طريقا' },
    ]
  },
  pa: {
    title: 'اے آئی زرعی مددگار',
    subtitle: 'تہاڈا سیانا کھیتی ساتھی — فصلاں، موسم، کھاداں تے ہور بارے پچھو',
    tryAsking: 'ایہ پچھ کے شروع کرو:',
    features: [
      { icon: '🌾', title: 'فصل دا مشورہ', desc: 'موسم دے مطابق ودھیا فصل دی صلاح' },
      { icon: '🐛', title: 'کیڑیاں دا بندوبست', desc: 'کیڑیاں دی پچھان تے حل' },
      { icon: '🧪', title: 'مٹی تے کھاد', desc: 'مٹی دی جانچ تے کھاد دی رہنمائی' },
      { icon: '💧', title: 'پانی دینا', desc: 'پانی دے ودھیا انتظام دے طریقے' },
    ]
  },
  ps: {
    title: 'اي آئی کرنیز مرسته',
    subtitle: 'ستاسې هوښيار کرنیز ملگرے — په فصولو، هوا، خورو او نورو باندې پوښتنې.',
    tryAsking: 'دا مهال پوښتنې:',
    features: [
      { icon: '🌾', title: 'د فصولو مشورې', desc: 'د موسم له مخې غوره فصل' },
      { icon: '🐛', title: 'د تاړو اداره', desc: 'پېژندنه او حلونه' },
      { icon: '🧪', title: 'ځمکه او خوړې', desc: 'د خاورې ازمهینه او لارښوونه' },
      { icon: '💧', title: 'اوبړل', desc: 'ښې اوبو لېږد طرحې' },
    ]
  }
};

/**
 * Welcome screen shown when there are no messages yet.
 * Displays the app logo, welcome text, feature highlights, and suggestions.
 * Localized for English, Urdu, Sindhi, Punjabi, and Pashto.
 */
export default function WelcomeScreen({ language, suggestions, onSuggestionSelect }) {
  const t = UI_TEXT[language] || UI_TEXT.en;
  const isRTL = ['ur', 'sd', 'pa', 'ps'].includes(language);

  return (
    <div className="welcome" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="welcome__hero">
        <div className="welcome__logo-glow">
          <img src="/logo.png" alt="Logo" className="welcome__logo" />
        </div>
        <h2 className="welcome__title">{t.title}</h2>
        <p className="welcome__subtitle">{t.subtitle}</p>
      </div>

      {/* Feature Cards */}
      <div className="welcome__features">
        {t.features.map((feature, i) => (
          <div key={i} className="welcome__feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="welcome__feature-icon">{feature.icon}</span>
            <div>
              <h3 className="welcome__feature-title">{feature.title}</h3>
              <p className="welcome__feature-desc">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion Chips */}
      <div className="welcome__suggestions">
        <p className="welcome__suggestion-label">{t.tryAsking}</p>
        <div className="welcome__suggestion-grid">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="welcome__suggestion-btn"
              onClick={() => onSuggestionSelect(s.query)}
              style={{ animationDelay: `${0.4 + i * 0.08}s` }}
            >
              {s.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
