import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { withManifestAndPlayerProvider } from '../../services/testing-helpers';
import MediaPlayer from './MediaPlayer';
import audioManifest from '@TestData/transcript-canvas';
import videoManifest from '@TestData/lunchroom-manners';
import playlistManifest from '@TestData/playlist';

let manifestState = {
  playlist: { isPlaylist: false, markers: [], isEditing: false }
};
describe('MediaPlayer component', () => {
  describe('with audio manifest', () => {
    beforeEach(() => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: audioManifest, canvasIndex: 0 },
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
        initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
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

  describe('with props', () => {
    test('enableFileDownload = false', () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
        initialPlayerState: {},
        enableFileDownload: false,
      });
      render(<PlayerWithManifest />);
      expect(screen.queryByTestId('videojs-file-download')).not.toBeInTheDocument();
    });

    test('enableFileDownload = true', async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
        initialPlayerState: {},
        enableFileDownload: true,
      });
      render(<PlayerWithManifest />);
      expect(screen.queryByTestId('videojs-file-download')).toBeInTheDocument();
    });
  });

  describe('with a manifest', () => {
    describe('with a single canvas', () => {
      test('does not render previous/next section buttons', () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: audioManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        render(<PlayerWithManifest />);
        expect(screen.queryByTestId('videojs-next-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('videojs-previous-button')).not.toBeInTheDocument();
      });

      test('with multiple sources does not render previous/next buttons', () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: audioManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        render(<PlayerWithManifest />);
        expect(screen.queryByTestId('videojs-next-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('videojs-previous-button')).not.toBeInTheDocument();
      });
    });

    describe('with multiple canvases', () => {
      test('renders previous/next section buttons', () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        render(<PlayerWithManifest />);
        expect(screen.queryByTestId('videojs-next-button')).toBeInTheDocument();
        expect(screen.queryByTestId('videojs-previous-button')).toBeInTheDocument();
      });
    });
  });

  describe('with a playlist manifest', () => {
    test('renders a message for an inaccessible Canvas', () => {
      // Stub loading HTMLMediaElement for jsdom
      window.HTMLMediaElement.prototype.load = () => { };

      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: {
          manifest: playlistManifest,
          canvasIndex: 0,
          playlist: { isPlaylist: true }
        },
        initialPlayerState: {},
      });
      render(<PlayerWithManifest />);
      expect(screen.queryByTestId('inaccessible-item')).toBeInTheDocument();
      expect(screen.getByText('You do not have permission to playback this item.')).toBeInTheDocument();
    });

    test('renders player for a accessible Canvas', () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: {
          manifest: playlistManifest,
          canvasIndex: 1,
          playlist: { isPlaylist: true }
        },
        initialPlayerState: {},
      });
      render(<PlayerWithManifest />);
      expect(screen.queryByTestId('inaccessible-item')).not.toBeInTheDocument();
      expect(
        screen.queryAllByTestId('videojs-video-element').length
      ).toBeGreaterThan(0);
      expect(screen.queryByTestId('videojs-previous-button')).toBeInTheDocument();
      expect(screen.queryByTestId('videojs-next-button')).toBeInTheDocument();
    });
  });
});
