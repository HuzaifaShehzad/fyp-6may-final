import { useState, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import WelcomeScreen from './components/WelcomeScreen';
import {
  suggestions,
  urduSuggestions,
  sindhiSuggestions,
  punjabiSuggestions,
  pashtoSuggestions
} from './data/responses';
import './App.css';

const langMap = {
  en: "english",
  ur: "urdu",
  sd: "sindhi",
  pa: "punjabi",
  ps: "pashto",
};

const suggestionMap = {
  en: suggestions,
  ur: urduSuggestions,
  sd: sindhiSuggestions,
  pa: punjabiSuggestions,
  ps: pashtoSuggestions,
};

export default function App() {

  // 💬 Chat state
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatHistory] = useState([]);

  // ☁️ Weather state
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  // 🎛 UI state
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const chatAreaRef = useRef(null);
  const audioRef = useRef(null); // currently playing audio (for Stop)

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const isRTL = ['ur', 'sd', 'pa', 'ps'].includes(language);

  // 🕒 Helpers
  const getTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getCurrentPosition = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

  const handleGetWeather = useCallback(async () => {
    setWeatherError('');
    setWeather(null);
    setWeatherLoading(true);

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const url = `http://127.0.0.1:8000/weather?lat=${encodeURIComponent(
        latitude
      )}&lon=${encodeURIComponent(longitude)}`;

      const res = await fetch(url);
      if (!res.ok) {
        let detail = '';
        try {
          const data = await res.json();
          detail =
            typeof data?.detail === 'string'
              ? data.detail
              : JSON.stringify(data?.detail ?? data);
        } catch {
          detail = await res.text();
        }
        console.error("Weather API error:", res.status, detail);
        throw new Error(detail || "Failed to fetch weather. Check backend/API key.");
      }

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Weather error:", err);
      const code = err?.code;
      if (code === 1) {
        setWeatherError("Location permission denied. Please allow location access.");
      } else if (code === 2) {
        setWeatherError("Location unavailable. Try again.");
      } else if (code === 3) {
        setWeatherError("Location request timed out. Try again.");
      } else {
        setWeatherError(err?.message || "Could not get weather.");
      }
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const stopCurrentAudio = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.pause();
      a.currentTime = 0;
    } catch {
      // ignore
    }
    audioRef.current = null;
  }, []);

  const handleDeleteAudio = useCallback(async (audioUrl) => {
    if (!audioUrl) return;
    // If the current audio is playing this source, stop it first.
    const a = audioRef.current;
    if (a && a.src && a.src.includes(audioUrl)) {
      stopCurrentAudio();
    }

    try {
      await fetch("http://127.0.0.1:8000/delete-audio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio_url: audioUrl }),
      });
    } catch (err) {
      console.error("Delete audio error:", err);
    } finally {
      // Remove audio from any message that referenced it
      setMessages((prev) =>
        prev.map((m) => (m.audio_url === audioUrl ? { ...m, audio_url: null } : m))
      );
    }
  }, [stopCurrentAudio]);

  // Auto-fetch weather on app load
  useEffect(() => {
    // Avoid eslint react-hooks/set-state-in-effect by deferring the call.
    const t = setTimeout(() => {
      handleGetWeather();
    }, 0);
    return () => clearTimeout(t);
  }, [handleGetWeather]);

  

  // Auto scroll
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  // 🎤 TOGGLE RECORDING
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Recording is already stopped; update UI immediately and release mic.
        setIsRecording(false);
        streamRef.current?.getTracks().forEach(t => t.stop());

        const statusId = Date.now() + 100;
        setMessages(prev => [
          ...prev,
          {
            id: statusId,
            role: "status",
            text: "⏳ Processing voice… (transcribe → translate → generate audio)",
            time: getTimestamp()
          }
        ]);

        try {
          setIsTyping(true);
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm"
          });

          const formData = new FormData();
          formData.append("file", audioBlob, "voice.webm");

          const response = await fetch(
            `http://127.0.0.1:8000/speech-to-speech-record?target_lang=${langMap[language]}`,
            {
              method: "POST",
              body: formData
            }
          );

          const data = await response.json();

          setMessages(prev => [
            ...prev.filter(m => m.id !== statusId),
            {
              id: Date.now(),
              role: "user",
              text: data.original_text || "🎧 Voice message",
              time: getTimestamp()
            },
            {
              id: Date.now() + 1,
              role: "ai",
              text: data.translated_text || "No response",
              time: getTimestamp(),
              audio_url: data.audio_url || null,
            }
          ]);

          if (data.audio_url) {
            const audio = new Audio(`http://127.0.0.1:8000${data.audio_url}`);
            audioRef.current = audio;
            audio.play().catch(() => {});
          }

        } catch (err) {
          console.error("Voice error:", err);
          setMessages(prev => prev.filter(m => m.id !== statusId));
        } finally {
          setIsTyping(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    if (mediaRecorder.state === "recording") {
      // Immediately update UI so user doesn't think it's "frozen"
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  // 💬 TEXT SEND
  const handleSend = useCallback(async (text) => {

    if (!text.trim()) return;

    if (!activeChatId) setActiveChatId(Date.now());

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text,
      time: getTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/translate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          target_lang: langMap[language]
        })
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        text: data?.translated_text || "No response",
        time: getTimestamp(),
        audio_url: data?.audio_url || null,
      };

      setMessages(prev => [...prev, aiMessage]);

      if (data?.audio_url) {
        const audio = new Audio(`http://127.0.0.1:8000${data.audio_url}`);
        audioRef.current = audio;
        audio.play().catch(() => {});
      }

    } catch (err) {
      console.error(err);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: "ai",
          text: "⚠️ Server error. Check backend.",
          time: getTimestamp()
        }
      ]);
    }

    setIsTyping(false);

  }, [language, activeChatId]);

  const handleSuggestionSelect = useCallback((query) => {
    handleSend(query);
  }, [handleSend]);

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const currentSuggestions = suggestionMap[language] || suggestions;

  return (
    <div className="app" dir={isRTL ? 'rtl' : 'ltr'}>

      <Sidebar
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        language={language}
        onLanguageChange={handleLanguageChange}
        onNewChat={() => {
          setMessages([]);
          setActiveChatId(null);
        }}
        onSelectChat={(id) => setActiveChatId(id)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(p => !p)}
      />

      <main className="app__main">

        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          onMenuToggle={() => setSidebarOpen(p => !p)}
          hasMessages={messages.length > 0}
        />

        <section className="weather">
          <div className="weather__row">
            <button
              className="weather__btn"
              onClick={handleGetWeather}
              disabled={weatherLoading}
              type="button"
            >
              {weatherLoading ? (
                <>
                  <span className="weather__btn-text">Getting Weather</span>
                  <span className="weather__btn-dot" aria-hidden="true" />
                </>
              ) : (
                'Get Weather'
              )}
            </button>
          </div>

          {weatherError ? (
            <div className="weather__error" role="status">{weatherError}</div>
          ) : null}

          {weather ? (
            <div className="weather__card">
              <div className="weather__city">{weather.city || 'Your area'}</div>
              <div className="weather__grid">
                <div className="weather__item">
                  <span className="weather__label">Temp</span>
                  <span className="weather__value">
                    {typeof weather.temperature === 'number' ? weather.temperature : '—'}°C
                  </span>
                </div>
                <div className="weather__item">
                  <span className="weather__label">Humidity</span>
                  <span className="weather__value">
                    {typeof weather.humidity === 'number' ? weather.humidity : '—'}%
                  </span>
                </div>
                <div className="weather__item weather__item--full">
                  <span className="weather__label">Description</span>
                  <span className="weather__value">{weather.description || '—'}</span>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <div className="app__chat-area" ref={chatAreaRef}>

          {messages.length === 0 ? (
            <WelcomeScreen
              language={language}
              suggestions={currentSuggestions}
              onSuggestionSelect={handleSuggestionSelect}
            />
          ) : (
            <div className="app__messages">

              {messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  language={language}
                  onStopAudio={stopCurrentAudio}
                  onDeleteAudio={handleDeleteAudio}
                />
              ))}

              {isTyping && <TypingIndicator language={language} />}

            </div>
          )}

        </div>

        <ChatInput
  onSend={handleSend}
  language={language}
  disabled={isTyping}
  onToggleMic={toggleRecording}
  isRecording={isRecording}
  onUploadComplete={(data) => {

    // user message (original text)
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: data.original_text || "🎧 Audio message",
        time: getTimestamp()
      }
    ]);

    // AI message
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "ai",
        text: data.translated_text || "No response",
        time: getTimestamp(),
        audio_url: data.audio_url || null,
      }
    ]);

    // audio play
    if (data.audio_url) {
      const audio = new Audio(`http://127.0.0.1:8000${data.audio_url}`);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  }}
/>
      </main>
    </div>
  );
}