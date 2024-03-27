import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { withManifestAndPlayerProvider } from '../../services/testing-helpers';
import MediaPlayer from './MediaPlayer';
import { ErrorBoundary } from 'react-error-boundary';
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

  describe('with a regular audio Manifest', () => {
    beforeEach(() => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: audioManifest, canvasIndex: 0 },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
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

  describe('with a regular video Manifest', () => {
    beforeEach(() => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
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

  test('with a playlist Manifest renders successfully', async () => {
    const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
      initialManifestState: {
        manifest: playlistManifest,
        canvasIndex: 1,
        playlist: { isPlaylist: true }
      },
      initialPlayerState: {},
    });
    await act(async () => render(
      <ErrorBoundary>
        <PlayerWithManifest />
      </ErrorBoundary>
    ));
    expect(screen.queryByTestId('inaccessible-item')).not.toBeInTheDocument();
    expect(
      screen.queryAllByTestId('videojs-video-element').length
    ).toBeGreaterThan(0);
  });

  describe('with props', () => {
    test('enableFileDownload = false', () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
        initialPlayerState: {},
        enableFileDownload: false,
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('videojs-file-download')).not.toBeInTheDocument();
    });

    test('enableFileDownload = true', async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
        initialPlayerState: {},
        enableFileDownload: true,
      });
      await act(async () => render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      ));
      expect(screen.queryByTestId('videojs-file-download')).toBeInTheDocument();
    });
  });

  describe('previous/next section buttons', () => {
    test('does not render with a single Canvas Manifest', () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: audioManifest, canvasIndex: 0 },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('videojs-next-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('videojs-previous-button')).not.toBeInTheDocument();
    });

    test('does not render with a single Canvas with multiple sources', () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: audioManifest, canvasIndex: 0 },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('videojs-next-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('videojs-previous-button')).not.toBeInTheDocument();
    });

    test('renders with a multi-Canvas regualr Manifest', async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
        initialPlayerState: {},
      });
      await act(async () => render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      ));
      expect(screen.queryByTestId('videojs-next-button')).toBeInTheDocument();
      expect(screen.queryByTestId('videojs-previous-button')).toBeInTheDocument();
    });

    test('renders with a multi-Canvas playlist Manifest', async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: {
          manifest: playlistManifest,
          canvasIndex: 1,
          playlist: { isPlaylist: true }
        },
        initialPlayerState: {},
      });
      await act(async () => render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      ));
      expect(screen.queryByTestId('videojs-previous-button')).toBeInTheDocument();
      expect(screen.queryByTestId('videojs-next-button')).toBeInTheDocument();
    });
  });

  describe('track scrubber button', () => {
    test('does not render with a regular Manifest without structure timespans', () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: {
          ...manifestState,
          manifest: audioManifest,
          canvasIndex: 0
        },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('videojs-track-scrubber-button')).not.toBeInTheDocument();
    });

    describe('renders', () => {
      test('with a regular Manifest with structure timespans', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: {
            ...manifestState,
            manifest: videoManifest,
            canvasIndex: 0,
            hasStructure: true
          },
          initialPlayerState: {},
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(screen.queryByTestId('videojs-track-scrubber-button')).toBeInTheDocument();
      });

      test('renders with a playlist Manifest', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: {
            manifest: playlistManifest,
            canvasIndex: 1,
            playlist: { isPlaylist: true }
          },
          initialPlayerState: {},
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(screen.queryByTestId('videojs-track-scrubber-button')).toBeInTheDocument();
      });
    });
  });

  describe('displays inaccessible message', () => {
    test('with HTML from placeholderCanvas for an empty canvas', () => {
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
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('inaccessible-item')).toBeInTheDocument();
      expect(screen.getByTestId('inaccessible-message').textContent)
        .toEqual('You do not have permission to playback this item. \nPlease ' +
          'contact support to report this error: admin-list@example.com.\n');
    });

    test('for an inaccessible item in a playlist Manifest', () => {
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
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('inaccessible-item')).toBeInTheDocument();
      expect(screen.getByText('You do not have permission to playback this item.')).toBeInTheDocument();
    });
  });

  describe.skip('sticky settings', () => {
    let mockLocalStorage = {};

    beforeAll(() => {
      global.Storage.prototype.setItem = jest.fn((key, value) => {
        mockLocalStorage[key] = value;
      });
      global.Storage.prototype.getItem = jest.fn((key) => mockLocalStorage[key]);
    });

    beforeEach(() => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      window.HTMLMediaElement.prototype.load = () => { };
    });

    afterAll(() => {
      global.Storage.prototype.setItem.mockReset();
      global.Storage.prototype.getItem.mockReset();
    });

    test('stores volume into localStorage', () => {
      screen.getAllByTestId('videojs-video-element')[0].player.triggerReady();
      expect(mockLocalStorage['startVolume']).toEqual("1");
      expect(screen.getAllByTestId('videojs-video-element')[0].player.volume()).toEqual(1);
      screen.getAllByTestId('videojs-video-element')[0].player.volume(0.5);
      // Or simulate click on mute button?
      expect(screen.getAllByTestId('videojs-video-element')[0].player.volume()).toEqual(0.5);
      expect(mockLocalStorage['startVolume']).toEqual("0.5");
    });

    test('stores quality into localStorage', () => {
      expect(mockLocalStorage['startQuality']).toEqual('null');
      expect(screen.getAllByTestId('videojs-video-element')[0].player.options()['sources'].find((s) => s['selected'] == true).label).toEqual('auto');
      // Set quality to Medium
      // Or simulate quality click
      expect(screen.getAllByTestId('videojs-video-element')[0].player.options()['sources'].find((s) => s['selected'] == true).label).toEqual('Medium');
      expect(mockLocalStorage['startQuality']).toEqual("Medium");
    });

    describe('Restoring', () => {
      //Override localStorage mocking
      beforeAll(() => {
        mockLocalStorage = { startQuality: 'Medium', startVolume: '0.5' };
      });

      test('restores volume from localStorage', () => {
        waitFor(() => {
          screen.getAllByTestId('videojs-video-element')[0].player.triggerReady();
          expect(screen.getAllByTestId('videojs-video-element')[0].player.volume()).toEqual(0.5);
        });
      });

      test('restores quality from localStorage', () => {
        expect(screen.getAllByTestId('videojs-video-element')[0].player.options()['sources'].find((s) => s['selected'] == true).label).toEqual('Medium');
      });
    });
  });
});
