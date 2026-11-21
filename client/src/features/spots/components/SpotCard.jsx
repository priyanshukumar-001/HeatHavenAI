import React from 'react';
import { motion } from 'framer-motion';
import { formatDistance, formatRelativeTime } from '../../../lib/format.js';
import { CATEGORY_CONFIG } from '../../../lib/constants.js';

/**
 * Modern Reference-Grade SpotCard (Stockholm Logistics & Travel UI inspired)
 * Crisp white card, subtle hairline border, lime/emerald trust indicator,
 * bold mono metrics, walking time estimate, and direct 1-tap navigation.
 *
 * @param {Object} props
 * @param {Object} props.spot
 * @param {boolean} [props.isSelected]
 * @param {boolean} [props.isClosest]
 * @param {Function} [props.onSelect]
 * @param {'en' | 'hi'} [props.lang='en']
 */
export const SpotCard = ({
  spot,
  isSelected = false,
  isClosest = false,
  onSelect = () => {},
  lang = 'en'
}) => {
  const config = CATEGORY_CONFIG[spot.category] || CATEGORY_CONFIG.water;
  const isHighTrust = spot.trustScore >= 70;
  const distM = Number(spot.distanceM) || 0;
  const walkMinutes = Math.max(1, Math.round(distM / 80)); // 80m per min (~4.8 km/h walking speed)

  const handleDirectionsClick = (e) => {
    e.stopPropagation();
    const lat = spot.location?.lat;
    const lng = spot.location?.lng;
    if (lat && lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.16 }}
      onClick={() => onSelect(spot)}
      className={`p-4 rounded-3xl border transition-all cursor-pointer text-left select-none relative ${
        isSelected
          ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-[0_10px_35px_rgba(37,99,235,0.14)]'
          : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-[0_2px_10px_rgba(15,23,42,0.05)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]'
      }`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {/* Closest Highlight Pill */}
      {isClosest && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
            ⚡ {lang === 'hi' ? 'निकटतम राहत स्थल' : 'Closest Relief Spot'}
          </span>
          <span className="text-[11px] font-mono font-bold text-blue-600">
            ~{walkMinutes} {lang === 'hi' ? 'मिनट पैदल' : 'min walk'}
          </span>
        </div>
      )}

      {/* Top Header: Title & Status Pill Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-slate-400">
              #{spot.id?.slice(-5).toUpperCase() || 'REF-01'}
            </span>
            {spot.aiVerified && (
              <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                <i className="fa-solid fa-wand-magic-sparkles text-[8px] text-purple-600" />
                AI VISION
              </span>
            )}
            {spot.lastVerifiedAt && (
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  (Date.now() - new Date(spot.lastVerifiedAt).getTime()) / 3600000 < 48
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
                title="Freshness TTL: spots older than 48 hours require community re-verification"
              >
                {(Date.now() - new Date(spot.lastVerifiedAt).getTime()) / 3600000 < 48 ? '⏱️ <48h TTL' : '⚠️ >48h Stale'}
              </span>
            )}
            {spot.isSimulated && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                SIMULATED
              </span>
            )}
          </div>
          <h3 className="font-heading font-black text-sm text-slate-900 truncate leading-snug">
            {spot.name}
          </h3>
        </div>

        {/* Status Pill Badge (Stockholm Reference 1 style) */}
        <span
          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
            isHighTrust
              ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100/90 text-amber-900 border border-amber-300'
          }`}
        >
          {isHighTrust ? (lang === 'hi' ? 'सत्यापित' : 'VERIFIED') : (lang === 'hi' ? 'समीक्षाधीन' : 'UNVERIFIED')}
        </span>
      </div>

      {/* Trust Progress Line */}
      <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            spot.trustScore >= 80
              ? 'bg-emerald-500'
              : spot.trustScore >= 60
              ? 'bg-lime-500'
              : 'bg-amber-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(10, spot.trustScore))}%` }}
        />
      </div>

      {/* Specs Metrics Grid (Category, Exact Distance, Trust Score) */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-left">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {lang === 'hi' ? 'प्रकार' : 'Category'}
          </span>
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5 truncate">
            <i className={`fa-solid ${config.icon} text-[11px]`} style={{ color: config.color }} />
            {lang === 'hi' ? config.labelHi : config.labelEn}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {lang === 'hi' ? 'सटीक दूरी' : 'Live Distance'}
          </span>
          <span className="text-xs font-mono font-black text-blue-600 mt-0.5 block">
            {formatDistance(distM)}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {lang === 'hi' ? 'सत्यापन' : 'Trust Score'}
          </span>
          <span className="text-xs font-mono font-black text-slate-800 mt-0.5 block">
            {spot.trustScore}/100
          </span>
        </div>
      </div>

      {/* Action Footer: Directions button + Details button */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
        <span className="text-[11px] text-slate-400 truncate flex items-center gap-1">
          <i className="fa-regular fa-clock text-[10px]" />
          {formatRelativeTime(spot.lastVerifiedAt, lang)}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDirectionsClick}
            className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 border border-blue-200"
            title="Open walking directions in Google Maps"
          >
            <i className="fa-solid fa-diamond-turn-right text-[10px]" />
            <span>{lang === 'hi' ? 'दिशा' : 'Route'}</span>
          </button>

          <span className="text-slate-400 hover:text-blue-600 font-bold flex items-center gap-1 text-[11px]">
            {lang === 'hi' ? 'विवरण' : 'Details'}
            <i className="fa-solid fa-chevron-right text-[9px]" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default SpotCard;
