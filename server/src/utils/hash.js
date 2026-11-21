import crypto from 'crypto';

/**
 * Hash a client device identifier anonymously with salt
 * @param {string} deviceId 
 * @returns {string} SHA-256 hex digest
 */
export function hashDeviceId(deviceId) {
  if (!deviceId || typeof deviceId !== 'string') {
    throw new Error('Valid deviceId required for hashing');
  }
  return crypto.createHash('sha256').update(`heathaven_${deviceId.trim()}`).digest('hex');
}

