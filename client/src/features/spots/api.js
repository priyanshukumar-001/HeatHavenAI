import { apiRequest } from '../../lib/apiClient.js';

/**
 * Fetch nearby spots from backend API
 */
export async function fetchNearbySpots({ lat, lng, radius = 1000, category }) {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    radius: radius.toString()
  });

  if (category && category !== 'all') {
    params.append('category', category);
  }

  return apiRequest(`/spots/nearby?${params.toString()}`);
}

/**
 * Submit community report for a spot
 */
export async function submitReport({ spotId, type, lat, lng, deviceId }) {
  return apiRequest(`/spots/${spotId}/report`, {
    method: 'POST',
    body: JSON.stringify({ type, lat, lng, deviceId })
  });
}

/**
 * Submit spot photo verification
 */
export async function verifyPhoto({ spotId, formData }) {
  if (spotId && !formData.has('spotId')) {
    formData.append('spotId', spotId);
  }
  const res = await fetch(`/api/spots/verify-photo`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}
