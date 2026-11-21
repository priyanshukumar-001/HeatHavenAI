import { z } from 'zod';
import { computeHeatGap } from '../services/gridService.js';
import { getAirQuality } from '../services/airQualityService.js';
import { NOIDA_PILOT } from '../constants/geo.js';

export const heatGapQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).default(NOIDA_PILOT.CENTER_LAT),
  lng: z.coerce.number().min(-180).max(180).default(NOIDA_PILOT.CENTER_LNG)
});

/**
 * Handle GET /api/analytics/heat-gap
 */
export async function handleGetHeatGap(req, res, next) {
  try {
    const { lat, lng } = req.query;
    const result = await computeHeatGap(lat, lng);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Handle GET /api/analytics/aqi - Real-time Air Quality Data
 */
export async function handleGetAqi(req, res, next) {
  try {
    const { lat = NOIDA_PILOT.CENTER_LAT, lng = NOIDA_PILOT.CENTER_LNG } = req.query;
    const result = await getAirQuality(Number(lat), Number(lng));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

