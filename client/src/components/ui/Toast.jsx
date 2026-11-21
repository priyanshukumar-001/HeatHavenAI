import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast Notification Component (Loo & Chhaon Theme)
 * Modern floating pill with status badge and icon (no one-sided thick border)
 *
 * @param {Object} props
 * @param {string|null} props.message
 * @param {'success' | 'warning' | 'error'} [props.type='success']
 */
export const Toast = ({ message, type = 'success' }) => {
  const styles = {
    success: {
      badge: 'bg-chhaon-soft text-chhaon border-chhaon/30',
      icon: 'fa-circle-check text-chhaon'
    },
    warning: {
      badge: 'bg-aaram-soft text-aaram border-aaram/30',
      icon: 'fa-triangle-exclamation text-aaram'
    },
    error: {
      badge: 'bg-loo-soft text-loo border-loo/30',
      icon: 'fa-circle-xmark text-loo'
    }
  };

  const current = styles[type] || styles.success;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-card/95 backdrop-blur-md border border-line text-ink px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2.5 max-w-sm sm:max-w-md"
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs shrink-0 ${current.badge}`}>
            <i className={`fa-solid ${current.icon}`} />
          </div>
          <span className="font-sans leading-snug">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
