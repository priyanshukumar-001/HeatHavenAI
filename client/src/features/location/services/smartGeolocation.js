/**
 * smartGeolocation.js
 * Multi-Tier Smart Geolocation Resolver for HeatHaven AI:
 * Tier 1: Browser GPS / WiFi positioning (low-accuracy first for desktop reliability)
 * Tier 2: Automatic Network / IP-Based Geolocation Fallback (freeipapi / ipwho / ipapi)
 * Tier 3: City Presets & Clear Chrome Permission Instructions
 */

import { PILOT_COORDS, DELHI_NCR_REGIONS } from '../../../lib/constants.js';

/**
 * Fetch client location via public IP geolocation services with timeout
 * @param {number} [timeoutMs=4000]
 * @returns {Promise<{ lat: number, lng: number, city?: string, region?: string } | null>}
 */
export const fetchIpLocation = async (timeoutMs = 4000) => {
  const providers = [
    {
      url: 'https://ipwho.is/',
      parse: (d) => (d && d.success !== false && d.latitude && d.longitude ? { lat: d.latitude, lng: d.longitude, city: d.city, region: d.region } : null)
    },
    {
      url: 'https://freeipapi.com/api/json',
      parse: (d) => (d && d.latitude && d.longitude ? { lat: d.latitude, lng: d.longitude, city: d.cityName, region: d.regionName } : null)
    },
    {
      url: 'https://ipapi.co/json/',
      parse: (d) => (d && d.latitude && d.longitude ? { lat: d.latitude, lng: d.longitude, city: d.city, region: d.region } : null)
    }
  ];

  for (const provider of providers) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(provider.url, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const parsed = provider.parse(data);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          return parsed;
        }
      }
    } catch {
      // Continue to next provider
    }
  }
  return null;
};

/**
 * Perform smart multi-tier geolocation resolution
 *
 * @param {Object} [options]
 * @param {Function} [options.onStatus] - Optional status reporter
 * @returns {Promise<{
 *   ok: boolean,
 *   source: 'gps' | 'ip' | 'preset',
 *   coords: { lat: number, lng: number },
 *   city?: string,
 *   accuracy?: number,
 *   errorReason?: 'denied' | 'unavailable' | 'timeout' | 'unsupported',
 *   message: string
 * }>}
 */
export const detectSmartLocation = async ({ onStatus = () => {} } = {}) => {
  onStatus('Checking browser GPS...');

  // 1. Try Browser Geolocation with high reliability options
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: false, // Low accuracy is much faster and works on desktops via WiFi/IP
            timeout: 5000,
            maximumAge: 60000
          }
        );
      });

      if (pos?.coords?.latitude && pos?.coords?.longitude) {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const accuracy = Math.round(pos.coords.accuracy || 100);
        return {
          ok: true,
          source: 'gps',
          coords,
          accuracy,
          message: `GPS location locked (±${accuracy}m accuracy)`
        };
      }
    } catch (browserErr) {
      let reason = 'unavailable';
      if (browserErr?.code === 1) reason = 'denied';
      else if (browserErr?.code === 3) reason = 'timeout';

      onStatus('GPS unavailable, resolving via network IP...');

      // 2. Fallback to IP Geolocation
      const ipResult = await fetchIpLocation(4000);
      if (ipResult) {
        return {
          ok: true,
          source: 'ip',
          coords: { lat: ipResult.lat, lng: ipResult.lng },
          city: ipResult.city || ipResult.region || 'Detected Area',
          accuracy: 5000,
          errorReason: reason,
          message: `Detected via Network/IP: ${ipResult.city || 'Your Area'}`
        };
      }

      // 3. If both failed, return structured failure with reason so UI can help user
      return {
        ok: false,
        source: 'preset',
        coords: { lat: PILOT_COORDS.LAT, lng: PILOT_COORDS.LNG },
        city: 'Noida Sector 18 (Default)',
        errorReason: reason,
        message:
          reason === 'denied'
            ? 'Browser blocked location. Click the lock icon in the address bar to allow location.'
            : 'Unable to acquire satellite lock. Choose your city below.'
      };
    }
  }

  // 4. No navigator.geolocation support
  onStatus('Resolving via network IP...');
  const ipResult = await fetchIpLocation(4000);
  if (ipResult) {
    return {
      ok: true,
      source: 'ip',
      coords: { lat: ipResult.lat, lng: ipResult.lng },
      city: ipResult.city || ipResult.region,
      message: `Detected via Network/IP: ${ipResult.city || 'Your Area'}`
    };
  }

  return {
    ok: false,
    source: 'preset',
    coords: { lat: PILOT_COORDS.LAT, lng: PILOT_COORDS.LNG },
    city: 'Noida Sector 18 (Default)',
    errorReason: 'unsupported',
    message: 'Geolocation not supported. Choose your city below.'
  };
};

/**
 * Helper to match coordinates to closest predefined city/region
 * @param {number} lat
 * @param {number} lng
 * @returns {typeof DELHI_NCR_REGIONS[0]}
 */
export const findClosestRegion = (lat, lng) => {
  let closest = DELHI_NCR_REGIONS[0];
  let minDistance = Infinity;
  for (const r of DELHI_NCR_REGIONS) {
    const dist = Math.hypot(lat - r.lat, lng - r.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = r;
    }
  }
  return closest;
};
