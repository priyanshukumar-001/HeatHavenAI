import React from 'react';
import { useT } from '../../../i18n/useT.js';

/**
 * Modern Gen-Z HeatPill Component (REDESIGN_SPEC Section 2.5)
 * Live thermal badge with pulsing beacon dot, mono numerals, and tactile pill styling.
 */
export const HeatPill = ({ heatIndexC = 42, level: _level, lang = 'en' }) => {
  const t = useT(lang);

  const getStyle = () => {
    if (heatIndexC < 32) {
      return {
        classes: 'bg-chhaon-soft text-chhaon border-chhaon/30',
        dot: 'bg-chhaon',
        label: t('heat.normal')
      };
    }
    if (heatIndexC <= 38) {
      return {
        classes: 'bg-aaram-soft text-amber-text border-aaram/40',
        dot: 'bg-sun',
        label: t('heat.caution')
      };
    }
    if (heatIndexC <= 44) {
      return {
        classes: 'bg-loo-soft text-loo border-loo/30 font-bold',
        dot: 'bg-loo animate-ping',
        label: t('heat.danger')
      };
    }
    return {
      classes: 'bg-gradient-to-r from-loo to-angaar text-white border-angaar shadow-glow-loo font-bold',
      dot: 'bg-white animate-ping',
      label: t('heat.extreme')
    };
  };

  const { classes, dot, label } = getStyle();

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-pill border text-xs shadow-xs transition-all ${classes}`}
      title={`Live Apparent Heat Index: ${heatIndexC}°C`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
      <span className="font-mono font-extrabold text-xs">{heatIndexC}°C</span>
      <span className="hidden sm:inline-block font-medium border-l border-current/25 pl-1.5 opacity-90 text-[11px]">
        {label}
      </span>
    </div>
  );
};

export default HeatPill;
