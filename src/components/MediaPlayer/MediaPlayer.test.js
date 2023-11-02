import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { withManifestAndPlayerProvider } from '../../services/testing-helpers';
import MediaPlayer from './MediaPlayer';
import audioManifest from '@TestData/transcript-canvas';
import videoManifest from '@TestData/lunchroom-manners';
import emptyCanvasManifest from '@TestData/transcript-annotation';
import playlistManifest from '@TestData/playlist';

let manifestState = {
  playlist: { isPlaylist: false, markers: [], isEditing: false }
};
describe('MediaPlayer component', () => {
  let originalError;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

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
      await act(async () => render(<PlayerWithManifest />));
      expect(screen.queryByTestId('videojs-file-download')).toBeInTheDocument();
    });
  });

  describe('with a non-playlist manifest', () => {
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
      test('renders previous/next section buttons', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        await act(async () => render(<PlayerWithManifest />));
        expect(screen.queryByTestId('videojs-next-button')).toBeInTheDocument();
        expect(screen.queryByTestId('videojs-previous-button')).toBeInTheDocument();
      });
    });

    test('renders a message with HTML from placeholderCanvas for empty canvas', () => {
      // Stub loading HTMLMediaElement for jsdom
      window.HTMLMediaElement.prototype.load = () => { };

      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: {
          manifest: emptyCanvasManifest,
          canvasIndex: 1,
          playlist: { isPlaylist: false }
        },
        initialPlayerState: {},
      });
      render(<PlayerWithManifest />);
      expect(screen.queryByTestId('inaccessible-item')).toBeInTheDocument();
      expect(screen.getByTestId('inaccessible-message').textContent)
        .toEqual('You do not have permission to playback this item. \nPlease ' +
          'contact support to report this error: admin-list@example.com.\n');
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

    test('renders player for a accessible Canvas', async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: {
          manifest: playlistManifest,
          canvasIndex: 1,
          playlist: { isPlaylist: true }
        },
        initialPlayerState: {},
      });
      await act(async () => render(<PlayerWithManifest />));
      expect(screen.queryByTestId('inaccessible-item')).not.toBeInTheDocument();
      expect(
        screen.queryAllByTestId('videojs-video-element').length
      ).toBeGreaterThan(0);
      expect(screen.queryByTestId('videojs-previous-button')).toBeInTheDocument();
      expect(screen.queryByTestId('videojs-next-button')).toBeInTheDocument();
    });
  });
});
