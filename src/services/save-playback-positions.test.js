import { renderHook, act } from '@testing-library/react';
import { usePlaybackPositions } from './save-playback-positions';

describe('usePlaybackPositions', () => {
  const defaultOptions = { enable: false, ttlDays: 30, maxItems: 200 };
  const turnedOnOptions = { enable: true, ttlDays: 30, maxItems: 200 };
  beforeEach(() => {
    localStorage.clear();
    // Mock Date.now to a fixed timestamp for consistent testing of TTL logic
    jest.spyOn(Date, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const MANIFEST_URL = 'https://example.com/manifest.json';
  const MANIFEST_URL_1 = 'https://example.com/manifest/1';
  const MANIFEST_URL_2 = 'https://example.com/manifest/2';
  const MANIFEST_URL_3 = 'https://example.com/manifest/3';
  const CANVAS_URL_1 = 'https://example.com/canvas/1';
  const CANVAS_URL_2 = 'https://example.com/canvas/2';

  describe('savePosition()', () => {
    test('returns nothing when resume cache is disabled (default)', () => {
      const { result } = renderHook(() => usePlaybackPositions(defaultOptions));
      act(() => {
        result.current.savePosition(MANIFEST_URL, CANVAS_URL_1, 42.5);
      });
      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored).toEqual([]);
    });

    test('saves a position for a manifest URL', () => {
      const { result } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      act(() => {
        result.current.savePosition(MANIFEST_URL, CANVAS_URL_1, 42.5);
      });
      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored).toHaveLength(1);
      expect(stored[0].key).toBe(MANIFEST_URL);
      expect(stored[0].value.canvasURL).toBe(CANVAS_URL_1);
      expect(stored[0].value.time).toBe(42.5);
    });

    test('replaces and moves an existing entry to the front on update', () => {
      const { result } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      act(() => {
        result.current.savePosition(MANIFEST_URL_1, CANVAS_URL_1, 10);
        result.current.savePosition(MANIFEST_URL_2, CANVAS_URL_2, 20);
        result.current.savePosition(MANIFEST_URL_1, CANVAS_URL_1, 50);
      });
      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored).toHaveLength(2);
      expect(stored[0].key).toBe(MANIFEST_URL_1);
      expect(stored[0].value.time).toBe(50);
      expect(stored[1].key).toBe(MANIFEST_URL_2);
    });

    test('evicts the least-recently-used entry when maxItems is exceeded', () => {
      const { result } = renderHook(() => usePlaybackPositions({ ...turnedOnOptions, maxItems: 2 }));
      act(() => {
        result.current.savePosition(MANIFEST_URL_1, CANVAS_URL_1, 10);
        result.current.savePosition(MANIFEST_URL_2, CANVAS_URL_1, 20);
        result.current.savePosition(MANIFEST_URL_3, CANVAS_URL_1, 30);
      });
      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored).toHaveLength(2);
      expect(stored.map((e) => e.key)).not.toContain(MANIFEST_URL_1);
      expect(stored[0].key).toBe(MANIFEST_URL_3);
      expect(stored[1].key).toBe(MANIFEST_URL_2);
    });
  });

  describe('getPosition()', () => {
    test('returns nothing when resume cache is disabled (default)', () => {
      const { result } = renderHook(() => usePlaybackPositions(defaultOptions));
      act(() => {
        result.current.savePosition(MANIFEST_URL, CANVAS_URL_1, 42.5);
      });

      expect(result.current.getPosition(MANIFEST_URL)).toBeNull();
    });

    test('returns null when no entry exists for the manifest URL', () => {
      const { result } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      expect(result.current.getPosition(MANIFEST_URL)).toBeNull();
    });

    test('returns the saved canvas URL and time for a valid, non-expired entry', () => {
      const { result } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      act(() => {
        result.current.savePosition(MANIFEST_URL, CANVAS_URL_1, 42.5);
      });
      expect(result.current.getPosition(MANIFEST_URL)).toEqual({ canvasURL: CANVAS_URL_1, time: 42.5 });
    });

    test('returns null and removes the entry when it is expired', () => {
      // Save position at time 0
      jest.spyOn(Date, 'now').mockReturnValue(0);
      const { result } = renderHook(() => usePlaybackPositions({ ...turnedOnOptions, ttlDays: 1 }));
      act(() => {
        result.current.savePosition(MANIFEST_URL, CANVAS_URL_1, 42.5);
      });

      // Advance time past TTL (1 day + 1ms)
      jest.spyOn(Date, 'now').mockReturnValue(24 * 60 * 60 * 1000 + 1);
      let position;
      act(() => {
        position = result.current.getPosition(MANIFEST_URL);
      });
      expect(position).toBeNull();

      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored.find((e) => e.key === MANIFEST_URL)).toBeUndefined();
    });

    test('returns the saved position when entry is within TTL', () => {
      jest.spyOn(Date, 'now').mockReturnValue(0);
      const { result } = renderHook(() => usePlaybackPositions({ ...turnedOnOptions, ttlDays: 30 }));
      act(() => {
        result.current.savePosition(MANIFEST_URL, CANVAS_URL_1, 99);
      });

      // Advance time to just before TTL expires (29 days)
      jest.spyOn(Date, 'now').mockReturnValue(29 * 24 * 60 * 60 * 1000);
      const { result: result2 } = renderHook(() => usePlaybackPositions({ ...turnedOnOptions, ttlDays: 30 }));
      expect(result2.current.getPosition(MANIFEST_URL)).toEqual({ canvasURL: CANVAS_URL_1, time: 99 });
    });
  });

  describe('clearPosition()', () => {
    test('returns nothing when resume cache is disabled (default)', () => {
      localStorage.setItem(
        'playbackPositions',
        JSON.stringify([{ key: MANIFEST_URL, value: { canvasURL: CANVAS_URL_1, time: 120, savedAt: Date.now() } }])
      );

      const { result } = renderHook(() => usePlaybackPositions(defaultOptions));
      act(() => {
        result.current.clearPosition(MANIFEST_URL);
      });

      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored).toEqual([]);
    });

    test('removes the entry for the given manifest URL', () => {
      const { result } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      act(() => {
        result.current.savePosition(MANIFEST_URL_1, CANVAS_URL_1, 42.5);
        result.current.savePosition(MANIFEST_URL_2, CANVAS_URL_2, 10);
      });
      act(() => {
        result.current.clearPosition(MANIFEST_URL_1);
      });
      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored.find((e) => e.key === MANIFEST_URL_1)).toBeUndefined();
      expect(stored.find((e) => e.key === MANIFEST_URL_2)).toBeDefined();
    });

    test('does nothing when entry does not exist', () => {
      const { result } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      act(() => {
        result.current.savePosition(MANIFEST_URL_2, CANVAS_URL_2, 10);
      });
      act(() => {
        result.current.clearPosition(MANIFEST_URL_1);
      });
      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored).toHaveLength(1);
      expect(stored[0].key).toBe(MANIFEST_URL_2);
    });
  });

  describe('turned ON with default values', () => {
    test('uses maxItems=200', () => {
      const { result } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      // Fill up to 201 entries to trigger eviction at 200
      act(() => {
        for (let i = 0; i < 201; i++) {
          result.current.savePosition(`https://example.com/manifest/${i}`, CANVAS_URL_1, i);
        }
      });
      const stored = JSON.parse(localStorage.getItem('playbackPositions'));
      expect(stored).toHaveLength(200);

    });

    test('uses ttlDays=30', () => {
      const savedAt = 0;
      const { result } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      act(() => {
        result.current.savePosition(MANIFEST_URL, CANVAS_URL_1, 42.5);
      });

      // Verify entry with default TTL of 30 days is still valid after 29 days of saving
      jest.spyOn(Date, 'now').mockReturnValue(savedAt + 29 * 24 * 60 * 60 * 1000);
      const { result: result2 } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      expect(result2.current.getPosition(MANIFEST_URL)).not.toBeNull();

      // Verify entry is expired after the default TTL of 30 days
      jest.spyOn(Date, 'now').mockReturnValue(savedAt + 31 * 24 * 60 * 60 * 1000);
      const { result: result3 } = renderHook(() => usePlaybackPositions(turnedOnOptions));
      let position;
      act(() => {
        position = result3.current.getPosition(MANIFEST_URL);
      });
      expect(position).toBeNull();
    });
  });
});
