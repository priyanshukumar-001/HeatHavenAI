import React from 'react';

/**
 * Button Component (SPEC Section 4.5)
 * Primary = blue fill, white text, hover blue-strong
 * Secondary = white with border
 * Danger = red text/border or red fill
 * Tap target minimum 48px height
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'danger'} [props.variant='primary']
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export const Button = ({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  ...rest
}) => {
  const baseStyles = 'min-h-[48px] px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-strong';

  const variants = {
    primary: 'bg-blue hover:bg-blue-strong text-white shadow-1',
    secondary: 'bg-white hover:bg-surface-chip text-surface-text border border-surface-border shadow-xs',
    danger: 'bg-red text-white hover:bg-[#D93025] shadow-1'
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

