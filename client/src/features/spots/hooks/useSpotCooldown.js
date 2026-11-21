import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hh_spot_cooldowns';
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

/**
 * Hook to manage 4-hour cooldown per spot per user/device
 * @param {string} [spotId]
 * @returns {Object} { isCoolingDown, remainingTimeFormatted, recordVerification }
 */
export function useSpotCooldown(spotId) {
  const [cooldowns, setCooldowns] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [remainingMs, setRemainingMs] = useState(0);

  // Check cooldown status for current spot
  useEffect(() => {
    if (!spotId) {
      setRemainingMs(0);
      return;
    }

    const lastTime = cooldowns[spotId];
    if (!lastTime) {
      setRemainingMs(0);
      return;
    }

    const elapsed = Date.now() - lastTime;
    const remaining = Math.max(0, FOUR_HOURS_MS - elapsed);
    setRemainingMs(remaining);

    if (remaining > 0) {
      const interval = setInterval(() => {
        const currentElapsed = Date.now() - lastTime;
        const currentRemaining = Math.max(0, FOUR_HOURS_MS - currentElapsed);
        setRemainingMs(currentRemaining);
        if (currentRemaining <= 0) {
          clearInterval(interval);
        }
      }, 30000); // update every 30s

      return () => clearInterval(interval);
    }
  }, [spotId, cooldowns]);

  const recordVerification = useCallback((id) => {
    const targetId = id || spotId;
    if (!targetId) return;

    const updated = {
      ...cooldowns,
      [targetId]: Date.now()
    };
    setCooldowns(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage error non-fatal
    }
    setRemainingMs(FOUR_HOURS_MS);
  }, [spotId, cooldowns]);

  const formatRemaining = (ms) => {
    if (ms <= 0) return '';
    const totalMinutes = Math.ceil(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return {
    isCoolingDown: remainingMs > 0,
    remainingTimeFormatted: formatRemaining(remainingMs),
    recordVerification
  };
}

