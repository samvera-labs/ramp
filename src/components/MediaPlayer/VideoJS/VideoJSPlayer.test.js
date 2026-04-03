import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import { withManifestAndPlayerProvider, manifestState } from '@Services/testing-helpers';
import videoManifest from '@TestData/lunchroom-manners';
import playlistManifest from '@TestData/playlist';

describe('VideoJSPlayer component', () => {
  const CANVAS_URL = 'https://example.com/manifest/lunchroom_manners/canvas/1';
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
  const triggerLoadedMetadata = async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId('videojs-video-element').length).toBeGreaterThan(0);
    });
    const player = screen.getAllByTestId('videojs-video-element')[0].player;
    act(() => { player.trigger('loadedmetadata'); });
  };

  describe('feature: resume playback modal', () => {
    // Helper function to render player with resume cache enabled
    const playerWithResumeCache = async ({
      manifest = videoManifest, canvasIndex = 0, manifestOverrides = {},
      props = { resumeCache: { enable: true } } } = {}) => {
      await renderPlayer({ manifest, canvasIndex, manifestOverrides, props });
      await triggerLoadedMetadata();
    };

    test('doesn\'t render resume modal with default props', async () => {
      // Insert a saved playback position at 120s for the Canvas into localStorage cache
      localStorage.setItem(
        'playbackPositions',
        JSON.stringify([{ key: CANVAS_URL, value: { time: 120, savedAt: Date.now() } }])
      );

      // Override the helper function's props to mimic the default props where resumeCache is disabled
      await playerWithResumeCache({ props: { resumeCache: { enable: false } } });

      await waitFor(() => {
        expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
      });
    });

    test('doesn\'t render resume modal for a playlist', async () => {
      // Insert a saved playback position at 120s for the Canvas into localStorage cache
      localStorage.setItem(
        'playbackPositions',
        JSON.stringify([{ key: 'http://example.com/playlists/1/canvas/3', value: { time: 10, savedAt: Date.now() } }])
      );

      await playerWithResumeCache({ manifest: playlistManifest, canvasIndex: 2, manifestOverrides: { playlist: { isPlaylist: true } } });

      await waitFor(() => {
        expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
      });
    });

    describe('when a saved playback position exists', () => {
      beforeEach(async () => {
        // Insert a saved playback position at 120s for the Canvas into localStorage cache
        localStorage.setItem(
          'playbackPositions',
          JSON.stringify([{ key: CANVAS_URL, value: { time: 120, savedAt: Date.now() } }])
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
            expect(cache.find((e) => e.key === CANVAS_URL)).toBeUndefined();
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
            expect(cache.find((e) => e.key === CANVAS_URL)).toBeUndefined();
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

    describe('when the player loads with', () => {
      const CANVAS_URL_1 = 'https://example.com/manifest/lunchroom_manners/canvas/1';
      const CANVAS_URL_2 = 'https://example.com/manifest/lunchroom_manners/canvas/2';

      describe('a non-first Canvas with a saved playback position', () => {
        beforeEach(async () => {
          localStorage.setItem(
            'playbackPositions',
            JSON.stringify([
              { key: CANVAS_URL_1, value: { time: 120, savedAt: Date.now() } },
              { key: CANVAS_URL_2, value: { time: 60, savedAt: Date.now() } }
            ])
          );
          // Load the page with the second Canvas as the current Canvas
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

      test('a non-first Canvas without a saved playback position, doesn\'t show resume modal', async () => {
        localStorage.setItem(
          'playbackPositions',
          JSON.stringify([{ key: CANVAS_URL_1, value: { time: 120, savedAt: Date.now() } }])
        );
        // Load the page with the second Canvas as the current Canvas
        await playerWithResumeCache({ canvasIndex: 1, manifestOverrides: { customStart: { startIndex: 1, startTime: 0 } } });
        await waitFor(() => {
          expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
        });
      });

      test('a custom start, deosn\'t display resume modal for a saved playback position', async () => {
        localStorage.setItem(
          'playbackPositions',
          JSON.stringify([{ key: CANVAS_URL, value: { time: 120, savedAt: Date.now() } }])
        );
        // Load the page with a custom start time
        await playerWithResumeCache({ manifestOverrides: { customStart: { startIndex: 0, startTime: 30 } } });

        await act(async () => new Promise((r) => setTimeout(r, 50)));
        expect(screen.queryByTestId('resume-playback-modal')).not.toBeInTheDocument();
      });
    });
  });
});
