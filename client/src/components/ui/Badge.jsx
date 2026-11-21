import React from 'react';

/**
 * Badge Component (SPEC Section 4.5)
 * Pill badge for tags, categories, or status.
 * 
 * @param {Object} props
 * @param {string} [props.variant='neutral']
 * @param {string} [props.icon]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export const Badge = ({
  variant = 'neutral',
  icon,
  children,
  className = ''
}) => {
  const variants = {
    neutral: 'bg-surface-chip text-surface-secondary border-surface-border',
    blue: 'bg-blue-light text-blue-strong border-blue/20',
    green: 'bg-green-light text-green-text border-green/30',
    yellow: 'bg-yellow-light text-amber-text border-[#FBBC04]/40',
    red: 'bg-red-light text-red-text border-red/30'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-xs font-semibold border ${variants[variant] || variants.neutral} ${className}`}
    >
      {icon && <i className={`fa-solid ${icon} text-[11px]`} />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;

