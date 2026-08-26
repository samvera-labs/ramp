import React, { useEffect } from 'react';
import { render, waitFor } from '@testing-library/react';
import { useWaveform } from './useWaveform';
import { withManifestAndPlayerProvider, manifestState } from '@Services/testing-helpers';
import waveformManifest from '@TestData/waveform-example';

describe('useWaveform', () => {
  // not a real ref because react throws a warning if we use useRef outside a component
  const resultRef = { current: null };
  const waveformRef = { current: document.createElement('div') };

  // Minimal VideoJS player with a control-bar
  const mockPlayer = () => {
    const children = [];
    const controlBar = {
      children: () => children,
      getChild: (name) => children.find((c) => c.name_ === name),
      addChild: jest.fn((name, options) => {
        const child = { name_: name, options };
        children.push(child);
        return child;
      }),
      removeChild: jest.fn((name) => {
        const index = children.findIndex((c) => c.name_ === name);
        if (index > -1) children.splice(index, 1);
      }),
    };
    const listeners = {};
    return {
      getChild: (name) => (name === 'controlBar' ? controlBar : undefined),
      on: jest.fn((event, cb) => { listeners[event] = cb; }),
      trigger: jest.fn((event) => { listeners[event]?.(); }),
      _controlBar: controlBar,
    };
  };

  const renderHook = (props = {}) => {
    const UIComponent = () => {
      const results = useWaveform({ savedPosition: undefined, showWaveform: true, waveformRef, ...props });
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (<div></div>);
    };
    return UIComponent;
  };

  let player, originalError;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
    player = mockPlayer();
    resultRef.current = null;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    console.error = originalError;
  });

  describe('hasWaveform', () => {
    test('is false when the current Canvas has no valid waveform resource', () => {
      /* The 4th Canvas in this Manifest has a .xml with format 'text/xml' attached in 'seeAlso',
      which is not a vali waveform format. Therefore, it gets filtered out during parsing. */
      const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
        initialManifestState: { ...manifestState(waveformManifest, 3) },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      expect(resultRef.current.hasWaveform).toBe(false);
    });

    test('is false when "showWaveform" is turned off and the current Canvas has a valid waveform resource', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ showWaveform: false }), {
        initialManifestState: { ...manifestState(waveformManifest) },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      expect(resultRef.current.hasWaveform).toBe(false);
    });

    test('is true when "showWaveform" is turned on and the current Canvas has a valid waveform resource', () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          version: 2, channels: 1, sample_rate: 44100, samples_per_pixel: 512,
          bits: 8, length: 1, data: [0, 10],
        }),
      });
      const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
        initialManifestState: { ...manifestState(waveformManifest) },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      expect(resultRef.current.hasWaveform).toBe(true);
    });
  });

  describe('waveform data', () => {
    test('is not fetched when a player is not available', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
        initialManifestState: { ...manifestState(waveformManifest) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);

      await new Promise((r) => setTimeout(r, 0));
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    test('is not fetched when "showWaveform" is turned off', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ showWaveform: false }), {
        initialManifestState: { ...manifestState(waveformManifest) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);

      await new Promise((r) => setTimeout(r, 0));
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    test('fetch is skipped when the Canvas has no waveform resource', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
        initialManifestState: { ...manifestState(waveformManifest, 3) },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      await waitFor(() => {
        expect(player.trigger).toHaveBeenCalledWith('waveformupdated');
      });
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(player.waveform).toBeNull();
      // Does not add the toggle button to the player control-bar
      expect(player._controlBar.getChild('videoJSWaveform')).toBeUndefined();
    });

    test('is fetched and parsed for a JSON waveform dataset', async () => {
      const jsonPayload = {
        version: 2, channels: 1, sample_rate: 44100, samples_per_pixel: 512,
        bits: 8, length: 2, data: [0, 10, -5, 8],
      };
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(jsonPayload),
      });
      const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
        initialManifestState: { ...manifestState(waveformManifest) },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      // Adds the toggle button to the player control-bar
      await waitFor(() => {
        expect(player._controlBar.getChild('videoJSWaveform')).toBeDefined();
      });
      expect(fetchSpy).toHaveBeenCalledWith('http://example.com/waveform.json', expect.anything());
      expect(player.waveform.type).toBe('peaks');
      expect(player.waveform.data.channel(0).min_sample(0)).toBe(0);
    });

    test('in an accompanyingCanvas image waveform is updated without fetching', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
        initialManifestState: { ...manifestState(waveformManifest, 1) },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      // Adds the toggle button to the player control-bar
      await waitFor(() => {
        expect(player._controlBar.getChild('videoJSWaveform')).toBeDefined();
      });
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(player.waveform).toEqual({ type: 'image', url: 'http://example.com/waveform.jpg' });
    });

    test('in a failed fetch removes the toggle button', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
      const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
        initialManifestState: { ...manifestState(waveformManifest) },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
      });
      expect(player.waveform).toBeNull();
      expect(player._controlBar.getChild('videoJSWaveform')).toBeUndefined();
    });

    test('is fetched again when the Canvas changes via a re-render', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          version: 2, channels: 1, sample_rate: 44100, samples_per_pixel: 512,
          bits: 8, length: 1, data: [0, 10],
        }),
      });
      const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
        initialManifestState: { ...manifestState(waveformManifest) },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
      });

      // Re-render with a different Canvas that also has a JSON waveform dataset (canvas index 2)
      const CustomComponent1 = withManifestAndPlayerProvider(renderHook(), {
        initialManifestState: { ...manifestState(waveformManifest, 2) },
        initialPlayerState: { player },
      });
      render(<CustomComponent1 />);

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(2);
      });
    });
  });
});
