import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../../../i18n/useT.js';
import { apiRequest } from '../../../lib/apiClient.js';

/**
 * Modern HeatAlertBanner
 * Refined emergency advisory ribbon docked below header with pulsing beacon.
 * Displays live civic broadcast from Municipal Admin Command Center or IMD heat telemetry.
 */
export const HeatAlertBanner = ({ heatIndexC = 42, level = 'danger', lang = 'en' }) => {
  const t = useT(lang);
  const [broadcast, setBroadcast] = useState(() => {
    try {
      const saved = localStorage.getItem('hh_active_broadcast');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // 1. Fetch latest broadcast from server
    async function loadBroadcast() {
      try {
        const res = await apiRequest('/admin/broadcast');
        if (res && res.broadcast) {
          setBroadcast(res.broadcast);
          localStorage.setItem('hh_active_broadcast', JSON.stringify(res.broadcast));
        }
      } catch {
        // Safe fallback to localStorage / default
      }
    }
    loadBroadcast();

    // 2. Listen to real-time broadcast changes dispatched by Admin Panel
    const handleBroadcastUpdated = (e) => {
      if (e.detail) {
        setBroadcast(e.detail);
      }
    };
    window.addEventListener('heathaven_broadcast_updated', handleBroadcastUpdated);
    return () => {
      window.removeEventListener('heathaven_broadcast_updated', handleBroadcastUpdated);
    };
  }, []);

  const isBroadcastActive = broadcast && broadcast.active;
  const effectiveLevel = isBroadcastActive ? (broadcast.level || 'extreme') : level;
  const show = isBroadcastActive || effectiveLevel === 'danger' || effectiveLevel === 'extreme';
  const isExtreme = effectiveLevel === 'extreme';

  const title = isBroadcastActive
    ? (lang === 'hi' ? broadcast.titleHi : broadcast.titleEn)
    : t('heat.alertTitle');

  const desc = isBroadcastActive
    ? (lang === 'hi' ? broadcast.messageHi : broadcast.messageEn)
    : t('heat.alertDesc');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="heat-alert-ribbon"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`px-4 py-2 flex items-center justify-center gap-2.5 text-white text-xs font-bold shadow-xs z-30 shrink-0 transition-colors ${
            isExtreme
              ? 'bg-gradient-to-r from-red-800 via-rose-700 to-red-900 border-b border-red-500/30'
              : effectiveLevel === 'warning'
                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 border-b border-amber-400/30'
                : 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 border-b border-rose-400/30'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
          <i className="fa-solid fa-bullhorn text-xs text-white" />
          <span className="tracking-wide font-sans text-center truncate">
            <span className="font-heading font-black">{title}</span>
            {heatIndexC && !isBroadcastActive && (
              <> — <span className="font-mono text-sm font-black">{heatIndexC}°C</span></>
            )}
            <span className="hidden sm:inline font-normal opacity-95 ml-2">
              · {desc}
            </span>
          </span>
          {isBroadcastActive && (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 border border-white/20 text-white font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Civic Broadcast
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeatAlertBanner;
