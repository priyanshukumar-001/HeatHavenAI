/**
 * Simple in-memory TTL cache for weather and AI responses
 */
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Store a value with a time-to-live in minutes
   * @param {string} key 
   * @param {*} value 
   * @param {number} ttlMinutes 
   */
  set(key, value, ttlMinutes = 30) {
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Retrieve a value from the cache, returning null if expired or missing
   * @param {string} key 
   * @returns {*}
   */
  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new MemoryCache();
export default cache;

