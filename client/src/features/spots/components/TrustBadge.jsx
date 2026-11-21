import React from 'react';
import { useT } from '../../../i18n/useT.js';

/**
 * Modern Gen-Z TrustBadge Component (REDESIGN_SPEC v2)
 * Tactile verification badge with icon, bilingual status, and bold JetBrains Mono score.
 */
export const TrustBadge = ({ score = 50, lang = 'en' }) => {
  const t = useT(lang);

  let style = 'bg-loo-soft text-loo border border-loo/30';
  let icon = 'fa-circle-xmark';
  let label = t('trust.likelyClosed');

  if (score >= 70) {
    style = 'bg-chhaon-soft text-chhaon border border-chhaon/30 font-bold';
    icon = 'fa-circle-check';
    label = t('trust.verified');
  } else if (score >= 40) {
    style = 'bg-aaram-soft text-amber-text border border-aaram/40 font-semibold';
    icon = 'fa-triangle-exclamation';
    label = t('trust.check');
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-xs shadow-xs transition-all ${style}`}
    >
      <i className={`fa-solid ${icon} text-[11px]`} />
      <span>{label}</span>
      <span className="font-mono font-extrabold ml-0.5">{score}</span>
    </span>
  );
};

export default TrustBadge;
