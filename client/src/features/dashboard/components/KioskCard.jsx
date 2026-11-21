import React from 'react';
import { motion } from 'framer-motion';

/**
 * KioskCard Component (Modern Clean SaaS Placement Engine)
 * "Next Kiosk Here" algorithmic recommendation card
 *
 * @param {Object} props
 * @param {Object} props.recommendation
 */
export const KioskCard = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 rounded-2xl bg-card border border-line text-ink space-y-4 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-base shadow-xs">
            <i className="fa-solid fa-faucet-drip" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-blue-600 tracking-wider">
              Optimal Placement Engine
            </span>
            <h3 className="font-heading font-black text-base text-ink">
              Recommended: Next Water Kiosk Placement
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-50 text-xs font-mono font-bold text-emerald-700 border border-emerald-200">
          Priority 1
        </span>
      </div>

      <div className="bg-paper p-4 rounded-xl border border-line space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
          <span className="font-heading font-bold text-sm text-ink">{recommendation.zoneName}</span>
          <span className="font-mono text-ink-3 text-[11px]">
            Coords: {recommendation.center.lat.toFixed(4)}°N, {recommendation.center.lng.toFixed(4)}°E
          </span>
        </div>

        <p className="text-xs text-ink-2 leading-relaxed font-sans">
          {recommendation.reason}
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-semibold border-t border-line">
          <i className="fa-solid fa-users" />
          <span>Estimated Beneficiaries: {recommendation.estimatedBeneficiaries} outdoor workers / day</span>
        </div>
      </div>
    </motion.div>
  );
};

export default KioskCard;
