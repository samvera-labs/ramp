import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { withManifestAndPlayerProvider, manifestState } from '../../services/testing-helpers';
import MediaPlayer from './MediaPlayer';
import { ErrorBoundary } from 'react-error-boundary';
import audioManifest from '@TestData/transcript-canvas';
import videoManifest from '@TestData/lunchroom-manners';
import noCaptionManifest from '@TestData/multiple-canvas-auto-advance';
import emptyCanvasManifest from '@TestData/transcript-annotation';
import playlistManifest from '@TestData/playlist';
import emptyManifest from '@TestData/empty-manifest';
import * as hooks from '@Services/ramp-hooks';

// Mock the Video.js language loader
jest.mock('@Services/videojs-language-loader', () => ({
  loadVideoJSLanguage: jest.fn(() => Promise.resolve({ 'Play': 'Play', 'Pause': 'Pause' }))
}));

describe('MediaPlayer component', () => {
  let originalError, originalLogger, originalWarn;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
    originalLogger = console.log;
    console.log = jest.fn();
    originalWarn = console.warn;
    console.warn = jest.fn();
    // Mock canPlayType to always return 'maybe' (truthy value)
    // This prevents tests from failing due to unsupported MIME types in test environment
    HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'maybe');
  });

  afterAll(() => {
    console.error = originalError;
    console.log = originalLogger;
    console.warn = originalWarn;
    jest.restoreAllMocks();
  });

  describe('with a regular audio Manifest', () => {
    beforeEach(async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: {
          ...manifestState(audioManifest)
        },
        initialPlayerState: {},
      });
      await act(async () => render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      ));
    });

    test('renders successfully', () => {
      expect(screen.queryByTestId('media-player')).toBeInTheDocument();
    });

    test('reads media type as audio from manifest', () => {
      expect(
        screen.queryAllByTestId('videojs-audio-element').length
      ).toBeGreaterThan(0);
    });
  });

  describe('with a regular video Manifest', () => {
    beforeEach(async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: {
          ...manifestState(videoManifest)
        },
        initialPlayerState: {},
      });
      await act(async () => render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      ));
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('media-player')).toBeInTheDocument();
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
        ...manifestState(playlistManifest, 2, true),
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
          initialManifestState: { ...manifestState(videoManifest) },
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
          initialManifestState: { ...manifestState(videoManifest) },
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
          initialManifestState: { ...manifestState(videoManifest) },
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
          initialManifestState: { ...manifestState(videoManifest) },
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
          initialManifestState: { ...manifestState(videoManifest) },
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
          initialManifestState: { ...manifestState(videoManifest) },
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

    describe('enableTitleLink', () => {
      test('with default value: `false` does not render title bar component', () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(videoManifest) },
          initialPlayerState: {},
          enableTitleLink: false,
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(screen.queryByTestId('videojs-title-link')).not.toBeInTheDocument();
      });

      test('set to `true` renders title bar component', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(videoManifest) },
          initialPlayerState: {},
          enableTitleLink: true,
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(screen.queryByTestId('videojs-title-link')).toBeInTheDocument();
      });
    });
  });

  describe('withCredentials', () => {
    test('with the default value: `false` does not include withCredentials on sources', async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState(videoManifest) },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      await waitFor(() => {
        screen.getAllByTestId('videojs-video-element')[0].player;
      });
      const player = screen.getAllByTestId('videojs-video-element')[0].player;
      const { sources } = player.options();
      expect(sources.every(({ withCredentials }) => !withCredentials)).toBe(true);
    });

    test('with the explicit value: `false` does not include withCredentials on sources', async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState(videoManifest) },
        initialPlayerState: {},
        withCredentials: false,
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      await waitFor(() => {
        screen.getAllByTestId('videojs-video-element')[0].player;
      });
      const player = screen.getAllByTestId('videojs-video-element')[0].player;
      const { sources } = player.options();
      expect(sources.every(({ withCredentials }) => !withCredentials)).toBe(true);
    });

    test('with the explicit value: `true` includes withCredentials on all sources', async () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState(videoManifest) },
        initialPlayerState: {},
        withCredentials: true,
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      await waitFor(() => {
        screen.getAllByTestId('videojs-video-element')[0].player;
      });
      const player = screen.getAllByTestId('videojs-video-element')[0].player;
      const { sources } = player.options();
      expect(sources.every(({ withCredentials }) => withCredentials)).toBe(true);
    });
  });

  describe('previous/next section buttons in the control bar', () => {
    describe('renders', () => {
      test('with a multi-Canvas regualr Manifest', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(videoManifest) },
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
          initialManifestState: { ...manifestState(playlistManifest, 2, true) },
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
          initialManifestState: { ...manifestState(audioManifest) },
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
          initialManifestState: { ...manifestState(audioManifest) },
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

  describe('captions button in the control bar', () => {
    describe('renders', () => {
      test('with a video canvas with supplementing annotations', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(videoManifest) },
          initialPlayerState: {},
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0);
        await waitFor(() => {
          expect(screen.queryByTitle('Captions')).toBeInTheDocument();
        });
      });

      test('with a video canvas with supplementing annotations in playlist context', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(playlistManifest, 4, true) },
          initialPlayerState: {},
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
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
          initialManifestState: { ...manifestState(audioManifest) },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(screen.queryByTitle('Captions')).not.toBeInTheDocument();
      });

      test('with a video canvas w/o supplementing annotations', async () => {
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(noCaptionManifest) },
          initialPlayerState: {},
        });
        await act(async () => render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        ));
        expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0);
        expect(screen.queryByTitle('Captions')).not.toBeInTheDocument();
      });
    });
  });

  describe('track scrubber button in the control bar', () => {
    test('does not render with a regular Manifest without structure timespans', () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState(audioManifest) },
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
          initialManifestState: { ...manifestState(videoManifest), structures: { hasStructure: true } },
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
          initialManifestState: { ...manifestState(playlistManifest, 2, true) },
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
    const mockHooks = () => {
      jest.spyOn(hooks, 'useMediaPlayer').mockImplementation(() => ({
        canvasIsEmpty: true,
        canvasIndex: 1,
        lastCanvasIndex: 5
      }));
      const switchPlayerMock = jest.fn();
      jest.spyOn(hooks, 'useSetupPlayer').mockImplementation(() => ({
        switchPlayer: switchPlayerMock,
        playerConfig: {
          error: 'You do not have permission to playback this item.',
          sources: [], tracks: [], poster: null, targets: []
        },
        ready: true,
        isVideo: false
      }));
      return switchPlayerMock;
    };

    test('for empty Manifest', () => {
      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState(emptyManifest) },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('inaccessible-message-display')).toBeInTheDocument();
      expect(screen.getByTestId('inaccessible-message-content').textContent)
        .toEqual('No media resource(s). Please check your Manifest.');
      expect(screen.queryByTestId('inaccessible-message-buttons')).not.toBeInTheDocument();
    });

    test('with HTML from placeholderCanvas for an empty canvas', () => {
      // Stub loading HTMLMediaElement for jsdom
      window.HTMLMediaElement.prototype.load = () => { };

      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState(emptyCanvasManifest, 1) },
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
        initialManifestState: { ...manifestState(playlistManifest, 0, true) },
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
      test('displays timer and next button for first item', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(playlistManifest, 0, true), autoAdvance: true, },
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

      test('displays timer and previous/next button for an inaccessible item nested between other item', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(playlistManifest, 1, true), autoAdvance: true, },
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
        expect(screen.queryByTestId('inaccessible-previous-button')).toBeInTheDocument();
      });

      test('displays timer and previous button when last item is an inaccessible item', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(playlistManifest, 5, true), autoAdvance: true, },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <PlayerWithManifest />
          </ErrorBoundary>
        );
        expect(screen.queryByTestId('inaccessible-message-display')).toBeInTheDocument();
        expect(screen.getByText('You do not have permission to playback this item.')).toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-message-timer')).not.toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-next-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('inaccessible-previous-button')).toBeInTheDocument();
      });

      test('enables navigation to next item with next button', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };
        const switchPlayerMock = mockHooks();

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(playlistManifest, 1, true), autoAdvance: true, },
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
        expect(switchPlayerMock).toHaveBeenCalledTimes(1);
        // Loads video player for the next item in the list
        waitFor(() => expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0));
      });
    });

    describe('with auto-advance turned off', () => {
      test('hides the display timer', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(playlistManifest, 0, true), autoAdvance: false, },
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
        expect(screen.getByTestId('inaccessible-message-timer')).toHaveClass('hidden');
        expect(screen.queryByTestId('inaccessible-next-button')).toBeInTheDocument();
      });

      test('enables navigation to next item with next button', () => {
        // Stub loading HTMLMediaElement for jsdom
        window.HTMLMediaElement.prototype.load = () => { };

        const switchPlayerMock = mockHooks();
        const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
          initialManifestState: { ...manifestState(playlistManifest, 1, true), autoAdvance: false, },
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
        expect(screen.getByTestId('inaccessible-message-timer')).toHaveClass('hidden');
        expect(screen.queryByTestId('inaccessible-next-button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('inaccessible-next-button'));
        expect(switchPlayerMock).toHaveBeenCalledTimes(1);
        // Loads video player for the next item in the list
        waitFor(() => expect(
          screen.queryAllByTestId('videojs-video-element').length
        ).toBeGreaterThan(0));
      });
    });
  });

  describe('sticky settings', () => {
    let mockLocalStorage = {};

    beforeAll(() => {
      global.Storage.prototype.setItem = jest.fn((key, value) => {
        mockLocalStorage[key] = value;
      });
      global.Storage.prototype.getItem = jest.fn((key) => mockLocalStorage[key]);
    });

    beforeEach(async () => {
      jest.clearAllMocks();

      const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
        initialManifestState: { ...manifestState(videoManifest) },
        initialPlayerState: {},
      });

      render(
        <ErrorBoundary>
          <PlayerWithManifest />
        </ErrorBoundary>
      );

      // Stub loading HTMLMediaElement for jsdom
      window.HTMLMediaElement.prototype.load = () => { };

      // Wrap in act(...) for consistent state updates in state providers
      await act(() => Promise.resolve());
    });

    afterAll(() => {
      global.Storage.prototype.setItem.mockReset();
      global.Storage.prototype.getItem.mockReset();
    });

    test('stores volume into localStorage', async () => {
      waitFor(() => {
        const player = screen.getAllByTestId('videojs-video-element')[0].player;
        player.triggerReady();

        // state on initial load
        expect(mockLocalStorage['startVolume']).toEqual("1");
        expect(player.volume()).toEqual(1);

        // set volume in player
        player.volume(0.5);

        expect(player.volume()).toEqual(0.5);
        expect(mockLocalStorage['startVolume']).toEqual("0.5");
      });
    });

    test('stores muted into localStorage', () => {
      waitFor(() => {
        const player = screen.getAllByTestId('videojs-video-element')[0].player;
        player.triggerReady();

        // initial state on load
        expect(mockLocalStorage['startMuted']).toEqual('false');
        expect(player.muted()).toBeFalsy();

        // simulate click mute button
        expect(screen.queryByTitle('Mute')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Mute'));

        expect(mockLocalStorage['startMuted']).toEqual('true');
        expect(player.muted()).toBeTruthy();
      });
    });

    test('stores quality into localStorage', async () => {
      waitFor(() => {
        const player = screen.getAllByTestId('videojs-video-element')[0].player;
        player.triggerReady();

        // state on initial load
        expect(mockLocalStorage['startQuality']).toEqual('null');
        expect(
          player.options()['sources']
            .find((s) => s['selected'] === true).label
        ).toEqual('auto');

        // simulate quality selecttion to 'Medium'
        expect(screen.queryByTitle('Open quality selector menu')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Open quality selector menu'));

        expect(screen.queryAllByRole('menuitemradio').length).toEqual(4);
        expect(screen.queryAllByRole('menuitemradio')[2].childNodes[1].textContent)
          .toEqual('Medium');
        fireEvent.click(screen.queryAllByRole('menuitemradio')[2]);

        expect(mockLocalStorage['startQuality']).toEqual("Medium");
        expect(player.options()['sources']
          .find((s) => s['selected'] == true).label
        ).toEqual('Medium');
        expect(player.src()).toEqual(
          'https://example.com/manifest/medium/lunchroom_manners_512kb.mp4'
        );
      });
    });

    test('stores caption status into localStorage', async () => {
      waitFor(() => {
        const player = screen.getAllByTestId('videojs-video-element')[0].player;
        player.triggerReady();

        expect(screen.queryByTitle('Captions')).toBeInTheDocument();
        const captionsButton = screen.getByTitle('Captions');

        // state on initial load
        expect(mockLocalStorage['startCaptioned']).toEqual('true');
        expect(captionsButton).toHaveClass('captions-on');

        // simulate captions off
        fireEvent.click(captionsButton);
        expect(screen.queryAllByRole('menuitemradio').length).toBeGreaterThan(1);
        expect(screen.queryAllByRole('menuitemradio')[1].childNodes[1].textContent)
          .toEqual('captions off');

        expect(mockLocalStorage['startCaptioned']).toEqual("false");
        expect(captionsButton).not.toHaveClass('captions-on');
      });
    });

    describe('Restoring', () => {
      //Override localStorage mocking
      beforeAll(() => {
        mockLocalStorage = {
          startQuality: 'Medium',
          startVolume: '0.5',
          startMuted: true,
          startCaptioned: false,
        };
      });

      test('restores volume from localStorage', async () => {
        waitFor(() => {
          const player = screen.getAllByTestId('videojs-video-element')[0].player;
          player.triggerReady();

          expect(player.volume()).toEqual(0.5);
        });
      });

      test('restores quality from localStorage', async () => {
        waitFor(() => {
          const player = screen.getAllByTestId('videojs-video-element')[0].player;
          player.triggerReady();

          expect(player.options()['sources']
            .find((s) => s['selected'] == true).label
          ).toEqual('Medium');
          expect(player.src()).toEqual(
            'https://example.com/manifest/medium/lunchroom_manners_512kb.mp4'
          );
        });
      });

      test('restores mute from localStorage', async () => {
        waitFor(() => {
          const player = screen.getAllByTestId('videojs-video-element')[0].player;
          player.triggerReady();

          expect(player.muted()).toBeTruthy();
        });
      });

      test('restores captions status from localStorage', async () => {
        waitFor(() => {
          const player = screen.getAllByTestId('videojs-video-element')[0].player;
          player.triggerReady();

          expect(screen.queryByTitle('Captions')).toBeInTheDocument();
          expect(screen.getByTitle('Captions')).not.toHaveClass('captions-on');
        });
      });
    });
  });
});
