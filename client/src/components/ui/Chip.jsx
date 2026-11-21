import React from 'react';

/**
 * Filter Chip Component (Loo & Chhaon Theme)
 * Pill radius (rounded-full), 40px min height, active chip fills with category color.
 *
 * @param {Object} props
 * @param {boolean} [props.active=false]
 * @param {string} [props.activeColor='bg-pani text-white']
 * @param {string} [props.icon]
 * @param {string} props.label
 * @param {Function} [props.onClick]
 */
export const Chip = ({
  active = false,
  activeColor = 'bg-pani text-white',
  icon,
  label,
  onClick = () => {},
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`h-10 min-h-[40px] px-4 rounded-full text-xs font-bold shrink-0 flex items-center gap-2 transition-all shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-pani ${
        active
          ? activeColor
          : 'bg-card/95 text-ink hover:bg-paper-2 border border-line'
      } ${className}`}
      style={{ minWidth: '48px' }}
    >
      {icon && <i className={`fa-solid ${icon} text-xs`} />}
      <span className="font-sans">{label}</span>
    </button>
  );
};

export default Chip;
