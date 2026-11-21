import React from 'react';
import { motion } from 'framer-motion';

/**
 * GapGrid Component (Modern Clean SaaS / Delivery Style)
 * Visual cell matrix showing pilot area zones and heat desert alert flags
 *
 * @param {Object} props
 * @param {Array} props.cells
 * @param {Function} [props.onSelectCell]
 */
export const GapGrid = ({ cells = [], onSelectCell = () => {} }) => {
  return (
    <div className="p-6 md:p-7 rounded-2xl bg-card border border-line text-ink space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-black text-lg text-ink">
              Delhi-NCR & Kanpur Heat-Gap Grid
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              250M BLOCKS
            </span>
          </div>
          <p className="text-xs text-ink-2 font-sans mt-0.5">
            Microclimate zones ranked by Gap Score (Normalized Heat Index / Verified Relief Spots)
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full self-start sm:self-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          Critical Heat Deserts
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cells.map((cell, idx) => {
          const isDesert = cell.isHeatDesert;
          return (
            <motion.div
              key={cell.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04, duration: 0.2 }}
              onClick={() => onSelectCell(cell)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all select-none ${
                isDesert
                  ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400 shadow-xs'
                  : 'bg-paper border-line hover:bg-card hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-line text-ink">
                  #{cell.rank}
                </span>
                {isDesert ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white tracking-wide shadow-xs flex items-center gap-1">
                    <i className="fa-solid fa-triangle-exclamation text-[9px]" />
                    HEAT DESERT
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ COVERED
                  </span>
                )}
              </div>

              <h4 className="font-heading font-bold text-sm text-ink truncate mb-2">
                {cell.name}
              </h4>

              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-line/60">
                <span className="font-mono text-rose-600 font-bold">
                  {cell.heatIndexC}°C
                </span>
                <span className="font-mono text-blue-600 font-bold">
                  {cell.verifiedSpots} Spots
                </span>
                <span className="text-[11px] font-mono text-ink-3">
                  Gap: {cell.gapScore?.toFixed(1) || '—'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GapGrid;
