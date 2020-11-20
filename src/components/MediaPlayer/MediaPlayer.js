import React, { useEffect, useState } from 'react';
import MediaElement from '@Components/MediaPlayer/MediaElement';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { getMediaInfo, getTracks, getStartTime } from '@Services/iiif-parser';
import { useManifestState } from '../../context/manifest-context';

const MediaPlayer = () => {
  const manifestState = useManifestState();
  const [ready, setReady] = useState(false);
  const [sources, setSources] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [mediaType, setMediaType] = useState('audio');
  const [startTime, setStartTime] = useState();
  const [error, setError] = useState(null);

  const { canvasIndex, manifest } = manifestState;

  useEffect(() => {
    if (manifest) {
      const { sources, mediaType, error } = getMediaInfo({
        manifest,
        canvasIndex,
      });
      setTracks(getTracks({ manifest }));
      setSources(sources);
      setMediaType(mediaType);
      setError(error);
      setStartTime(manifest.start ? getStartTime(manifest) : null);
      error ? setReady(false) : setReady(true);
    }
  }, [manifest]); // Re-run the effect when manifest changes

  if (error) {
    return <ErrorMessage message={error} />;
  }

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
        isVideo={mediaType === 'video'}
        initStartTime={startTime}
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
