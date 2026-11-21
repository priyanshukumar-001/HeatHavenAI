import React from 'react';
import { motion } from 'framer-motion';

/**
 * TopColorBar / Heat Thermometer Bar (REDESIGN_SPEC Section 2.5)
 * 4px fixed --g-thermal bar at the very top of every page.
 * Sweeps in on load (600ms), then a luminous diamond marker settles
 * at the live heat index position.
 * 
 * @param {Object} props
 * @param {number} [props.heatIndex=42] Current apparent heat index in °C
 */
export const TopColorBar = ({ heatIndex = 42 }) => {
  // Map 28°C - 50°C to 0% - 100% position on the thermal spectrum
  const minTemp = 28;
  const maxTemp = 50;
  const clamped = Math.max(minTemp, Math.min(maxTemp, heatIndex));
  const markerPercent = ((clamped - minTemp) / (maxTemp - minTemp)) * 100;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1.5 z-50 pointer-events-auto"
      title={`Live Thermal Spectrum: ${heatIndex}°C`}
      aria-label={`Heat index ${heatIndex}°C`}
    >
      {/* 4px Thermal Gradient Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          originX: 0,
          background: 'var(--g-thermal)'
        }}
        className="w-full h-full shadow-xs"
      />

      {/* Live Heat Indicator Marker Needle */}
      <motion.div
        initial={{ left: '0%', opacity: 0 }}
        animate={{ left: `${markerPercent}%`, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
        style={{ left: `${markerPercent}%` }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md border-2 border-loo ring-2 ring-white/60 animate-pulse -mt-0.5" />
      </motion.div>
    </div>
  );
};

export default TopColorBar;
