import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import { withManifestAndPlayerProvider, manifestState } from '@Services/testing-helpers';
import * as authService from '@Services/auth-service';
import videoManifest from '@TestData/lunchroom-manners';
import playlistManifest from '@TestData/playlist';
import singleCanvasManifest from '@TestData/single-canvas';
import authManifest from '@TestData/auth-manifest';
import waveformManifest from '@TestData/waveform-example';

// Mock 'requestLogout' from auth-service module
jest.mock('@Services/auth-service', () => ({
  ...jest.requireActual('@Services/auth-service'),
  requestLogout: jest.fn(),
}));

describe('VideoJSPlayer component', () => {
  const MANIFEST_URL = 'https://example.com/manifest/lunchroom_manners';
  const CANVAS_URL = 'https://example.com/manifest/lunchroom_manners/canvas/1';
  const CANVAS_URL_2 = 'https://example.com/manifest/lunchroom_manners/canvas/2';
  let originalError, originalLogger, originalWarn;
  let playMock;

  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
    originalLogger = console.log;
    console.log = jest.fn();
    originalWarn = console.warn;
    console.warn = jest.fn();

    localStorage.clear();
    // Mock HTMLMediaElement methods used by Video.js to prevent errors during testing
    HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'maybe');
    HTMLMediaElement.prototype.load = jest.fn();
    playMock = jest.fn(() => Promise.resolve());
    HTMLMediaElement.prototype.play = jest.fn(() => playMock());
  });

  afterEach(() => {
    console.error = originalError;
    console.log = originalLogger;
    console.warn = originalWarn;
    jest.restoreAllMocks();
  });

  // Helper function to render the MediaPlayer with necessary context providers and props
  const renderPlayer = async ({ manifest, canvasIndex, manifestOverrides = {}, props = {} }) => {
    const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
      initialManifestState: { ...manifestState(manifest, canvasIndex), ...manifestOverrides },
      initialPlayerState: {},
      ...props,
    });
    await act(async () => render(
      <ErrorBoundary>
        <PlayerWithManifest />
      </ErrorBoundary>
    ));
  };

  // Helper function to trigger 'loadedmetadata' event on the video element
  const triggerLoadedMetadata = async (testid) => {
    await waitFor(() => {
      expect(screen.getAllByTestId(testid).length).toBeGreaterThan(0);
    });
    const player = screen.getAllByTestId(testid)[0].player;
    // Wait for player 'ready' to fire, i.e. player.canvasIndex is set
    await waitFor(() => {
      expect(player.canvasIndex).toBeDefined();
    });
    act(() => { player.trigger('loadedmetadata'); });
    return player;
  };

  describe('feature: resume playback modal', () => {
    // Helper function to render player with resume cache enabled
    const playerWithResumeCache = async ({
      manifest = videoManifest, canvasIndex = 0, manifestOverrides = {},
      props = { resumeCache: { enable: true } } } = {}) => {
      await renderPlayer({ manifest, canvasIndex, manifestOverrides, props });
      await triggerLoadedMetadata('videojs-video-element');
    };

    test('doesn\'t render resume modal with default props', async () => {
      // Insert a saved playback position at 120s for the Canvas into localStorage cache
      localStorage.setItem(
        'playbackPositions',
        JSON.stringify([{ key: MANIFEST_URL, value: { canvasURL: CANVAS_URL, time: 120, savedAt: Date.now() } }])
      );

      // Override the helper function's props to mimic the default props where resumeCache is disabled
      await playerWithResumeCache({ props: { resumeCache: { enable: false } } });

      await waitFor(() => {
        expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
      });
    });

    test('doesn\'t render resume modal for a playlist', async () => {
      /* Insert a saved playback position at 10s for the playlist Manifest into localStorage cache.
      IRL this would not be saved since playlist context is avoided, but this is to ensure the resume modal is not. */
      localStorage.setItem(
        'playbackPositions',
        JSON.stringify([{ key: 'http://example.com/playlists/1', value: { canvasURL: 'http://example.com/playlists/1/canvas/3', time: 10, savedAt: Date.now() } }])
      );

      await playerWithResumeCache({ manifest: playlistManifest, canvasIndex: 2, manifestOverrides: { playlist: { isPlaylist: true } } });

      await waitFor(() => {
        expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
      });
    });

    describe('when a saved playback position exists for the first Canvas', () => {
      beforeEach(async () => {
        // Insert a saved playback position at 120s for the Canvas into localStorage cache
        localStorage.setItem(
          'playbackPositions',
          JSON.stringify([{ key: MANIFEST_URL, value: { canvasURL: CANVAS_URL, time: 120, savedAt: Date.now() } }])
        );

        await playerWithResumeCache();
      });

      test('shows the resume modal on \'loadedmetadata\' event', async () => {
        await waitFor(() => {
          expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
        });
      });

      test('resume modal contains the saved timestamp in the text', async () => {
        await waitFor(() => {
          expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
        });
        expect(screen.getByText(/Resume playback from 02:00?/i)).toBeInTheDocument();
      });

      test('resume modal contains action buttons', async () => {
        await waitFor(() => {
          expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
        });
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No, start from beginning')).toBeInTheDocument();
      });

      describe('clicking \'Yes\'', () => {
        beforeEach(async () => {
          await playerWithResumeCache();
        });

        test('closes the modal and play media', async () => {
          await waitFor(() => {
            expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
          });
          act(() => { fireEvent.click(screen.getByText('Yes')); });
          await waitFor(() => {
            expect(screen.queryByTestId('resume-playback-modal')).toHaveClass('vjs-hidden');
            expect(playMock).toHaveBeenCalled();
          });
        });

        test('clears the saved playback position from localStorage', async () => {
          await waitFor(() => {
            expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
          });
          act(() => { fireEvent.click(screen.getByText('Yes')); });
          await waitFor(() => {
            const cache = JSON.parse(localStorage.getItem('playbackPositions'));
            expect(cache.find((e) => e.key === MANIFEST_URL)).toBeUndefined();
          });
        });
      });

      describe('clicking \'No, start from beginning\'', () => {
        beforeEach(async () => {
          await playerWithResumeCache();
        });

        test('closes the modal and play media', async () => {
          await waitFor(() => {
            expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
          });
          act(() => { fireEvent.click(screen.getByText('No, start from beginning')); });
          await waitFor(() => {
            expect(screen.queryByTestId('resume-playback-modal')).toHaveClass('vjs-hidden');
            expect(playMock).toHaveBeenCalled();
          });
        });


        test('clears the saved playback position from localStorage', async () => {
          await waitFor(() => {
            expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
          });
          act(() => { fireEvent.click(screen.getByText('No, start from beginning')); });
          await waitFor(() => {
            const cache = JSON.parse(localStorage.getItem('playbackPositions'));
            expect(cache.find((e) => e.key === MANIFEST_URL)).toBeUndefined();
          });
        });
      });
    });

    test('doesn\'t show a resume modal when a saved playback position doesn\'t exist', async () => {
      await playerWithResumeCache();
      // Wait for modal to render
      await act(async () => new Promise((r) => setTimeout(r, 50)));
      expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
    });

    describe('when the player loads', () => {
      describe('with a startCanvasId', () => {
        describe('and a respective saved playback position', () => {
          beforeEach(async () => {
            // Seed with one manifest entry pointing to the second Canvas at 60s
            localStorage.setItem(
              'playbackPositions',
              JSON.stringify([
                { key: MANIFEST_URL, value: { canvasURL: CANVAS_URL_2, time: 60, savedAt: Date.now() } }
              ])
            );
            // Load the page already on the second Canvas to simulate post-switch Canvas state
            await playerWithResumeCache({ canvasIndex: 1, manifestOverrides: { customStart: { startIndex: 1, startTime: 0 } } });
          });

          test('shows resume modal', async () => {
            await waitFor(() => {
              expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
              expect(screen.getByText(/Resume playback from 01:00?/i)).toBeInTheDocument();
              expect(screen.queryByTestId('videojs-next-button')).toBeInTheDocument();
              expect(screen.queryByTestId('videojs-previous-button')).toBeInTheDocument();
            });
          });

          test('doesn\'t persist resume modal after Canvas switch', async () => {
            act(() => { fireEvent.click(screen.getByText('No, start from beginning')); });

            await waitFor(() => {
              expect(screen.queryByTestId('resume-playback-modal')).toHaveClass('vjs-hidden');
              expect(playMock).toHaveBeenCalled();
            });

            act(() => { fireEvent.click(screen.getByTestId('videojs-previous-button')); });

            await waitFor(() => {
              expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
            });
          });
        });

        describe('and a saved playback position for a different Canvas', () => {
          test('the first Canvas, doesn\'t show resume modal', async () => {
            // 'startCanvasId' points to second Canvas, but saved position is on first Canvas
            localStorage.setItem(
              'playbackPositions',
              JSON.stringify([
                { key: MANIFEST_URL, value: { canvasURL: CANVAS_URL, time: 30, savedAt: Date.now() } }
              ])
            );
            await playerWithResumeCache({
              manifestOverrides: { customStart: { startIndex: 1, startTime: 0 } }
            });

            await act(async () => new Promise((r) => setTimeout(r, 50)));
            expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
          });

          test('a non-first, non-startCanvasId Canvas, doesn\'t show resume modal', async () => {
            const CANVAS_URL_3 = 'https://example.com/manifest/lunchroom_manners/canvas/3';
            // 'startCanvasId' points to second Canvas, but saved position is on the third Canvas
            localStorage.setItem(
              'playbackPositions',
              JSON.stringify([
                { key: MANIFEST_URL, value: { canvasURL: CANVAS_URL_3, time: 90, savedAt: Date.now() } }
              ])
            );
            await playerWithResumeCache({
              manifestOverrides: { customStart: { startIndex: 1, startTime: 0 } }
            });
            await act(async () => new Promise((r) => setTimeout(r, 50)));
            expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
          });
        });
      });

      test('with a custom start, deosn\'t display resume modal for a saved playback position', async () => {
        localStorage.setItem(
          'playbackPositions',
          JSON.stringify([{ key: MANIFEST_URL, value: { canvasURL: CANVAS_URL, time: 120, savedAt: Date.now() } }])
        );
        // Load the page with a custom start time
        await playerWithResumeCache({ manifestOverrides: { customStart: { startIndex: 0, startTime: 30 } } });

        await act(async () => new Promise((r) => setTimeout(r, 50)));
        expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
      });

      describe('without a startCanvasId, saved playback position is for a non-first Canvas', () => {
        beforeEach(async () => {
          // Saved position is on the second Canvas
          localStorage.setItem(
            'playbackPositions',
            JSON.stringify([
              { key: MANIFEST_URL, value: { canvasURL: CANVAS_URL_2, time: 45, savedAt: Date.now() } }
            ])
          );
          // Simulate post-switch state, player is now on Canvas 1
          await playerWithResumeCache({
            canvasIndex: 1,
            manifestOverrides: { customStart: { startIndex: 0, startTime: 0 } }
          });
        });

        test('shows resume modal for the saved Canvas', async () => {
          await waitFor(() => {
            expect(screen.queryByTestId('resume-playback-modal')).toBeInTheDocument();
            expect(screen.getByText(/Resume playback from 00:45?/i)).toBeInTheDocument();
          });
        });
      });
    });
  });

  describe('feature: error modal', () => {
    let player;

    describe('when all sources of a single-source Canvas fail', () => {
      beforeEach(async () => {
        await renderPlayer({ manifest: singleCanvasManifest, canvasIndex: 0 });
        player = await triggerLoadedMetadata('videojs-video-element');
        // Mark the source as failed to trigger error modal
        player.failedSources = player.currentSources().map((s) => s.src);
        // Fire the 'error' event by setting player.error(err)
        act(() => { player.error({ code: 2, message: 'network error' }); });
      });

      test('renders the error display modal', async () => {
        await waitFor(() => {
          expect(screen.queryByTestId('error-display-modal')).toBeInTheDocument();
        });
      });

      test('renders the error display modal with the unavailable sources message', async () => {
        await waitFor(() => {
          expect(screen.queryByTestId('error-display-modal')).toBeInTheDocument();
        });
        expect(screen.getByText(
          'None of the available sources could be loaded. Please try again later or contact support for help.'
        )).toBeInTheDocument();
      });
    });

    describe('when all multi-source segments of a Canvas fail', () => {
      beforeEach(async () => {
        await renderPlayer({ manifest: singleCanvasManifest, canvasIndex: 0 });
        player = await triggerLoadedMetadata('videojs-video-element');
        // Set player.targets to simulate a multi-source Canvas
        player.targets = [
          { start: 0, end: 330, altStart: 0, duration: 330 },
          { start: 330, end: 660, altStart: 330, duration: 330 },
        ];
        player.srcIndex = 0;
        // Mark both segment indices as already failed to trigger error modal
        player.failedSourceIndices = [0, 1];
        act(() => { player.error({ code: 2, message: 'network error' }); });
      });

      test('renders the error display modal', async () => {
        await waitFor(() => {
          expect(screen.queryByTestId('error-display-modal')).toBeInTheDocument();
        });
      });

      test('renders the error display modal with the all segments failed message', async () => {
        await waitFor(() => {
          expect(screen.queryByTestId('error-display-modal')).toBeInTheDocument();
        });
        expect(
          screen.getByText(/All video segments in this item are currently unavailable/i)
        ).toBeInTheDocument();
      });
    });

    describe('when a CORS error exhausts HLS playlist retries', () => {
      test('renders the error display modal with the default message', async () => {
        await renderPlayer({ manifest: singleCanvasManifest, canvasIndex: 0 });
        const player = await triggerLoadedMetadata('videojs-video-element');
        const mockVHSTech = {
          vhs: {
            playlistController_: {
              mainPlaylistLoader_: {
                main: { playlists: [{ playlistErrors_: 1 }] },
              },
            },
          },
          on: jest.fn(),
          off: jest.fn(),
        };

        // Simulate HLS retry errors in vhs' playlist controller
        jest.spyOn(player, 'tech').mockReturnValue(mockVHSTech);
        // Trigger 'loadstart' to set up the 'retryplaylist' event listener
        act(() => { player.trigger('loadstart'); });
        const retryCall = mockVHSTech.on.mock.calls.find(([evt]) => evt === 'retryplaylist');
        act(() => { retryCall[1](); });

        await waitFor(() => {
          expect(screen.queryByTestId('error-display-modal')).toBeInTheDocument();
        });
        expect(screen.getByText(
          'This item may require special access. Please contact support for assistance.'
        )).toBeInTheDocument();
      });
    });
  });

  describe('feature: IIIF Auth 2.0 request authorization', () => {
    // Simulate VHS calling all registered onRequest hooks with a request options object
    const mockVHSTech = () => ({ vhs: { xhr: { onRequest: jest.fn() } } });

    test('registers the vhs.onRequest hook and adds "Authorization" header when a token is present', async () => {
      await renderPlayer({
        manifest: singleCanvasManifest,
        manifestOverrides: { auth: { token: 'valid-token', status: 'authorized' } },
      });
      const player = await triggerLoadedMetadata('videojs-video-element');

      const tech = mockVHSTech();
      jest.spyOn(player, 'tech').mockReturnValue(tech);
      act(() => { player.trigger('xhr-hooks-ready'); });

      expect(tech.vhs.xhr.onRequest).toHaveBeenCalledTimes(1);
      const registeredHook = tech.vhs.xhr.onRequest.mock.calls[0][0];
      const options = registeredHook({ uri: 'https://example.com/stream/auto.m3u8' });
      expect(options.headers.Authorization).toBe('Bearer valid-token');
    });

    test('does not add the Authorization header when no token is present', async () => {
      await renderPlayer({ manifest: singleCanvasManifest });
      const player = await triggerLoadedMetadata('videojs-video-element');

      const tech = mockVHSTech();
      jest.spyOn(player, 'tech').mockReturnValue(tech);
      act(() => { player.trigger('xhr-hooks-ready'); });

      const registeredHook = tech.vhs.xhr.onRequest.mock.calls[0][0];
      const options = registeredHook({ uri: 'https://example.com/stream/auto.m3u8' });
      expect(options.headers?.Authorization).toBeUndefined();
    });
  });

  describe('feature: quality selection fallback', () => {
    const HIGH_SRC = 'https://example.com/manifest/high/lunchroom_manners_1024kb.mp4';
    const MED_SRC = 'https://example.com/manifest/medium/lunchroom_manners_512kb.mp4';

    // Helper function to set up the player for testing quality selection fallback logic
    const setupPlayerInFallbackState = async ({ isPlaying = false } = {}) => {
      await renderPlayer({ manifest: videoManifest, canvasIndex: 0 });
      await waitFor(() => {
        expect(screen.getAllByTestId('videojs-video-element').length).toBeGreaterThan(0);
      });
      const player = screen.getAllByTestId('videojs-video-element')[0].player;
      act(() => { player.trigger('loadedmetadata'); });

      // Setup player state for fallback logic
      player.failedSources = [];
      player.isFallingBack = false;
      player.currentSources = jest.fn(() => [
        { src: HIGH_SRC, type: 'video/mp4', label: 'High', selected: true },
        { src: MED_SRC, type: 'video/mp4', label: 'Medium', selected: false },
      ]);
      /* Stub,
      - player.error() - set default getter to return a code 4
      - player.currentTime() - default getter returns 0
      - player.paused() - default getter returns based on isPlaying arg
      - player.play() - stub to track play() calls without breaking    
      */
      player.error = jest.fn((code) => (code !== undefined ? undefined : { code: 4 }));
      player.currentTime = jest.fn((t) => (t !== undefined ? undefined : 0));
      player.play = jest.fn(() => Promise.resolve());
      player.paused = jest.fn(() => !isPlaying);

      // Trigger 'qualityRequested' to set wasPlayingRef.current initially
      act(() => {
        player.trigger('qualityRequested', { src: HIGH_SRC, label: 'High' });
      });

      return player;
    };

    test('resumes playback in seeked event when player was playing before fallback', async () => {
      const player = await setupPlayerInFallbackState({ isPlaying: true });

      act(() => { player.trigger('error'); });
      await act(async () => new Promise((r) => setTimeout(r, 150)));
      // Simulate quality-selector plugin 'seeked' event
      act(() => { player.trigger('seeked'); });

      expect(player.play).toHaveBeenCalled();
    });

    test('doesn\'t resume playback in seeked event when player was paused before fallback', async () => {
      const player = await setupPlayerInFallbackState({ isPlaying: false });

      act(() => { player.trigger('error'); });
      await act(async () => new Promise((r) => setTimeout(r, 150)));
      // Simulate quality-selector plugin 'seeked' event
      act(() => { player.trigger('seeked'); });

      expect(player.play).not.toHaveBeenCalled();
    });

    test('sets isFallingBack to false after the fallback loadedmetadata fires', async () => {
      const player = await setupPlayerInFallbackState();

      act(() => { player.trigger('error'); });
      await act(async () => new Promise((r) => setTimeout(r, 150)));

      expect(player.isFallingBack).toBe(true);
      act(() => { player.trigger('loadedmetadata'); });
      expect(player.isFallingBack).toBe(false);
    });
  });

  describe('feature: IIIF Auth logout UI', () => {
    describe('for video player', () => {
      test('when not authorized; doesn\'t render auth badge inside the player', async () => {
        await renderPlayer({
          manifest: authManifest,
          canvasIndex: 0,
          manifestOverrides: { auth: { token: null, status: 'idle' } },
        });
        /* No need to call triggerLoadedMetadata() to mimic the player events, as this instance doesn't
        create the VideoJS instance yet */

        expect(screen.getAllByTestId('videojs-video-element').length).toBeGreaterThan(0);
        expect(screen.queryByTestId('videojs-auth-menu')).not.toBeInTheDocument();
        expect(screen.queryByTestId('auth-badge')).not.toBeInTheDocument();
      });

      describe('when authorized', () => {
        let player;
        beforeEach(async () => {
          await renderPlayer({
            manifest: authManifest,
            canvasIndex: 0,
            manifestOverrides: { auth: { token: 'valid-token', status: 'authorized' } },
          });
          player = await triggerLoadedMetadata('videojs-video-element');
        });

        test('renders auth badge inside the player', async () => {
          expect(screen.getAllByTestId('videojs-video-element').length).toBeGreaterThan(0);
          expect(screen.getByTestId('auth-badge')).toBeInTheDocument();
        });

        test('doesn\'t render auth menu control in the control-bar', () => {
          expect(screen.getAllByTestId('videojs-video-element').length).toBeGreaterThan(0);
          expect(screen.queryByTestId('videojs-auth-menu')).not.toBeInTheDocument();
        });

        test('renders a logout button that calls "requestLogout" when clicked', async () => {
          expect(screen.getByTestId('auth-badge')).toBeInTheDocument();

          // Open the auth menu and click log out button
          fireEvent.click(screen.getByTestId('auth-badge'));
          fireEvent.click(screen.getByTestId('auth-badge-logout-button'));

          expect(authService.requestLogout).toHaveBeenCalledWith('http://example.com/auth/logout');
        });

        test('disables player and restores aspect-ratio on logout', async () => {
          const aspectRatioSpy = jest.spyOn(player, 'aspectRatio');

          // Open the auth menu and click log out button
          fireEvent.click(screen.getByTestId('auth-badge'));
          fireEvent.click(screen.getByTestId('auth-badge-logout-button'));

          expect(player.hasClass('vjs-audio-only-mode')).toBeFalsy();
          expect(aspectRatioSpy).toHaveBeenCalledWith('16:9');
          expect(player.hasClass('vjs-disabled')).toBe(true);
        });

        test('hides the auth badge on player "userinactive" event', () => {
          const badgeContainer = screen.getByTestId('auth-badge').closest('.ramp--auth-overlay__badge-container');
          expect(badgeContainer).not.toHaveClass('hidden');

          act(() => { player.trigger('userinactive'); });
          expect(badgeContainer).toHaveClass('hidden');
        });

        test('shows the auth badge again on player "useractive" event', () => {
          // Setup: hide the auth badge first
          act(() => { player.trigger('userinactive'); });
          const badgeContainer = screen.getByTestId('auth-badge').closest('.ramp--auth-overlay__badge-container');
          expect(badgeContainer).toHaveClass('hidden');

          // Simulate user activity
          act(() => { player.trigger('useractive'); });

          expect(badgeContainer).not.toHaveClass('hidden');
        });

        test('closes open logout menu on player "userinactive" event', () => {
          // Setup: open the auth badge menu
          fireEvent.click(screen.getByTestId('auth-badge'));
          expect(screen.getByTestId('auth-badge-menu')).toBeInTheDocument();

          // Simulate user inactivity
          act(() => { player.trigger('userinactive'); });

          expect(screen.queryByTestId('auth-badge-menu')).not.toBeInTheDocument();
        });

        test('triggers "reportUserActivity" when the badge receives focus while hidden', () => {
          const reportUserActivitySpy = jest.spyOn(player, 'reportUserActivity');
          // Setup: hide the auth badge first
          act(() => { player.trigger('userinactive'); });

          // Simulate focus event on the auth badge
          act(() => { screen.getByTestId('auth-badge').focus(); });
          expect(reportUserActivitySpy).toHaveBeenCalled();
        });
      });
    });

    describe('for audio player', () => {
      test('when not authorized; doesn\'t render auth menu control in the control-bar', async () => {
        await renderPlayer({
          manifest: authManifest,
          canvasIndex: 2,
          manifestOverrides: { auth: { token: null, status: 'idle' } },
        });
        /* No need to call triggerLoadedMetadata() to mimic the player events, as this instance doesn't
        create the VideoJS instance yet */

        expect(screen.getAllByTestId('videojs-audio-element').length).toBeGreaterThan(0);
        expect(screen.queryByTestId('videojs-auth-menu')).not.toBeInTheDocument();
        expect(screen.queryByTestId('auth-badge')).not.toBeInTheDocument();
      });

      describe('when authorized', () => {
        let player;
        beforeEach(async () => {
          await renderPlayer({
            manifest: authManifest,
            canvasIndex: 2,
            manifestOverrides: { auth: { token: 'valid-token', status: 'authorized' } },
          });
          player = await triggerLoadedMetadata('videojs-audio-element');
        });

        test('renders auth menu control in the control-bar', async () => {
          expect(screen.getAllByTestId('videojs-audio-element').length).toBeGreaterThan(0);
          expect(screen.getByTestId('videojs-auth-menu')).toBeInTheDocument();
        });

        test('doesn\'t render auth badge', async () => {
          expect(screen.getAllByTestId('videojs-audio-element').length).toBeGreaterThan(0);
          expect(screen.queryByTestId('auth-badge')).not.toBeInTheDocument();
        });

        test('renders a logout button that calls "requestLogout" when clicked', async () => {
          expect(screen.getByTestId('videojs-auth-menu')).toBeInTheDocument();

          // Open auth menu and click log out button
          fireEvent.click(screen.getByTestId('videojs-auth-menu'));
          fireEvent.click(screen.getByTestId('videojs-auth-logout-button'));

          expect(authService.requestLogout).toHaveBeenCalledWith('http://example.com/auth/logout');
        });

        test('disables player and restores aspect-ratio on logout', async () => {
          const aspectRatioSpy = jest.spyOn(player, 'aspectRatio');

          // Open auth menu and click log out button
          fireEvent.click(screen.getByTestId('videojs-auth-menu'));
          fireEvent.click(screen.getByTestId('videojs-auth-logout-button'));

          expect(player.hasClass('vjs-audio-only-mode')).toBeFalsy();
          expect(aspectRatioSpy).toHaveBeenCalledWith('16:9');
          expect(player.hasClass('vjs-disabled')).toBe(true);
        });
      });
    });
  });

  describe('feature: waveform display', () => {
    // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
    const ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    window.ResizeObserver = ResizeObserver;

    const waveformRef = { current: document.createElement('div') };
    const resumeModalRef = { current: document.createElement('div') };
    const props = { resumeModalRef, waveformRef };

    const mockWaveformFetch = () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({
            version: 2, channels: 1, sample_rate: 44100, samples_per_pixel: 512,
            bits: 8, length: 2, data: [0, 10, -5, 8],
          }),
        });
      });
    };

    describe('doesn\'t add waveform toggle button or panel', () => {
      test('when the Canvas has no waveform resource', async () => {
        await renderPlayer({ manifest: videoManifest, canvasIndex: 0, ...props });

        expect(screen.queryByTestId('videojs-waveform-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('videojs-waveform-panel')).not.toBeInTheDocument();
      });

      test('when "showWaveform" prop is turned off (default)', async () => {
        await renderPlayer({ manifest: waveformManifest, canvasIndex: 0 });

        expect(screen.queryByTestId('videojs-waveform-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('videojs-waveform-panel')).not.toBeInTheDocument();
      });

      test('when the waveform resource fetch fails', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch')
          .mockRejectedValueOnce(new Error('Network error'));

        await renderPlayer({
          manifest: waveformManifest, canvasIndex: 0,
          props: { ...props, showWaveform: true },
        });

        expect(fetchSpy).toHaveBeenCalledWith('http://example.com/waveform.json', expect.anything());
        expect(console.error).toHaveBeenCalled();

        // The panel is added to the DOM because the waveform resource is present in Canvas
        expect(screen.queryByTestId('videojs-waveform-panel')).toBeInTheDocument();
        // Waveform toggle button is not added to the control-bar
        expect(screen.queryByTestId('videojs-waveform-button')).not.toBeInTheDocument();
      });

      test('when the waveform resource is not a waveform', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch');

        /* The 4th Canvas in this Manifest has a .xml with format 'text/xml' attached in 'seeAlso',
        which is not a vali waveform format. Therefore, it gets filtered out during parsing. */
        await renderPlayer({
          manifest: waveformManifest, canvasIndex: 3,
          props: { ...props, showWaveform: true },
        });

        expect(fetchSpy).not.toHaveBeenCalled();

        expect(screen.queryByTestId('videojs-waveform-panel')).not.toBeInTheDocument();
        expect(screen.queryByTestId('videojs-waveform-button')).not.toBeInTheDocument();
      });
    });

    describe('adds waveform toggle and panel', () => {
      test('when a waveform resource is present', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => {
          return Promise.resolve({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
              version: 2, channels: 1, sample_rate: 44100, samples_per_pixel: 512,
              bits: 8, length: 2, data: [0, 10, -5, 8],
            }),
          });
        });

        await renderPlayer({
          manifest: waveformManifest, canvasIndex: 0,
          props: { ...props, showWaveform: true }
        });

        expect(screen.queryByTestId('videojs-waveform-panel')).toBeInTheDocument();
        expect(screen.queryByTestId('videojs-waveform-button')).toBeInTheDocument();
      });

      test('with a waveform visualization as pixels in a canvas for a waveform dataset', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => {
          return Promise.resolve({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
              version: 2, channels: 1, sample_rate: 44100, samples_per_pixel: 512,
              bits: 8, length: 2, data: [0, 10, -5, 8],
            }),
          });
        });

        await renderPlayer({
          manifest: waveformManifest, canvasIndex: 0, props: { ...props, showWaveform: true },
        });

        expect(screen.queryByTestId('videojs-waveform-panel')).toBeInTheDocument();
        const panel = screen.getByTestId('videojs-waveform-panel');
        expect(panel).toBeInTheDocument();
        expect(panel.querySelector('canvas.vjs-waveform-canvas')).toBeInTheDocument();
      });

      test('with a waveform visualization a an image for a waveform image', async () => {
        await renderPlayer({
          manifest: waveformManifest, canvasIndex: 1,
          props: { ...props, showWaveform: true },
        });

        expect(screen.queryByTestId('videojs-waveform-panel')).toBeInTheDocument();
        const panel = screen.getByTestId('videojs-waveform-panel');
        expect(panel.style.backgroundImage).toContain('http://example.com/waveform.jpg');
        expect(panel.querySelector('canvas.vjs-waveform-canvas')).not.toBeInTheDocument();
      });
    });

    test('toggles waveform panel visibility', async () => {
      mockWaveformFetch();
      await renderPlayer({
        manifest: waveformManifest, canvasIndex: 0,
        props: { ...props, showWaveform: true },
      });

      const panel = await screen.findByTestId('videojs-waveform-panel');
      expect(panel).toHaveClass('hidden');

      const toggleButton = screen.getByTestId('videojs-waveform-button');
      fireEvent.click(toggleButton);
      expect(panel).not.toHaveClass('hidden');

      fireEvent.click(toggleButton);
      expect(panel).toHaveClass('hidden');
    });

    describe('on page load', () => {
      test('shows the panel for an audio Canvas without a saved playback position', async () => {
        mockWaveformFetch();

        await renderPlayer({
          manifest: waveformManifest, canvasIndex: 2,
          props: { ...props, showWaveform: true },
        });

        await screen.findByTestId('videojs-waveform-button');
        const panel = screen.getByTestId('videojs-waveform-panel');
        expect(panel).not.toHaveClass('hidden');
      });

      test('hides the panel for an audio Canvas with a saved playback position', async () => {
        mockWaveformFetch();
        localStorage.setItem(
          'playbackPositions',
          JSON.stringify([{
            key: 'http://example.com/waveform-example/manifest.json',
            value: {
              canvasURL: 'http://example.com/waveform-example/canvas/1',
              time: 30, savedAt: Date.now(),
            },
          }])
        );

        await renderPlayer({
          manifest: waveformManifest, canvasIndex: 2,
          props: { ...props, showWaveform: true, resumeCache: { enable: true } },
        });

        await screen.findByTestId('videojs-waveform-button');
        const panel = screen.getByTestId('videojs-waveform-panel');
        expect(panel).toHaveClass('hidden');
      });

      test('hides the panel for a video Canvas regardless of saved playback position', async () => {
        mockWaveformFetch();
        localStorage.setItem(
          'playbackPositions',
          JSON.stringify([{
            key: 'http://example.com/single-canvas-manifest/manifest.json',
            value: {
              canvasURL: 'http://example.com/single-canvas-manifest/canvas/1',
              time: 30,
              savedAt: Date.now(),
            },
          }])
        );

        await renderPlayer({
          manifest: waveformManifest, canvasIndex: 0,
          props: { ...props, showWaveform: true, resumeCache: { enable: true } },
        });

        await screen.findByTestId('videojs-waveform-button');
        const panel = screen.getByTestId('videojs-waveform-panel');
        expect(panel).toHaveClass('hidden');
      });
    });
  });
});
