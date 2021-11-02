import React from 'react';
import { render, screen } from '@testing-library/react';
import { withManifestAndPlayerProvider } from '../../services/testing-helpers';
import MediaPlayer from './MediaPlayer';
import audioManifest from '@Json/test_data/mahler-symphony-audio';
import videoManifest from '@Json/test_data/mahler-symphony-video';

describe('MediaPlayer component', () => {
  describe('with audio manifest', () => {
    beforeEach(() => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { manifest: audioManifest, canvasIndex: 0 },
        initialPlayerState: {},
      });
      render(<PlayerWithManifest />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('media-player'));
    });

    test('reads media type as audio from manifest', () => {
      expect(
        screen.queryAllByTestId('videojs-audio-element').length
      ).toBeGreaterThan(0);
    });
  });

  describe('with video manifest', () => {
    beforeEach(() => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { manifest: videoManifest, canvasIndex: 0 },
        initialPlayerState: {},
      });
      render(<PlayerWithManifest />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('media-player'));
    });

    test('reads media type as video from manifest', () => {
      expect(
        screen.queryAllByTestId('videojs-video-element').length
      ).toBeGreaterThan(0);
    });
  });
});
