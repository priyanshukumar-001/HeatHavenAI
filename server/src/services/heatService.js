import { cache } from '../utils/cache.js';
import { HEAT_BANDS, HEAT_LEVELS, WEATHER_CONFIG } from '../constants/heat.js';
import { ENV } from '../config/env.js';

/**
 * Classify temperature into HeatHaven alert level
 * @param {number} tempC 
 * @returns {'normal' | 'caution' | 'danger' | 'extreme'}
 */
export function classifyHeatLevel(tempC) {
  if (tempC < HEAT_BANDS.NORMAL_MAX) return HEAT_LEVELS.NORMAL;
  if (tempC <= HEAT_BANDS.CAUTION_MAX) return HEAT_LEVELS.CAUTION;
  if (tempC <= HEAT_BANDS.DANGER_MAX) return HEAT_LEVELS.DANGER;
  return HEAT_LEVELS.EXTREME;
}

/**
 * Fetch apparent temperature for a coordinate from Open-Meteo API with caching
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<{ heatIndexC: number, level: string, isCached: boolean }>}
 */
export async function getHeatIndex(lat, lng) {
  const cacheKey = `weather_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return { ...cached, isCached: true };
  }

  try {
    const url = `${WEATHER_CONFIG.OPEN_METEO_API_URL}?latitude=${lat}&longitude=${lng}&current=apparent_temperature&hourly=apparent_temperature&timezone=auto`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Open-Meteo responded with status ${res.status}`);
    }

    const data = await res.json();
    const currentTemp = data.current?.apparent_temperature ?? 41.5;
    const level = classifyHeatLevel(currentTemp);

    const result = {
      heatIndexC: Math.round(currentTemp),
      level,
      isCached: false
    };

    cache.set(cacheKey, result, ENV.OPEN_METEO_CACHE_MIN);
    return result;
  } catch {
    // Non-blocking fallback for offline/sandbox mode
    const fallbackTemp = 42;
    return {
      heatIndexC: fallbackTemp,
      level: classifyHeatLevel(fallbackTemp),
      isCached: false,
      fallback: true
    };
  }
}
