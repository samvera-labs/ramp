import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { usePlayerDispatch, usePlayerState } from '../../context/player-context';
import { parseAutoAdvance } from '@Services/iiif-parser';

/**
 * Hook to handle state management related actions and other logic related to structure-only
 * playback feature
 * @param {Object} obj
 * @param {Boolean} obj.toggleState flag to indicate structure playback is toggled ON/OFF
 * @param {Boolean} obj.hasUI flag to indicate structure playback is turned ON with UI
 * @returns {
 * firstTimespan: obj,
 * handleChange: func,
 * onPlayFromBeginning: func,
 * onTurnOff: func,
 * showNotice: bool,
 * showStaticStructNotice: bool,
 * structureOnlyPlayback: bool
 * }
 */
export const useStructurePlayback = ({ toggleState, hasUI = true }) => {
  const { canvasIndex, canvasSegments, hasResume, manifest, structureOnlyPlayback } = useManifestState();
  const manifestDispatch = useManifestDispatch();
  const { isClicked, player } = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  const [firstTimespan, setFirstTimespan] = useState(null);
  // Store firstTimespan in a ref for the 'play' event hander
  const firstTimespanRef = useRef(null);
  firstTimespanRef.current = firstTimespan;

  const [showNotice, setShowNotice] = useState(false);
  const resetFirstTimespan = () => {
    setShowNotice(false);
    setFirstTimespan(null);
  };

  /* Local flag to keep track of user activity in structures for the current session.
  This is needed to remember a structure item was clicked at any point in the current
  session because, the 'isClicked' in global state is reset on Canvas changes. */
  const isClickedRef = useRef(false);

  // React refs for player instance and 'play' event handler callback
  const onInitialPlayRef = useRef(null);
  const initializedPlayerRef = useRef(null);

  /* Flag to indicate whether the initial 'play' event starts at the first timespan's start
  time on initial 'play' event. This is set when structure-only playback is turned ON and no
  other external factors affect the start time of playback, i.e. hasResume = false in state. */
  const playbackFromFirstTimespanRef = useRef(false);
  const setPlaybackFromFirstRef = (flag) => {
    playbackFromFirstTimespanRef.current = flag;
  };

  /**
   * Flag to indicate whether to display a static structure notice when structure-only playback
   * feature is turned ON in the background. Displaying this static notice helps maintain a11y
   * compliance around auto-play and programmatic seek action that happens on initial 'play'
   * event when the feature is turned on in the background.
   */
  const showStaticStructNotice = useMemo(() => {
    if (structureOnlyPlayback && playbackFromFirstTimespanRef.current && !hasUI) {
      return true;
    } else {
      return false;
    }
  }, [hasUI, playbackFromFirstTimespanRef.current, structureOnlyPlayback]);

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

  /**
   * Set the 'structureOnlyPlayback' in state on initial load if it is toggled ON/OFF in
   * 'StructuredNavigation' component via 'structurePlayback.toggleOn' prop.
   * When 'structurePlayback.toggleOn' is defined, use its value to set 'structurePlayback' in state.
   * Otherwise use Manifest 'behavior' value to set the toggle status.
   */
  useEffect(() => {
    let structurePlayback = false;

    // If 'structurePlayback.toggleOn' is undefined use Manifest's 'behavior' value
    if (toggleState === undefined) {
      structurePlayback = manifest?.behavior ? parseAutoAdvance(manifest.behavior) : false;
      manifestDispatch({ structureOnlyPlayback: structurePlayback, type: 'setStructureOnlyPlayback' });
    } else {
      structurePlayback = toggleState;
      manifestDispatch({ structureOnlyPlayback: toggleState, type: 'setStructureOnlyPlayback' });
    }

    // Initialize 'playbackFromFirstTimespanRef'
    setPlaybackFromFirstRef(!hasResume);
  }, [manifest, toggleState, hasResume]);

  useEffect(() => {
    /* If the user had clicked on a structure item at any time within the current session, clear the
    calculated firstTimespan and clear the structure-only playback notice. */
    if (isClickedRef.current) {
      // Clear the firstTimespan and related structure-only playback notice display
      resetFirstTimespan();
      return;
    }

    /* When 'structurePlayback' and the Canvas has no resume time display the structure notice
    if the firsttimespan has a non-zero start time. */
    if (structureOnlyPlayback && playbackFromFirstTimespanRef.current) {
      const firstTimespan = getFirstStructureTimespanForCanvas();
      if (firstTimespan && firstTimespan.times.start > 0) {
        setShowNotice(true);
        setFirstTimespan(firstTimespan);
      }
    } else {
      // Clear the firstTimespan and related structure-only playback notice display
      resetFirstTimespan();
    }
  }, [canvasIndex, playbackFromFirstTimespanRef.current, structureOnlyPlayback]);

  /* When structure-only playback is ON and no other start times (a saved playback position
  in localStorage or a custom start time either in Manifest or in Ramp props) are declared,
  playback should start at the start time of the first timespan in 'structures' when user
  hits 'play' button. */
  useEffect(() => {
    /* Create a handler per player instance with VideoJS's 'one' method. Since the same instance is
    reused across Canvases and is reset in state on each Canvas change, re-registering the event
    handler overrides the start times set for structure-only playback for each Canvas. */
    if (player && initializedPlayerRef.current !== player) {
      initializedPlayerRef.current = player;
      const onInitialPlay = () => {
        if (playbackFromFirstTimespanRef.current) {
          // Reset the flag and dismiss the notice so that, next 'play' events don't trigger this again
          setPlaybackFromFirstRef(false);
          setShowNotice(false);
          if (firstTimespanRef.current) {
            const { start } = firstTimespanRef.current.times;
            player.currentTime(start);
            playerDispatch({ currentTime: start, type: 'setCurrentTime' });
            manifestDispatch({ item: firstTimespan, type: 'switchItem' });
          }
        }
      };
      onInitialPlayRef.current = onInitialPlay;
      player.one('play', onInitialPlay);

      // Cleanup on unmount
      return () => {
        player.off('play', onInitialPlay);
        if (initializedPlayerRef.current === player) {
          initializedPlayerRef.current = null;
          onInitialPlayRef.current = null;
        }
      };
    }
  }, [player]);

  /* When a structure item is clicked before the player starts from first timespan for
  structure-only playback, skip the initial jump from zero time mark to the first timespan
  and dismiss the structure-only playback notice. */
  useEffect(() => {
    if (isClicked && player && onInitialPlayRef.current) {
      player.off('play', onInitialPlayRef.current);
      resetFirstTimespan();
      // Update local ref to keep track because, 'isClicked' is reset if/when Canvas is changed
      isClickedRef.current = true;
    }
  }, [isClicked, player]);

  /**
   * Callback to handle 'Play from beginning' button click in the structure-only playback notice.
   * This will ignore the first timespan and start playback from zero time mark. Once the next
   * timespan is encountered, the playback will switch over to structure-only playback unless the
   * user turns off structure-only playback in the meantime.
   */
  const onPlayFromBeginning = () => {
    resetFirstTimespan();
    player.play();
  };

  /**
   * Callback to handle 'Turn Off' button click in the structure-only playback notice. This will
   * toggle off the structure-only playback and start playback from the the zero time mark.
   */
  const onTurnOff = () => {
    resetFirstTimespan();
    manifestDispatch({ structureOnlyPlayback: false, type: 'setStructureOnlyPlayback' });
  };

  /**
   * onClick event handler for the structure-only playback toggle button in the UI.
   * When it is toggled OFF, dismiss the structure playback notice and reset its related
   * variables such as 'firstTimespan' and 'playbackFromFirstTimespanRef'.
   * When it is toggled ON, display the structure playback notice depending on the
   * current status of playback.
   */
  const handleChange = useCallback((e) => {
    const temp = !structureOnlyPlayback;
    e.target.setAttribute('aria-checked', String(temp));
    manifestDispatch({ structureOnlyPlayback: temp, type: 'setStructureOnlyPlayback' });
    // Dismiss the notice when structure-playback is turned OFF
    if (!temp) {
      resetFirstTimespan();
    } else {
      /* If playback from first timespan is still turned ON, and the timespan has a non-zero
      start times then, show the notice with first timespan info */
      if (playbackFromFirstTimespanRef.current) {
        const firstTimespan = getFirstStructureTimespanForCanvas();
        if (firstTimespan && firstTimespan.times.start > 0) {
          setShowNotice(true);
          setFirstTimespan(firstTimespan);
        }
      }
    }
  });

  return {
    firstTimespan, handleChange, onPlayFromBeginning, onTurnOff, showNotice,
    showStaticStructNotice, structureOnlyPlayback
  };
};
