import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { usePlayerDispatch, usePlayerState } from '../../context/player-context';

export const useStructurePlayback = ({ dismissNotice }) => {
  const { canvasIndex, canvasSegments, hasResume, structureOnlyPlayback } = useManifestState();
  const manifestDispatch = useManifestDispatch();
  const { player } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [firstTimespan, setFirstTimespan] = useState(null);

  /**
   * Get first structure timespan for the current Canvas. This timespan is used to
   * start the structure-only playback on the initial 'play' event, when no other
   * explicit start time (via Ramp start props or Manifest 'start' property) is set
   * for the Canvas.
   * @returns {Object | null} the earliest 'canvasSegments' leaf on that Canvas, or null
   */
  const getFirstStructureTimespanForCanvas = () => {
    const timespans = canvasSegments.filter(
      (t) => t.canvasIndex === canvasIndex + 1 && !t.isCanvas
    );
    if (timespans.length === 0) return null;
    return timespans.reduce((earliest, t) => (
      t.times.start < earliest.times.start ? t : earliest
    ));
  };

  /* Flag to indicate whether the initial 'play' event starts at the first timespan's start
  time on initial 'play' event. This is set when structure-only playback is turned ON and no
  other external factors affect the start time of playback, i.e. hasResume = false in state. */
  const playbackFromFirstTimespanRef = useRef(false);

  useEffect(() => {
    playbackFromFirstTimespanRef.current = structureOnlyPlayback && !hasResume;
    if (playbackFromFirstTimespanRef.current) {
      const firstTimespan = getFirstStructureTimespanForCanvas();
      if (firstTimespan) setFirstTimespan(firstTimespan);
    } else {
      dismissNotice();
      setFirstTimespan(null);
    }
  }, [canvasIndex, structureOnlyPlayback, hasResume]);

  /**
   * Callback to handle 'Play from beginning' button click in the structure-only playback notice.
   * This will ignore the first timespan and start playback from zero time mark. Once the first
   * timespan is encountered, the playback will switch over to structure-only playback unless the
   * user turns off structure-only playback.
   */
  const onPlayFromBeginning = () => {
    playbackFromFirstTimespanRef.current = false;
    dismissNotice();
    player.play();
  };

  /**
   * Callback to handle 'Turn Off' button click in the structure-only playback notice. This will
   * toggle off the structure-only playback and start playback from the the zero time mark.
   */
  const onTurnOff = () => {
    playbackFromFirstTimespanRef.current = false;
    dismissNotice();
    manifestDispatch({ structureOnlyPlayback: false, type: 'setStructureOnlyPlayback' });
  };

  useEffect(() => {
    if (!structureOnlyPlayback) {
      playbackFromFirstTimespanRef.current = false;
      dismissNotice();
    }
  }, [structureOnlyPlayback]);

  /* When structure-only playback is ON and no other start times (a saved playback position
  in localStorage or a custom start time either in Manifest or in Ramp props) are declared,
  playback should start at the start time of the first timespan in 'structures' when user
  hits 'play' button. */
  useEffect(() => {
    if (player) {
      player.on('play', () => {
        if (playbackFromFirstTimespanRef.current) {
          // Reset the flag and dismiss the notice so that, next 'play' events don't trigger this again
          playbackFromFirstTimespanRef.current = false;
          dismissNotice();
          if (firstTimespan) {
            player.currentTime(firstTimespan.times.start);
            playerDispatch({ currentTime: firstTimespan.times.start, type: 'setCurrentTime' });
            manifestDispatch({ item: firstTimespan, type: 'switchItem' });
          }
        }
      });
    }
  }, [player]);

  const handleChange = useCallback((e) => {
    e.target.setAttribute('aria-checked', String(!structureOnlyPlayback));
    manifestDispatch({ structureOnlyPlayback: !structureOnlyPlayback, type: 'setStructureOnlyPlayback' });
  });

  return { firstTimespan, handleChange, onPlayFromBeginning, onTurnOff, structureOnlyPlayback };
};
