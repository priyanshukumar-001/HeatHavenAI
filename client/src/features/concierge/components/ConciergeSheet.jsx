import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble.jsx';
import { askConcierge } from '../api.js';
import { useVoice } from '../hooks/useVoice.js';
import { PILOT_COORDS } from '../../../lib/constants.js';

/**
 * ConciergeSheet Component
 * Conversational modal sheet powered by Gemini AI with voice input and deterministic fallback.
 * Designed with modern clean SaaS/delivery aesthetic (Reference Image 2, 3 & 4).
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {'en' | 'hi'} [props.lang='en']
 * @param {Function} [props.onSelectSpot]
 * @param {Object} [props.userCoords]
 */
export const ConciergeSheet = ({
  isOpen = false,
  onClose = () => {},
  lang = 'en',
  onSelectSpot = () => {},
  userCoords = { lat: PILOT_COORDS.LAT, lng: PILOT_COORDS.LNG }
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset welcome message when lang changes or sheet opens
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: lang === 'hi'
            ? 'नमस्ते! मैं HeatHaven AI हूँ। आपको अभी ठंडा पीने का पानी, छायादार स्थान या बैठने की जगह चाहिए? बोलकर या लिखकर पूछें।'
            : 'Hello! I am HeatHaven AI. Are you looking for cold drinking water, tree shade, or a place to rest? Ask by voice or text.',
          source: 'gemini'
        }
      ]);
    }
  }, [isOpen, lang]);

  const voiceLang = lang === 'hi' ? 'hi-IN' : 'en-US';
  const [voiceNotice, setVoiceNotice] = useState(null);

  const handleSend = useCallback(async (queryText) => {
    const query = (queryText || inputText).trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setVoiceNotice(null);

    try {
      const res = await askConcierge({
        query,
        lat: userCoords.lat,
        lng: userCoords.lng,
        lang
      });

      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.reply,
        source: res.source,
        spots: res.spots
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: lang === 'hi'
          ? 'माफ़ कीजिए, सर्वर से संपर्क नहीं हो पाया। कृपया दोबारा प्रयास करें।'
          : 'Unable to reach the server. Please try again.',
        source: 'template'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [inputText, lang, userCoords.lat, userCoords.lng]);

  const {
    isListening,
    interimText,
    startListening,
    stopListening
  } = useVoice({
    lang: voiceLang,
    onResult: (transcript) => {
      setInputText(transcript);
      handleSend(transcript);
    },
    onInterim: (liveText) => {
      setInputText(liveText);
    },
    onError: (msg) => {
      setVoiceNotice(msg);
      setTimeout(() => setVoiceNotice(null), 5000);
    }
  });

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      if (inputText.trim()) {
        handleSend(inputText);
      }
    } else {
      setVoiceNotice(null);
      startListening();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Slide-Up Sheet Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg h-[86vh] max-h-[680px] bg-card rounded-t-[28px] shadow-2 flex flex-col overflow-hidden border-t border-line text-ink"
        >
          {/* Drag Handle */}
          <div className="pt-3 pb-1 flex justify-center shrink-0">
            <span className="w-12 h-1.5 rounded-full bg-slate-300" />
          </div>

          {/* Modern Header */}
          <div className="px-5 py-3.5 bg-card border-b border-line flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base shadow-sm">
                <i className="fa-solid fa-wand-magic-sparkles" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-black text-sm text-ink">
                    HeatHaven AI Concierge
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● Live Gemini
                  </span>
                </div>
                <p className="text-[11px] text-ink-3 font-sans">
                  {lang === 'hi' ? 'बोले या लिखे · 250m जीपीएस शेड मैपिंग' : 'Voice & text assistant · 250m shade intelligence'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-paper-2 flex items-center justify-center text-ink-2 text-sm transition-colors focus:outline-none"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-paper">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                source={msg.source}
                spots={msg.spots}
                onSelectSpot={(spot) => {
                  onSelectSpot(spot);
                  onClose();
                }}
              />
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3.5 bg-card border border-line rounded-2xl w-16 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Error / Status Banner */}
          {voiceNotice && (
            <div className="py-2 px-4 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs text-amber-800">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation text-amber-600" />
                {voiceNotice}
              </span>
              <button
                type="button"
                onClick={() => setVoiceNotice(null)}
                className="text-amber-700 hover:text-amber-900 font-bold ml-2 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Listening Indicator with Audio Wave */}
          {isListening && (
            <div className="py-2.5 px-4 bg-gradient-to-r from-rose-50 via-red-50 to-rose-50 border-t border-rose-200 flex items-center justify-between text-xs font-semibold text-rose-700 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
                <span className="truncate">
                  {lang === 'hi' ? '🎙️ सुन रहा हूँ... बोलिए (हिंदी या अंग्रेज़ी)' : '🎙️ Listening... speak now (Hindi / English)'}
                  {interimText && <span className="font-mono font-bold text-slate-800 ml-1.5 italic">"{interimText}"</span>}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleMic}
                className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shrink-0 hover:bg-rose-700 active:scale-95"
              >
                {lang === 'hi' ? 'समाप्त करें' : 'Done'}
              </button>
            </div>
          )}

          {/* Quick Suggestion Chips (Matches Slide 3 Live Gemini Query) */}
          <div className="px-4 py-3 bg-card border-t border-line flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'slide_prompt', icon: '⚡', text: lang === 'hi' ? 'पास में ठंडा पानी और बैठने की छांव कहाँ है?' : 'Paas mein thanda pani aur baithne ki chhaon kahan hai?' },
              { id: 'water', icon: '💧', text: lang === 'hi' ? 'ठंडा पानी कहाँ है?' : 'Where is cold water?' },
              { id: 'shade', icon: '🌳', text: lang === 'hi' ? 'पास में छांव कहाँ है?' : 'Nearest shade spot?' },
              { id: 'rest', icon: '🪑', text: lang === 'hi' ? 'बैठने की जगह बताओ' : 'Where can I rest?' },
              { id: 'tips', icon: '☀️', text: lang === 'hi' ? 'लू और गर्मी से बचाव' : 'Heat safety & ORS guide' }
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleSend(chip.text)}
                className="px-3.5 py-1.5 rounded-full bg-paper hover:bg-blue-50 hover:text-blue-700 border border-line hover:border-blue-300 text-[11px] font-semibold text-ink whitespace-nowrap shadow-xs active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>{chip.icon}</span>
                <span>{chip.text}</span>
              </button>
            ))}
          </div>

          {/* Input Bar (Reference 2 & 4 style) */}
          <div className="p-3.5 bg-card border-t border-line flex items-center gap-2.5 shrink-0">
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200'
              }`}
              title={isListening ? 'Click to stop & send' : (lang === 'hi' ? 'माइक से बोलकर पूछें' : 'Speak with Voice Mic')}
              aria-label="Voice Input"
            >
              <i className={`fa-solid ${isListening ? 'fa-square text-xs' : 'fa-microphone text-sm'}`} />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={
                isListening
                  ? (lang === 'hi' ? 'बोलिए... आपकी आवाज़ लिखी जा रही है' : 'Listening... your speech is typing...')
                  : (lang === 'hi' ? 'जैसे: नज़दीक में ठंडा पानी कहाँ मिलेगा...' : 'Ask: Where is the closest cold water...')
              }
              className="flex-1 h-11 px-4 bg-paper border border-line rounded-xl text-xs md:text-sm text-ink placeholder:text-ink-3 focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-40 hover:brightness-110 flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0"
              aria-label="Send query"
            >
              <i className="fa-solid fa-paper-plane text-xs" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConciergeSheet;
