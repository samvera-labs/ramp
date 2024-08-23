import React from 'react';
import { PlayerDispatchContext } from '../context/player-context';
import { ManifestStateContext } from '../context/manifest-context';
import { autoScroll, checkSrcRange, getMediaFragment } from '@Services/utility-helpers';

export function useActiveStructure({
  itemIdRef,
  liRef,
  sectionRef,
  structureContainerRef,
  isCanvas,
  canvasDuration,
}) {
  const playerDispatch = React.useContext(PlayerDispatchContext);
  const manifestState = React.useContext(ManifestStateContext);
  const { canvasIndex, currentNavItem, playlist } = manifestState;
  const { isPlaylist } = playlist;

  const isActive = React.useMemo(() => {
    return (itemIdRef.current != undefined && (currentNavItem?.id === itemIdRef.current)
      && (isPlaylist || !isCanvas) && currentNavItem?.canvasIndex === canvasIndex + 1)
      ? ' active'
      : '';
  }, [currentNavItem, canvasIndex]);

  const handleClick = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const { start, end } = getMediaFragment(itemIdRef.current, canvasDuration);
    const inRange = checkSrcRange({ start, end }, { end: canvasDuration });
    /* 
      Only continue the click action if not both start and end times of 
      the timespan are not outside Canvas' duration
    */
    if (inRange) {
      playerDispatch({ clickedUrl: itemIdRef.current, type: 'navClick' });
      liRef.current.isClicked = true;
      if (sectionRef.current) {
        sectionRef.current.isClicked = true;
      }
    }
  });

  React.useEffect(() => {
    /*
      Auto-scroll active structure item into view only when user is not actively
      interacting with structured navigation
    */
    if (liRef.current && currentNavItem?.id == itemIdRef.current
      && liRef.current.isClicked != undefined && !liRef.current.isClicked
      && structureContainerRef.current.isScrolling != undefined && !structureContainerRef.current.isScrolling) {
      autoScroll(liRef.current, structureContainerRef);
    }
    // Reset isClicked if active structure item is set
    if (liRef.current) {
      liRef.current.isClicked = false;
    }
  }, [currentNavItem]);

  return { handleClick, isActive, isPlaylist, canvasIndex };
};
