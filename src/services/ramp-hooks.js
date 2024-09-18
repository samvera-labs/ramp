/**
 * This module contains custom hooks used in Ramp components as
 * needed to listen and update the UI based on the global state
 * in the contexts.
 * This enables to control re-renders in each componet by only
 * relying on parts of the global state which are applicable to
 * them.
 */
import { useMemo, useContext, useCallback, useRef } from 'react';
import { ManifestStateContext } from '../context/manifest-context';
import { PlayerStateContext } from '../context/player-context';
import { PlayerDispatchContext } from '../context/player-context';
import { checkSrcRange, getMediaFragment } from '@Services/utility-helpers';

/**
 * Disable each marker when one of the markers in the table
 * is being edited reading isEditing value from global
 * state
 * @returns { isDisabled: Boolean }
 */
export const useMarkers = () => {
  const manifestState = useContext(ManifestStateContext);
  const { isEditing } = manifestState.playlist;

  const isDisabled = useMemo(() => {
    return isEditing;
  }, [isEditing]);

  return { isDisabled };
};

/**
 * Read player and related updates as player is changed in
 * global state
 * @returns { getCurrentTime: func, player: object }
 */
export const usePlayer = () => {
  const playerState = useContext(PlayerStateContext);
  let player;
  if (playerState) {
    player = playerState.player;
  }

  const playerRef = useRef();
  playerRef.current = useMemo(() => { return player; }, [player]);

  const getCurrentTime = useCallback(() => {
    if (playerRef.current) {
      return playerRef.current.currentTime();
    } else {
      return 0;
    }
  }, [playerRef.current]);

  return { getCurrentTime, player: playerRef.current };
};

/**
 * Handle global state updates and local state updates for structured
 * navigation related components based on the user interactions and
 * player status updates
 * @param {Object} obj
 * @param {Number} obj.itemIndex
 * @param {Boolean} obj.isRoot 
 * @param {String} obj.itemId URL of the struct item
 * @param {Object} obj.liRef React ref for li element for struct item
 * @param {Object} obj.sectionRef React ref for collapsible ul element
 * @param {Boolean} obj.isCanvas
 * @param {Number} obj.canvasDuration
 * @param {Function} obj.setIsOpen
 * @returns 
 */
export const useActiveStructure = ({
  itemIndex,
  isRoot,
  itemId,
  liRef,
  sectionRef,
  isCanvas,
  canvasDuration,
  setIsOpen,
}) => {
  const playerDispatch = useContext(PlayerDispatchContext);
  const manifestState = useContext(ManifestStateContext);
  const { canvasIndex, currentNavItem, playlist } = manifestState;
  const { isPlaylist } = playlist;

  const isActiveLi = useMemo(() => {
    return (itemId != undefined && (currentNavItem?.id === itemId)
      && (isPlaylist || !isCanvas) && currentNavItem?.canvasIndex === canvasIndex + 1)
      ? true : false;
  }, [currentNavItem, canvasIndex]);

  const isActiveSection = useMemo(() => {
    const isCurrentSection = canvasIndex + 1 === itemIndex;
    // Do not mark root range as active
    if (isCurrentSection && !isRoot) {
      // Collapse the section in structured navigation
      setIsOpen(true);
      return true;
    } else {
      return false;
    }
  }, [canvasIndex]);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const { start, end } = getMediaFragment(itemId, canvasDuration);
    const inRange = checkSrcRange({ start, end }, { end: canvasDuration });
    /* 
      Only continue the click action if not both start and end times of 
      the timespan are not outside Canvas' duration
    */
    if (inRange) {
      playerDispatch({ clickedUrl: itemId, type: 'navClick' });
      liRef.current.isClicked = true;
      if (sectionRef.current) {
        sectionRef.current.isClicked = true;
      }
    }
  });

  return { isActiveSection, isActiveLi, handleClick, canvasIndex, currentNavItem, isPlaylist };
};
