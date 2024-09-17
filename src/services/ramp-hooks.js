import { useMemo, useContext, useCallback, useEffect, useRef } from 'react';
import { ManifestStateContext } from '../context/manifest-context';
import { PlayerStateContext } from '../context/player-context';

export const useMarkers = () => {
  const manifestState = useContext(ManifestStateContext);
  const { isEditing } = manifestState.playlist;

  const isDisabled = useMemo(() => {
    return isEditing;
  }, [isEditing]);

  return { isDisabled };
};

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
