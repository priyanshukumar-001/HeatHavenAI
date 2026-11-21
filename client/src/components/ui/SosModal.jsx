import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../../i18n/useT.js';

/**
 * SosModal Component (Loo & Chhaon Emergency First Aid)
 * Emergency heat stroke guidance and one-tap 108 ambulance dialing
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {'en' | 'hi'} [props.lang='en']
 */
export const SosModal = ({ isOpen = false, onClose = () => {}, lang = 'en' }) => {
  const t = useT(lang);

  if (!isOpen) return null;

  const steps = [
    { icon: 'fa-tree', titleKey: 'sos.step1.title', descKey: 'sos.step1.desc' },
    { icon: 'fa-shirt', titleKey: 'sos.step2.title', descKey: 'sos.step2.desc' },
    { icon: 'fa-glass-water', titleKey: 'sos.step3.title', descKey: 'sos.step3.desc' },
    { icon: 'fa-head-side-cough', titleKey: 'sos.step4.title', descKey: 'sos.step4.desc' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-card rounded-2xl shadow-2 overflow-hidden border border-line z-10 text-ink"
        >
          {/* Top Red Alert Header */}
          <div className="bg-loo text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">
                <i className="fa-solid fa-kit-medical" />
              </div>
              <div>
                <h2 className="font-heading font-black text-base leading-tight">
                  {t('sos.title')}
                </h2>
                <p className="text-[11px] text-white/90 font-mono">
                  {t('sos.subtitle')}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm focus:outline-none transition-colors"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* First Aid Guidance Steps */}
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <h3 className="text-xs font-mono font-bold text-ink-3 uppercase tracking-wider">
              {t('sos.stepsTitle')}
            </h3>

            <div className="space-y-2.5">
              {steps.map((s, idx) => (
                <div key={idx} className="p-3.5 bg-paper rounded-xl border border-line flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-loo-soft text-loo shrink-0 flex items-center justify-center text-xs font-bold">
                    <i className={`fa-solid ${s.icon}`} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-ink">{t(s.titleKey)}</h4>
                    <p className="text-[11px] text-ink-2 mt-0.5 font-sans leading-relaxed">{t(s.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Dial 108 Ambulance Button */}
            <div className="pt-2">
              <a
                href="tel:108"
                className="w-full h-12 bg-loo hover:brightness-110 text-white font-heading font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
              >
                <i className="fa-solid fa-phone text-base animate-bounce" />
                <span>{t('sos.call')}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SosModal;
