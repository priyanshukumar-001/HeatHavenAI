import { useState, useEffect, useCallback } from 'react';
import { fetchNearbySpots } from '../api.js';
import { PILOT_COORDS, PILOT_FALLBACK_SPOTS } from '../../../lib/constants.js';

function calculateDistanceM(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function useNearbySpots({ lat = PILOT_COORDS.LAT, lng = PILOT_COORDS.LNG, category = 'all' }) {
  const [spots, setSpots] = useState([]);
  const [heat, setHeat] = useState({ heatIndexC: 42, level: 'danger' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFilteredFallback = useCallback(() => {
    let list = PILOT_FALLBACK_SPOTS;
    if (category && category !== 'all') {
      list = list.filter((s) => s.category === category);
    }
    return list
      .map((s) => ({
        ...s,
        distanceM: calculateDistanceM(lat, lng, s.location.lat, s.location.lng)
      }))
      .sort((a, b) => a.distanceM - b.distanceM);
  }, [category, lat, lng]);

  const loadSpots = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNearbySpots({ lat, lng, radius: 25000, category });
      if (data && data.spots && data.spots.length > 0) {
        setSpots(data.spots);
      } else {
        setSpots(getFilteredFallback());
      }
      if (data && data.heat) {
        setHeat(data.heat);
      }
    } catch {
      setSpots(getFilteredFallback());
      setHeat({ heatIndexC: 42, level: 'danger' });
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, category, getFilteredFallback]);

  useEffect(() => {
    loadSpots();
  }, [loadSpots]);

  return {
    spots,
    heat,
    isLoading,
    error,
    refetch: loadSpots,
    setSpots
  };
}
