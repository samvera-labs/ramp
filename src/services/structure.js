import React, { useCallback, useMemo } from 'react';
import { PlayerDispatchContext } from '../context/player-context';
import { ManifestStateContext } from '../context/manifest-context';
import { autoScroll, checkSrcRange, getMediaFragment } from '@Services/utility-helpers';

export const useActiveStructure = ({
  itemIdRef,
  liRef,
  sectionRef,
  structureContainerRef,
  isCanvas,
  canvasDuration,
}) => {
  const playerDispatch = React.useContext(PlayerDispatchContext);
  const manifestState = React.useContext(ManifestStateContext);
  const { canvasIndex, currentNavItem, playlist } = manifestState;
  const { isPlaylist } = playlist;

  const scrollItem = useCallback(() => {
    // console.log(liRef.current, currentNavItem?.id, itemIdRef.current, !liRef.current?.isClicked, !structureContainerRef.current.isScrolling);
    if (liRef.current && currentNavItem?.id == itemIdRef.current
      && !liRef.current?.isClicked
      && !structureContainerRef.current.isScrolling) {
      console.log('AUTO SCROLLING: ', itemIdRef.current);
      autoScroll(liRef.current, structureContainerRef);
    }

    // Reset isClicked if active structure item is set
    if (liRef.current) {
      liRef.current.isClicked = false;
    }
  }, [liRef.current, currentNavItem]);

  const isActive = React.useMemo(() => {
    scrollItem();
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
  return { handleClick, isActive };
};

export const useActiveSection = ({ itemIndex }) => {
  const manifestState = React.useContext(ManifestStateContext);
  const { canvasIndex } = manifestState;

  const isActive = useMemo(() => {
    return canvasIndex + 1 === itemIndex
      ? ' active'
      : '';
  }, [canvasIndex]);

  return { isActive };
};
