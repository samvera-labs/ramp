import { useCallback, useEffect } from "react";
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
 * maxItems is enforced by evicting the least-recently-used entry at the end.
 * @param {Array} cache cached playback position array in localStorage
 * @param {String} key canvasId of the current Canvas
 * @param {Object} value { time: float, savedAt: Date() } for the Canvas
 * @param {Number} maxItems maximum size of the LRU cache
 * @returns 
 */
function setCacheEntry(cache, key, value, maxItems) {
  const filtered = cache.filter((entry) => entry.key !== key);
  const updated = [{ key, value }, ...filtered];
  return updated.length > maxItems ? updated.slice(0, maxItems) : updated;
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
 * Custom hook for persisting per-Manifest playback positions in a bounded LRU cache.
 * All positions are stored under a single storage key. Each entry is keyed by Manifest URL
 * and stores the most recently active Canvas URL and playback time. Provides methods to,
 * - read the saved playback position (Canvas URL + time) for a Manifest
 * - update an entry for the latest playback position and moves it to the front (most recently used)
 * of the cache and evict least recently used entry (if maxItems is exceeded) from cache
 * - clear an existing playback position
 * for a given manifestURL (key). The cache is bounded by maxItems and TTL (set as # of days)
 * @param {Object} obj
 * @param {Boolean} obj.enable whether to enable saving playback positions
 * @param {Number}  obj.maxItems LRU capacity (number of max entries) -> default: 200
 * @param {Number}  obj.ttlDays days before an entry expires -> default: 30
 * @returns {{ savePosition, getPosition, clearPosition }}
 */
export const usePlaybackPositions = ({ enable, maxItems, ttlDays } = {}) => {
  const [cache, setCache] = useLocalStorage('playbackPositions', []);

  /* When caching is disabled, clear the cache. This ensures that when users toggle
  off the resume feature, all saved positions are cleared and they won't be resumed
  accidentally from previous settings. */
  useEffect(() => {
    if (!enable) {
      setCache([]);
    }
  }, [enable, setCache]);

  const savePosition = useCallback((manifestURL, canvasURL, time) => {
    // Do nothing when caching is disabled
    if (!enable) return;
    setCache((current) => setCacheEntry(current, manifestURL, { canvasURL, time, savedAt: Date.now() }, maxItems));
  }, [enable, maxItems, setCache]);

  const getPosition = useCallback((manifestURL) => {
    // Do nothing when caching is disabled
    if (!enable) return null;
    const entry = readCacheEntry(cache, manifestURL);
    if (!entry) return null;
    if (isExpired(entry.savedAt, ttlDays)) {
      setCache((current) => deleteCacheEntry(current, manifestURL));
      return null;
    }
    return { canvasURL: entry.canvasURL, time: entry.time };
  }, [enable, cache, ttlDays, setCache]);

  const clearPosition = useCallback((manifestURL) => {
    // Do nothing when caching is disabled
    if (!enable) return;
    setCache((current) => deleteCacheEntry(current, manifestURL));
  }, [enable, setCache]);

  return { savePosition, getPosition, clearPosition };
};
