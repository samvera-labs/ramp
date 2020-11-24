import React, { useEffect, useState } from 'react';
import MediaElement from '@Components/MediaPlayer/MediaElement';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { getMediaInfo, getTracks, getStartTime } from '@Services/iiif-parser';
import { useManifestState } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';
import { getDuration } from '@Services/iiif-parser';

const MediaPlayer = () => {
  const manifestState = useManifestState();
  const playerState = usePlayerState();

  const [ready, setReady] = useState(false);
  const [sources, setSources] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [sourceType, setSourceType] = useState('audio');
  const [error, setError] = useState(null);
  const [cIndex, setCIndex] = useState(canvasIndex);

  const { canvasIndex, manifest } = manifestState;
  const { isClicked, isPlaying, player, startTime } = playerState;

  useEffect(() => {
    if (manifest) {
      initCanvas(canvasIndex);
    }
  }, [manifest, canvasIndex]); // Re-run the effect when manifest changes

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const initCanvas = (canvasId) => {
    const { sources, mediaType, error } = getMediaInfo({
      manifest,
      canvasIndex: canvasId,
    });
    setTracks(getTracks({ manifest }));
    setSources(sources);
    setSourceType(mediaType);
    setError(error);
    setCIndex(canvasId);
    error ? setReady(false) : setReady(true);
    return { mediaType, sources };
  };

  const switchPlayer = (oldPlayer) => {
    switchPlayerHelper(oldPlayer, canvasIndex);

    if (isPlaying) {
      player.play();
    }
  };

  const handleEnded = (oldPlayer) => {
    switchPlayerHelper(oldPlayer, canvasIndex + 1);
    player.play();
  };

  const switchPlayerHelper = (oldPlayer, canvasId) => {
    const { sources, mediaType } = initCanvas(canvasId);
    if (mediaType !== sourceType) {
      oldPlayer.reset();
    } else {
      player.src(sources);

      // Update player duration
      const duration = getDuration(manifest, canvasIndex);
      player.duration(duration);

      player.load();
    }
  };

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    controlBar: {
      // Define and order control bar controls
      // See https://docs.videojs.com/tutorial-components.html for options of what
      // seem to be supported controls
      /**
       children: [
        'playToggle',
        'volumePanel',
        'progressControl',
        'remainingTimeDisplay',
        'fullscreenToggle',
      ],
      */
      // Options for controls
      // volumePanel: {
      //   inline: false,
      // },
    },
    width: 800,
    height: 500,
    sources,
  };

  return ready ? (
    <div data-testid="media-player">
      <VideoJSPlayer
        isVideo={sourceType === 'video'}
        switchPlayer={switchPlayer}
        handleIsEnded={handleEnded}
        {...videoJsOptions}
      />
    </div>
  ) : // <div data-testid="media-player" id="media-player">
  //   <MediaElement
  //     controls
  //     crossorigin="anonymous"
  //     height={manifest.height || 360}
  //     id="avln-mediaelement-component"
  //     mediaType={mediaType}
  //     options={JSON.stringify({})}
  //     poster=""
  //     preload="auto"
  //     sources={JSON.stringify(sources)}
  //     tracks={JSON.stringify(tracks)}
  //     width={manifest.width || 480}
  //     startTime={startTime}
  //   />
  // </div>
  null;
};

MediaPlayer.propTypes = {};

export default MediaPlayer;
