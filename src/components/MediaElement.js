import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import hlsjs from 'hls.js';
import { usePlayerDispatch, usePlayerState } from '../context/player-context';
import 'mediaelement';
import '../mediaelement/javascript/plugins/mejs-quality.js';

// Import stylesheets
import '../mediaelement/stylesheets/mediaelementplayer.css';
import '../mediaelement/stylesheets/plugins/mejs-quality.scss';
import '../mediaelement/stylesheets/mejs-iiif-player-styles.scss';

import {
  createSourceTags,
  createTrackTags,
} from '@Services/mejs-utility-helper';

const MediaElement = ({
  controls,
  height,
  id,
  mediaType,
  options,
  poster,
  preload,
  sources,
  tracks,
  width,
}) => {
  const dispatch = usePlayerDispatch();

  const success = (media, node, instance) => {
    console.log('Loaded successfully');

    const player = { media, node, instance };
    console.log('player', player);

    //dispatch({ player: instance, type: 'updatePlayer' });

    // Register ended event
    media.addEventListener('ended', (ended) => {
      if (ended) {
        handleEnded(player);
      }
    });

    // Register caption change event
    media.addEventListener('captionschange', (captions) => {
      console.log('captionschange', captions);
    });

    media.addEventListener('play', () => {
      console.log('play event fires');
    });

    media.addEventListener('pause', () => {
      console.log('pause event fires');
    });
  };

  const error = (media) => {
    console.log('Error loading');
  };

  useEffect(() => {
    const { MediaElementPlayer } = global;

    if (!MediaElementPlayer) {
      return;
    }

    /**
     * Create the configuration object for MediaElement.js player
     */
    const meConfigs = Object.assign({}, JSON.parse(options), {
      pluginPath: './static/media/',
      success: (media, node, instance) => success(media, node, instance),
      error: (media, node) => error(media, node),
      features: [
        'playpause',
        'current',
        'progress',
        'duration',
        'volume',
        'quality',
        mediaType === 'video' ? 'tracks' : '',
        'fullscreen',
      ],
      qualityText: 'Stream Quality',
      toggleCaptionsButtonWhenOnlyOne: true,
    });

    window.Hls = hlsjs;

    dispatch({
      player: new MediaElementPlayer(id, meConfigs),
      type: 'updatePlayer',
    });
  }, []);

  const sourceTags = createSourceTags(JSON.parse(sources));
  const tracksTags = createTrackTags(JSON.parse(tracks));

  const mediaBody = `${sourceTags.join('\n')} ${tracksTags.join('\n')}`;
  const mediaHtml =
    mediaType === 'video'
      ? `<video data-testid="video-element" id="${id}" width="${width}" height="${height}"${
          poster ? ` poster=${poster}` : ''
        }
          ${controls ? ' controls' : ''}${
          preload ? ` preload="${preload}"` : ''
        }>
        ${mediaBody}
      </video>`
      : `<audio data-testid="audio-element" id="${id}" width="${width}" ${
          controls ? ' controls' : ''
        }${preload ? ` preload="${preload}"` : ''}>
        ${mediaBody}
      </audio>`;

  return <div dangerouslySetInnerHTML={{ __html: mediaHtml }} />;
};

MediaElement.propTypes = {
  crossorigin: PropTypes.string,
  height: PropTypes.number,
  id: PropTypes.string,
  mediaType: PropTypes.string,
  options: PropTypes.string,
  poster: PropTypes.string,
  preload: PropTypes.string,
  sources: PropTypes.string,
  tracks: PropTypes.string,
  width: PropTypes.number,
};

export default MediaElement;
