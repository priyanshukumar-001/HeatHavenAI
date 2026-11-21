/**
 * Utility functions for formatting distances, trust badges, and relative times
 */

/**
 * Format distance in meters or kilometers
 * @param {number} meters
 * @returns {string} e.g. "180 m" or "1.2 km"
 */
export function formatDistance(meters) {
  if (meters === undefined || meters === null) return '-- m';
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format relative verification time using i18n-compatible interpolation keys.
 * Falls back to inline strings keyed by lang for backward compatibility.
 * @param {string|Date} dateStr
 * @param {'en' | 'hi'} [lang='en']
 * @returns {string}
 */
export function formatRelativeTime(dateStr, lang = 'en') {
  if (!dateStr) return lang === 'hi' ? 'हाल ही में' : 'Recently';

  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) {
    return lang === 'hi' ? 'अभी-अभी' : 'Just now';
  }
  if (minutes < 60) {
    return lang === 'hi'
      ? `${minutes} min पहले verify हुआ`
      : `Verified ${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return lang === 'hi'
      ? `${hours} घंटे पहले verify हुआ`
      : `Verified ${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return lang === 'hi'
    ? `${days} दिन पहले verify हुआ`
    : `Verified ${days}d ago`;
}
