import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../../../i18n/useT.js';

/**
 * Modern HeatAlertBanner
 * Refined emergency advisory ribbon docked below header with pulsing beacon.
 */
export const HeatAlertBanner = ({ heatIndexC = 42, level = 'danger', lang = 'en' }) => {
  const t = useT(lang);
  const show = level === 'danger' || level === 'extreme';
  const isExtreme = level === 'extreme';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`px-4 py-2 flex items-center justify-center gap-2 text-white text-xs font-bold shadow-xs z-30 shrink-0 ${
            isExtreme
              ? 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800'
              : 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
          <i className="fa-solid fa-triangle-exclamation text-xs text-white" />
          <span className="tracking-wide font-sans">
            <span className="font-heading font-black">{t('heat.alertTitle')}</span> — <span className="font-mono text-sm font-black">{heatIndexC}°C</span>{' '}
            <span className="hidden sm:inline font-normal opacity-95">
              · {t('heat.alertDesc')}
            </span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeatAlertBanner;
