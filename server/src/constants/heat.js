/**
 * Heat index thresholds and Open-Meteo cache configuration
 * Defined in SPEC.md Section 4.4 & 5.7
 */
export const HEAT_BANDS = {
  NORMAL_MAX: 32,
  CAUTION_MAX: 38,
  DANGER_MAX: 44
};

export const HEAT_LEVELS = {
  NORMAL: 'normal',
  CAUTION: 'caution',
  DANGER: 'danger',
  EXTREME: 'extreme'
};

export const WEATHER_CONFIG = {
  DEFAULT_CACHE_MINUTES: 30,
  OPEN_METEO_API_URL: 'https://api.open-meteo.com/v1/forecast'
};

