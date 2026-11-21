/**
 * Anonymous Device Identity for Spam Prevention
 * Generates and preserves a random UUID in localStorage.
 * No personal data or user accounts.
 */
const DEVICE_KEY = 'heathaven_device_id';

export function getDeviceId() {
  if (typeof window === 'undefined') return 'server_side_device';

  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
}

