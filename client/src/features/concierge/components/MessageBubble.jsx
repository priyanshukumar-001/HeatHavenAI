import React from 'react';
import { motion } from 'framer-motion';
import { formatDistance } from '../../../lib/format.js';

/**
 * MessageBubble Component (Modern High-End AI Chat Bubble)
 *
 * @param {Object} props
 * @param {'user' | 'ai'} props.sender
 * @param {string} props.text
 * @param {string} [props.source]
 * @param {Array} [props.spots]
 * @param {Function} [props.onSelectSpot]
 */
export const MessageBubble = ({
  sender,
  text,
  source,
  spots = [],
  onSelectSpot = () => {}
}) => {
  const isUser = sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm font-sans ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs font-medium'
            : 'bg-card border border-line text-ink rounded-bl-xs shadow-xs'
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {!isUser && source && (
          <div className="mt-2.5 pt-2 border-t border-line flex items-center gap-2 text-[10px]">
            {source === 'gemini' ? (
              <span className="font-mono font-bold tracking-wider text-blue-600 flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-blue-600" />
                Gemini 3.1 AI Active
              </span>
            ) : (
              <span className="font-mono text-ink-3 flex items-center gap-1.5 bg-paper-2 px-2 py-0.5 rounded-full border border-line">
                <i className="fa-solid fa-robot text-[10px]" />
                Ground Protocol
              </span>
            )}
          </div>
        )}
      </div>

      {/* Suggested Spot Cards (Matches Slide 3 Live Gemini Query Format) */}
      {!isUser && spots && spots.length > 0 && (
        <div className="w-full space-y-2 pt-1.5 max-w-[92%]">
          {spots.map((spot, idx) => (
            <div
              key={spot.id || idx}
              onClick={() => onSelectSpot(spot)}
              className="p-3 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-2xl shadow-xs transition-all cursor-pointer text-left space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-heading font-black text-xs text-slate-900 truncate">
                  {idx + 1}. {spot.name}
                </h4>
                <span className="font-mono text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0 border border-blue-200">
                  {formatDistance(spot.distanceM)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 font-sans">
                <span className="flex items-center gap-1 truncate">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]" />
                  <span>
                    Verified • {spot.category === 'water' ? 'Free chilled water' : spot.category === 'shade' ? '4°C cooler canopy' : 'Public seating'}
                  </span>
                </span>
                <span className="font-mono font-bold text-slate-600">
                  {spot.trustScore}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
