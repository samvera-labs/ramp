import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { withManifestAndPlayerProvider } from '../../services/testing-helpers';
import MediaPlayer from './MediaPlayer';
import { ErrorBoundary } from 'react-error-boundary';
import audioManifest from '@TestData/transcript-canvas';
import videoManifest from '@TestData/lunchroom-manners';
import noCaptionManifest from '@TestData/multiple-canvas-auto-advance';
import emptyCanvasManifest from '@TestData/transcript-annotation';
import playlistManifest from '@TestData/playlist';

let manifestState = {
  playlist: { isPlaylist: false, markers: [], isEditing: false }
};
describe('MediaPlayer component', () => {
  let originalError, originalLogger;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
    originalLogger = console.log;
    console.log = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.log = originalLogger;
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
    expect(screen.queryByTestId('inaccessible-message-display')).not.toBeInTheDocument();
    expect(
      screen.queryAllByTestId('videojs-video-element').length
    ).toBeGreaterThan(0);
  });

  describe('with props', () => {
    describe('enableFileDownload', () => {
      test('with default value: `false` does not render file download icon', () => {
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

      test('set to `true` renders file download icon', async () => {
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

    describe('enablePIP', () => {
      test('with default value: `false` does not render pip icon', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(screen.queryByTitle('Picture-in-Picture')).not.toBeInTheDocument();
      });
      test('set to `true` renders pip icon', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
          initialPlayerState: {},
          enablePIP: true,
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(screen.queryByTitle('Picture-in-Picture')).toBeInTheDocument();
      });
    });

    describe('enablePlaybackRate', () => {
      test('with default value: `false` does not render playback rate icon', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(screen.queryByTitle('Playback Rate')).not.toBeInTheDocument();
      });
      test('set to `true` renders playback rate icon', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
          initialPlayerState: {},
          enablePlaybackRate: true,
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(screen.queryByTitle('Playback Rate')).toBeInTheDocument();
      });
    });
  });

  describe('previous/next section buttons', () => {
    describe('renders', () => {
      test('with a multi-Canvas regualr Manifest', async () => {
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

      test('with a multi-Canvas playlist Manifest', async () => {
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

    describe('does not render', () => {
      test('with a single Canvas Manifest', () => {
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

      test('with a single Canvas with multiple sources', () => {
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

    });
  });

  describe('captions button', () => {
    describe('renders', () => {
      test('with a video canvas with supplementing annotations', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: videoManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0);
        await waitFor(() => {
          expect(screen.queryByTitle('Captions')).toBeInTheDocument();
        });
      });

      test('with a video canvas with supplementing annotations in playlist context', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: playlistManifest, canvasIndex: 3 },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0);
        await waitFor(() => {
          expect(screen.queryByTitle('Captions')).toBeInTheDocument();
        });
      });
    });

    describe('does not render', () => {
      test('with an audio canvas', () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: audioManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(screen.queryByTitle('Captions')).not.toBeInTheDocument();
      });

      test('with a video canvas w/o supplementing annotations', () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState, manifest: noCaptionManifest, canvasIndex: 0 },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0);
        expect(screen.queryByTitle('Captions')).not.toBeInTheDocument();
      });
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
      expect(screen.queryByTestId('inaccessible-message-display')).toBeInTheDocument();
      expect(screen.getByTestId('inaccessible-message-content').textContent)
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
      expect(screen.queryByTestId('inaccessible-message-display')).toBeInTheDocument();
      expect(screen.getByText('You do not have permission to playback this item.')).toBeInTheDocument();
    });

    describe('with auto-advance turned on', () => {
      test('displays timer and previous/next buttons', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: {
            manifest: playlistManifest,
            canvasIndex: 0,
            playlist: { isPlaylist: true },
            autoAdvance: true,
          },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(screen.queryByTestId('inaccessible-message-display')).toBeInTheDocument();
        expect(screen.getByText('You do not have permission to playback this item.')).toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-message-timer')).toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-next-button')).toBeInTheDocument();
        // Does not display previous button for first item
        expect(screen.queryByTestId('inaccessible-previous-button')).not.toBeInTheDocument();
      });

      test('enables navigation to next item with next button', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: {
            manifest: playlistManifest,
            canvasIndex: 0,
            playlist: { isPlaylist: true },
            autoAdvance: true,
          },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(screen.queryByTestId('inaccessible-message-display')).toBeInTheDocument();
        expect(screen.getByText('You do not have permission to playback this item.')).toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-message-timer')).toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-next-button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('inaccessible-next-button'));
        // Loads video player for the next item in the list
        expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0);
      });
    });

    describe('with auto-advance turned off', () => {
      test('dim the display timer', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: {
            manifest: playlistManifest,
            canvasIndex: 0,
            playlist: { isPlaylist: true },
            autoAdvance: false,
          },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(screen.queryByTestId('inaccessible-message-display')).toBeInTheDocument();
        expect(screen.getByText('You do not have permission to playback this item.')).toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-message-timer')).toBeInTheDocument();
        expect(screen.getByTestId('inaccessible-message-timer')).toHaveClass('disabled');
        expect(screen.queryByTestId('inaccessible-next-button')).toBeInTheDocument();
      });

      test('enables navigation to next item with next button', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: {
            manifest: playlistManifest,
            canvasIndex: 0,
            playlist: { isPlaylist: true },
            autoAdvance: false,
          },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(screen.queryByTestId('inaccessible-message-display')).toBeInTheDocument();
        expect(screen.getByText('You do not have permission to playback this item.')).toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-message-timer')).toBeInTheDocument();
        expect(screen.getByTestId('inaccessible-message-timer')).toHaveClass('disabled');
        expect(screen.queryByTestId('inaccessible-next-button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('inaccessible-next-button'));
        // Loads video player for the next item in the list
        expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0);
      });
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
