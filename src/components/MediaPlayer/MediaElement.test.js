import React from 'react';
import { withManifestAndPlayerProvider } from '../../services/testing-helpers';
import MediaElement from './MediaElement';
import { fireEvent, render, screen } from '@testing-library/react';
import manifest from '@Json/mahler-symphony-audio';

describe('MediaElement component', () => {
  const sources = [
    {
      src:
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/medium/480Kbps.mp4',
      format: 'audio/mp4',
      quality: 'medium',
    },
    {
      src:
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/auto/128Kbps.mp4',
      format: 'audio/mp4',
      quality: 'auto',
    },
    {
      src:
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/720Kbps.mp4',
      format: 'audio/mp4',
      quality: 'high',
    },
  ];

  const tracks = [
    {
      id:
        'https://www.iandevlin.com/html5test/webvtt/upc-video-subtitles-en.vtt',
      type: 'Text',
      format: 'application/webvtt',
      label: 'subtitles',
    },
  ];

  const videoProps = {
    id: 'avln-mediaelement-component',
    mediaType: 'video',
    preload: 'auto',
    width: 480,
    height: 360,
    poster: '',
    crossorigin: 'anonymous',
    sources: JSON.stringify(sources),
    tracks: JSON.stringify(tracks),
    options: JSON.stringify({}),
  };

  const audioProps = {
    id: 'avln-mediaelement-component',
    mediaType: 'audio',
    preload: 'auto',
    width: 780,
    height: 200,
    poster: '',
    crossorigin: 'anonymous',
    sources: JSON.stringify(sources),
    tracks: JSON.stringify([]),
    options: JSON.stringify({}),
  };

  describe('Video player', ()=> {
    let containerHash;

    beforeEach(() => {
      const VideoPlayerWithProviders = withManifestAndPlayerProvider(
        MediaElement, {initialManifestState: {manifest, canvasIndex: 0}, initialPlayerState: {}, ...videoProps });
        containerHash = render (<VideoPlayerWithProviders />);
    });
    
    test('renders a video player successfully', () => {
      expect(screen.queryByTestId('video-element'));
      expect(screen.queryByTestId('audio-element')).not;
    });

    test('passes through the correct props', () => {
      const videoElement = screen.queryByTestId('video-element');
      expect(videoElement).toHaveAttribute('height', '360');
      expect(videoElement).toHaveAttribute('width', '480');
      expect(videoElement).toHaveAttribute(
        'id',
        expect.stringContaining(audioProps.id)
      );
    });

    test('renders the correct media source elements', () => {
      expect(screen.queryByTestId('video-element').querySelectorAll('source').length).toEqual(3);
    });

    test('renders captions by default for video player', () => {
      expect(screen.getByTestId('video-element'));

      const captionBtn = containerHash.container.querySelector('.mejs__captions-button');
      expect(captionBtn);
      expect(captionBtn.classList.contains('mejs__captions-enabled'));
    });
  })

  describe('Audio player', ()=> {
    beforeEach(() => {
      const AudioPlayerWithProviders = withManifestAndPlayerProvider(
        MediaElement, {initialManifestState: {manifest, canvasIndex: 0}, initialPlayerState: {}, ...audioProps });
      render (<AudioPlayerWithProviders />);
    })

    test('renders an audio player successfully', () => {
      expect(screen.queryByTestId('audio-element'));
      expect(screen.queryByTestId('video-element')).not;
    });

    test('renders source for the selected quality', () => {
      // auto quality by default
      expect(screen.getByTestId('audio-element').src).toEqual(
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/auto/128Kbps.mp4'
      );

      // simulate quality selection
      fireEvent.click(screen.getByTestId('quality-btn'));
      fireEvent.click(screen.getByTestId('quality-label-high'));

      // selected medium quality
      expect(screen.getByTestId('audio-element').src).toEqual(
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/720Kbps.mp4'
      );
    });

    test('do not render captions for audio player', () => {
      expect(screen.queryByTestId('captions-btn')).not;
    });

    test('renders auto quality by default', () => {
      expect(screen.queryByTestId('audio-element').src).toEqual(
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/auto/128Kbps.mp4'
      );
    });
  })
});
