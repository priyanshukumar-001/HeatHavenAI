import React from 'react';
import { motion } from 'framer-motion';

/**
 * KpiCard Component (Modern High-End SaaS / Delivery Style)
 * Clean white card with soft diffuse shadow, vibrant status chip, and bold mono metrics.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string|number} props.value
 * @param {string} [props.subtitle]
 * @param {'loo' | 'pani' | 'chhaon' | 'ember' | 'red' | 'blue' | 'green' | 'yellow'} [props.color='blue']
 * @param {string} [props.icon]
 */
export const KpiCard = ({
  title,
  value,
  subtitle,
  color = 'blue',
  icon
}) => {
  const styles = {
    loo: { dot: 'bg-rose-500', text: 'text-rose-600', badge: 'bg-rose-50 text-rose-600 border-rose-200' },
    red: { dot: 'bg-rose-500', text: 'text-rose-600', badge: 'bg-rose-50 text-rose-600 border-rose-200' },
    pani: { dot: 'bg-blue-600', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
    blue: { dot: 'bg-blue-600', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
    chhaon: { dot: 'bg-emerald-600', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    green: { dot: 'bg-emerald-600', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    ember: { dot: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-600 border-amber-200' },
    yellow: { dot: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-600 border-amber-200' }
  };

  const style = styles[color] || styles.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 md:p-6 rounded-2xl bg-card border border-line text-ink flex flex-col justify-between shadow-xs hover:shadow-1 transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-ink-2 tracking-wide uppercase font-mono">{title}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border text-xs shadow-xs ${style.badge}`}>
          {icon ? <i className={`fa-solid ${icon}`} /> : <span className={`w-2 h-2 rounded-full ${style.dot}`} />}
        </div>
      </div>

      <div className="my-3">
        <span className={`font-mono text-3xl md:text-4xl font-black tracking-tight ${style.text}`}>
          {value}
        </span>
      </div>

      {subtitle && (
        <div className="flex items-center gap-2 pt-2 border-t border-line">
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          <p className="text-[11px] text-ink-3 font-medium truncate font-sans">
            {subtitle}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default KpiCard;
