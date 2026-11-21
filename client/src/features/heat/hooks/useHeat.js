import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../lib/apiClient.js';
import { PILOT_COORDS } from '../../../lib/constants.js';

const POLL_INTERVAL_MS = 120_000; // Re-fetch every 2 minutes

/**
 * Hook for live heat index data from the backend
 * @param {Object} options
 * @param {number} [options.lat]
 * @param {number} [options.lng]
 * @returns {{ heatIndexC: number, level: string, isLoading: boolean }}
 */
export function useHeat({ lat = PILOT_COORDS.LAT, lng = PILOT_COORDS.LNG } = {}) {
  const [heatIndexC, setHeatIndexC] = useState(null);
  const [level, setLevel] = useState('danger');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHeat = useCallback(async () => {
    try {
      const data = await apiRequest(`/spots/nearby?lat=${lat}&lng=${lng}&radius=500`);
      if (data.heat) {
        setHeatIndexC(data.heat.heatIndexC);
        setLevel(data.heat.level);
      }
    } catch {
      // Keep previous values on error; fallback to 42 on first load
      setHeatIndexC((prev) => prev ?? 42);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    fetchHeat();
    const timer = setInterval(fetchHeat, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchHeat]);

  return { heatIndexC: heatIndexC ?? 42, level, isLoading };
}

