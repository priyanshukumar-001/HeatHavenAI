import { apiRequest } from '../../lib/apiClient.js';
import { PILOT_COORDS } from '../../lib/constants.js';

/**
 * Fetch heat-gap municipal analytics
 */
export async function fetchHeatGapAnalytics(lat = PILOT_COORDS.LAT, lng = PILOT_COORDS.LNG) {
  return apiRequest(`/analytics/heat-gap?lat=${lat}&lng=${lng}`);
}

/**
 * Fetch real-time Air Quality telemetry
 */
export async function fetchRealTimeAqi(lat = PILOT_COORDS.LAT, lng = PILOT_COORDS.LNG) {
  return apiRequest(`/analytics/aqi?lat=${lat}&lng=${lng}`);
}

