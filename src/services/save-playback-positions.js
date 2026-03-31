import { useCallback } from "react";
import { useLocalStorage } from '@Services/local-storage';

/**
 * Read a playback position from the cache by canvasId. Returns null if not found.
 * @param {Array} cache cached playback positions in LRU
 * @param {String} key canavasId of the current Canvas
 * @returns 
 */
function readCacheEntry(cache, key) {
  return cache.find((entry) => entry.key === key)?.value ?? null;
}

/**
 * Set the cache entry with the most recent playback position for the
 * current canvasId. If the canvasId already exists in the cache, it is
 * replaced and moved to the front. If not, a new entry is created and
 * maxSize is enforced by evicting the least-recently-used entry at the end.
 * @param {Array} cache cached playback position array in localStorage
 * @param {String} key canvasId of the current Canvas
 * @param {Object} value { time: float, savedAt: Date() } for the Canvas
 * @param {Number} maxSize maximum size of the LRU cache
 * @returns 
 */
function setCacheEntry(cache, key, value, maxSize) {
  const filtered = cache.filter((entry) => entry.key !== key);
  const updated = [{ key, value }, ...filtered];
  return updated.length > maxSize ? updated.slice(0, maxSize) : updated;
}

/**
 * Delete the cache entry for the given canvasId, if it exists. Used for clearing
 * playback position when user explicitly restarts from the beginning or reaches the
 * end of the media.
 * @param {Array} cache cached playback position array in localStorage
 * @param {String} key canvasId of the current Canvas
 * @returns {Array} updated cached playback position array to saved to localStorage
 */
function deleteCacheEntry(cache, key) {
  return cache.filter((entry) => entry.key !== key);
}

/**
 * Check whether a saved playback position in the cache is expired or not
 * based on its savedAt timestamp and TTL value.
 * @param {Date} savedAt DateTime value when the playback position was saved
 * @param {Number} ttlDays number of days before an entry expries
 * @returns {Boolean}
 */
function isExpired(savedAt, ttlDays) {
  return Date.now() - savedAt > ttlDays * 24 * 60 * 60 * 1000;
}

/**
 * Custom hook for persisting per-canvas playback positions in a bounded LRU cache.
 * All positions are stored under a single storage key. Provides methods to,
 * - read the saved playback position
 * - update an entry for the latest playback position and moves it to the front (most recently used)
 * of the cache and evict least recently used entry (if maxSize is exceeded) from cache
 * - clear an existing playback position
 * for a given canvasId (key). The cache is bounded by maxSize and TTL (set as # of days)
 * @param {Object} obj
 * @param {number}  obj.maxSize LRU capacity (number of max entries) -> default: 200
 * @param {number}  obj.ttlDays days before an entry expires -> default: 30
 * @returns {{ savePosition, getPosition, clearPosition }}
 */
export const usePlaybackPositions = ({ maxSize = 200, ttlDays = 30 } = {}) => {
  const [cache, setCache] = useLocalStorage('playbackPositions', []);

  const savePosition = useCallback((canvasURL, time) => {
    setCache((current) => setCacheEntry(current, canvasURL, { time, savedAt: Date.now() }, maxSize));
  }, [maxSize, setCache]);

  const getPosition = useCallback((canvasURL) => {
    const entry = readCacheEntry(cache, canvasURL);
    if (!entry) return null;
    if (isExpired(entry.savedAt, ttlDays)) {
      setCache((current) => deleteCacheEntry(current, canvasURL));
      return null;
    }
    return entry.time;
  }, [cache, ttlDays, setCache]);

  const clearPosition = useCallback((canvasURL) => {
    setCache((current) => deleteCacheEntry(current, canvasURL));
  }, [setCache]);

  return { savePosition, getPosition, clearPosition };
};
