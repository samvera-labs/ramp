import { useContext, useEffect, useMemo } from 'react';
import WaveformData from 'waveform-data';
import { handleFetchErrors } from '@Services/utility-helpers';
import { ManifestDispatchContext, ManifestStateContext } from '../../context/manifest-context';
import { PlayerStateContext } from '../../context/player-context';
import { IS_MOBILE } from '@Services/browser';

/**
 * Fetch/parse the current Canvas's waveform resource(s) if they exist, and pass the results to the
 * player instance for the VideoJSWaveform component to render.
 * When a given Canvas is multi-sourced, waveforms from each resource are combined into a single
 * continuous waveform spanning the entire duration of the Canvas.
 * @param {Object} obj
 * @param {Function} obj.nextItemClicked callback function to switch source when using waveform panel
 * @param {Object} obj.savedPosition resumable saved playback position in the current Manifest
 * @param {Boolean} obj.showWaveform whether to show the waveform toggle button in the control bar
 * @param {Object} obj.waveformRef React ref to the VideoJSWaveform component
 * @returns { hasWaveform }
 */
export const useWaveform = ({ nextItemClicked, savedPosition, showWaveform, waveformRef }) => {
  const { player } = useContext(PlayerStateContext);
  const { canvasIndex, allCanvases } = useContext(ManifestStateContext);
  const manifestDispatch = useContext(ManifestDispatchContext);

  const waveformResources = allCanvases[canvasIndex]?.waveform ?? [];

  const hasWaveform = useMemo(() => {
    return waveformResources.length > 0 && showWaveform;
  }, [allCanvases, canvasIndex]);

  async function fetchSingleWaveform(waveform, signal) {
    const { id, format, waveformType } = waveform ?? {};
    if (!id || !waveformType) return null;

    if (waveformType === 'image') {
      return { type: 'image', url: id };
    }

    try {
      const response = await fetch(id, { signal }).then(handleFetchErrors);
      const isJSON = format === 'application/json';
      const rawData = isJSON ? await response.json() : await response.arrayBuffer();
      const data = WaveformData.create(rawData);
      return { type: 'peaks', data };
    } catch (error) {
      if (error.name === 'AbortError') return null;
      console.error('useWaveform -> fetchSingleWaveform() -> failed to fetch/parse waveform data, ', error);
      return null;
    }
  }

  /**
   * Fetch all given waveform resource(s) for the current Canvas and concatenate the peaks data
   * into a single continuous 'WaveformData' instance. Waveform resources that are failed to
   * fetch/parse are skipped. Falls back to image waveform when no peaks data is available.
   */
  async function fetchWaveformData(resources, signal) {
    const results = await Promise.all(resources.map((resource) => fetchSingleWaveform(resource, signal)));
    if (signal.aborted) return null;

    const peaks = results.filter((r) => r?.type === 'peaks').map((r) => r.data);
    if (peaks.length > 0) {
      try {
        const [first, ...rest] = peaks;
        const data = rest.length > 0 ? first.concat(...rest) : first;
        return { type: 'peaks', data };
      } catch (error) {
        console.error('useWaveform -> fetchWaveformData() -> failed to concatenate waveform data, ', error);
        return { type: 'peaks', data: peaks[0] };
      }
    }

    // Fallback to look for a single image waveform resource
    const image = results.find((r) => r?.type === 'image');
    return image ?? null;
  }

  useEffect(() => {
    // Do nothing if either player is null or showWaveform is set to false
    if (!player || !showWaveform) return;

    if (waveformResources.length === 0) {
      player.waveform = null;
      player.trigger('waveformupdated');
      manifestDispatch({ type: 'setWaveform', waveform: { data: null, isLoading: false, error: null } });
      updateWaveformControl(false);
      return;
    }

    const controller = new AbortController();
    // Rest waveform data in state before fetching again
    manifestDispatch({ type: 'setWaveform', waveform: { data: null, isLoading: true, error: null } });

    fetchWaveformData(waveformResources, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      player.waveform = result;
      player.trigger('waveformupdated');
      manifestDispatch({
        type: 'setWaveform',
        waveform: { data: result, isLoading: false, error: result ? null : 'Failed to load waveform' },
      });
      updateWaveformControl(!!result);
    });

    // Cleanup
    return () => { controller.abort(); };
  }, [canvasIndex, allCanvases, player]);

  /**
   * Add/remove the waveform toggle button to the player's control-bar if/when a waveform representation
   * of the current Canvas is available. This is separated from the control-bar updates in the 'updatePlayer()'
   * in VideoJSPlayer because, this has to wait till asynchronous fetching of the waveform data is resolved.
   * @param {Boolean} hasWaveformResult whether the fetch resolved to usable waveform data
   */
  const updateWaveformControl = (hasWaveformResult) => {
    const controlBar = player.getChild('controlBar');
    if (!controlBar) return;

    if (!hasWaveformResult) {
      controlBar.removeChild('videoJSWaveform');
    } else if (!controlBar.getChild('videoJSWaveform')) {
      const hasSavedPosition = savedPosition != null || savedPosition != undefined;
      const volumeIndex = IS_MOBILE
        ? controlBar.children().findIndex((c) => c.name_ == 'MuteToggle')
        : controlBar.children().findIndex((c) => c.name_ == 'VolumePanel');
      controlBar.addChild(
        'videoJSWaveform',
        { waveformRef, hasSavedPosition, nextItemClicked },
        volumeIndex + 1);
    }
  };

  return { hasWaveform };
};
