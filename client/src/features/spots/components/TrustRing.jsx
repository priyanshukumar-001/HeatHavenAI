import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern Gen-Z TrustRing Component (REDESIGN_SPEC Section 5)
 * Circular SVG progress ring animating from 0 to score value with mono numeral
 */
export const TrustRing = ({ score = 75, size = 56 }) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = 'var(--loo)';
  if (score >= 70) strokeColor = 'var(--chhaon)';
  else if (score >= 40) strokeColor = 'var(--aaram)';

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--line)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated fill progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-black text-xs leading-none text-ink">
          {score}
        </span>
        <span className="text-[9px] uppercase font-bold text-ink-3 tracking-tighter">
          trust
        </span>
      </div>
    </div>
  );
};

export default TrustRing;
