import React, { createRef } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Transcript from './Transcript';
import * as transcriptParser from '@Services/transcript-parser';
import { withManifestAndPlayerProvider } from '@Services/testing-helpers';
import lunchroomManners from '@TestData/lunchroom-manners';
import multiSourceManifest from '@TestData/multi-source-manifest';
import * as hooks from '@Services/ramp-hooks';
import * as searchHooks from '@Services/search';

describe('Transcript component', () => {
  let originalError, originalLogger;
  const syncPlaybackMock = jest.fn();

  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
    originalLogger = console.log;
    console.log = jest.fn();

    // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
    const ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    window.ResizeObserver = ResizeObserver;
    jest.spyOn(hooks, 'useSyncPlayback').mockImplementation(() => ({ syncPlayback: syncPlaybackMock }));
  });

  afterAll(() => {
    console.error = originalError;
    console.log = originalLogger;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('with valid transcript data', () => {
    let playerRef = createRef(null);
    const props = {
      playerID: 'player-id',
      transcripts: [
        {
          canvasId: 0,
          items: [
            {
              title: 'Transcript 1',
              url: 'http://example.com/transcript.json',
            },
          ],
        },
      ],
    };

    const useTranscripts = {
      canvasIndexRef: { current: 0 },
      isEmpty: false,
      isLoading: false,
      NO_SUPPORT_MSG: 'Transcript format is not supported, please check again.',
      playerRef: { ...playerRef },
      selectTranscript: jest.fn(),
    };
    const tData = [
      { begin: 1.2, end: 21, text: '[music]', tag: 'TIMED_CUE' },
      { begin: 22.2, end: 26.6, text: 'transcript text 1', tag: 'TIMED_CUE' },
      { begin: 27.3, end: 31, text: '<strong>transcript text 2</strong>', tag: 'TIMED_CUE' },
    ];

    describe('with timed-text', () => {
      beforeEach(() => {
        // Mock custom hook output
        jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
          ...useTranscripts,
          transcript: tData,
          transcriptInfo: {
            tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
          }
        }));
        jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
          counts: [],
          ids: [0, 1, 2],
          matchingIds: [],
          results: tData,
        }));

        const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
          initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
          initialPlayerState: {},
          ...props,
        });
        render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
      });

      test('renders successfully', () => {
        expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
        expect(
          screen.queryAllByTestId('transcript_time')[0]
        ).toHaveTextContent('00:01');
        expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
          '[music]'
        );
        expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
      });

      test('renders html markdown text', () => {
        const transcriptText = screen.queryAllByTestId('transcript_timed_text')[2];
        expect(transcriptText.innerHTML).toEqual(
          '<strong>transcript text 2</strong>'
        );
        expect(transcriptText).toHaveTextContent('transcript text 2');
      });

      test('highlights cue when clicking on cue\'s timestamp', () => {
        const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
        expect(transcriptItem.children).toHaveLength(2);
        expect(transcriptItem.children[0].textContent).toEqual('[00:00:01]');
        expect(transcriptItem.children[1].textContent).toEqual('[music]');
        expect(transcriptItem.classList.contains('active')).toBeFalsy();
        // Click on the cue's timestamp
        fireEvent.click(transcriptItem.children[0]);
        expect(transcriptItem.classList.contains('active')).toBeTruthy();
        expect(syncPlaybackMock).toHaveBeenCalledWith(1.2);
      });

      test('does nothing when clicking on the cue\'s text', () => {
        const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
        fireEvent.click(transcriptItem.children[1]);
        expect(transcriptItem.classList.contains('active')).toBeFalsy();
        expect(syncPlaybackMock).not.toHaveBeenCalled();
      });
    });

    describe('with WebVTT', () => {
      describe('with showNotes = false (default)', () => {
        beforeEach(() => {
          jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
            ...useTranscripts,
            transcript: tData,
            transcriptInfo: {
              tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
            }
          }));
          jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
            ids: [0, 1, 2], matchingIds: [], results: tData,
          }));

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...props,
          });
          render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
        });

        test('renders successfully', () => {
          expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript_item')).toHaveLength(3);
          expect(screen.queryAllByTestId('transcript_note')).toHaveLength(0);
          expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
        });

        test('does not render comment in the header block', () => {
          expect(screen.queryAllByTestId('transcript_note').length).toBe(0);
        });

        test('renders the rest of the cues with timestamps', () => {
          const transcriptItem0 = screen.queryAllByTestId('transcript_item')[0];
          expect(transcriptItem0.children).toHaveLength(2);
          expect(transcriptItem0.children[0].textContent).toEqual('[00:00:01]');
          expect(transcriptItem0.children[1].textContent).toEqual('[music]');
          expect(transcriptItem0.classList.contains('active')).toBeFalsy();

          const transcriptItem1 = screen.queryAllByTestId('transcript_item')[1];
          expect(transcriptItem1.children).toHaveLength(2);
          expect(transcriptItem1.children[0].textContent).toEqual('[00:00:22]');
          expect(transcriptItem1.children[1].textContent).toEqual('transcript text 1');
          expect(transcriptItem1.classList.contains('active')).toBeFalsy();
        });

        test('highlights cue when clicking on the cue\'s timestamp', () => {
          const transcriptItem = screen.queryAllByTestId('transcript_item')[1];
          expect(transcriptItem.children).toHaveLength(2);
          expect(transcriptItem.children[0].textContent).toEqual('[00:00:22]');
          expect(transcriptItem.children[1].textContent).toEqual('transcript text 1');
          // Click on the cue's timestamp
          fireEvent.click(transcriptItem.children[0]);
          expect(transcriptItem.classList.contains('active')).toBeTruthy();
          expect(syncPlaybackMock).toHaveBeenCalledWith(22.2);
        });

        test('does nothing when clicking on the cue\'s text', () => {
          const transcriptItem = screen.queryAllByTestId('transcript_item')[1];
          fireEvent.click(transcriptItem.children[1]);
          expect(transcriptItem.classList.contains('active')).toBeFalsy();
          expect(syncPlaybackMock).not.toHaveBeenCalled();
        });
      });

      describe('with showNotes = true', () => {
        beforeEach(() => {
          const updatedProps = {
            ...props,
            showNotes: true,
          };
          const updatedTData = [
            {
              begin: 0, end: 0, tag: 'NOTE',
              text: 'NOTE<br />This is a multi-line comment.<br />Following is a list of cues.',
            },
            {
              begin: 1.2, end: 21, tag: 'TIMED_CUE',
              text: '[music]',
            },
            {
              begin: 22.2, end: 26.6, tag: 'TIMED_CUE',
              text: 'transcript text 1',
            },
            {
              begin: 27.3, end: 31, tag: 'TIMED_CUE',
              text: '<strong>transcripdsdsdst text 2</strong>',
            },
            {
              begin: 0, end: 0, tag: 'NOTE',
              text: 'NOTE<br />This is the end of the cues.<br />',
            },
          ];
          jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
            ...useTranscripts,
            selectedTranscript: { url: 'http://example.com/transcript.vtt', isTimed: true },
            transcript: updatedTData,
            transcriptInfo: {
              id: "transcript-0-0",
              tUrl: 'http://example.com/transcript.vtt',
              tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
            }
          }));
          jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
            counts: [],
            ids: [0, 1, 2, 3, 4],
            matchingIds: [],
            results: updatedTData,
          }));

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...updatedProps,
          });
          render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
        });

        test('renders successfully', () => {
          expect(screen.queryAllByTestId('transcript_note')).toHaveLength(2);
          expect(screen.queryAllByTestId('transcript_item')).toHaveLength(3);
        });

        test('renders comment in the header block', () => {
          expect(screen.queryAllByTestId('transcript_note')[0]).toHaveTextContent(
            'NOTEThis is a multi-line comment.Following is a list of cues.'
          );
        });

        test('renders NOTE in the WebVTT body', () => {
          expect(screen.queryAllByTestId('transcript_note')[1]).toHaveTextContent(
            'NOTEThis is the end of the cues.'
          );
        });
      });

      describe('with showMetadata = false (default)', () => {
        beforeEach(() => {
          jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
            ...useTranscripts,
            selectedTranscript: { url: 'http://example.com/transcript.vtt', isTimed: true },
            transcript: tData,
            transcriptInfo: {
              id: "",
              tUrl: 'http://example.com/transcript.vtt',
              tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
            }
          }));
          jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
            counts: [],
            ids: [0, 1, 2],
            matchingIds: [],
            results: tData,
          }));

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...props,
          });
          render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
        });

        test('renders successfully', () => {
          expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript_item')).toHaveLength(3);
          expect(screen.queryAllByTestId('transcript_metadata')).toHaveLength(0);
          expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
        });

        test('does not render metadata in the header block', () => {
          expect(screen.queryAllByTestId('transcript_metadata').length).toBe(0);
        });
      });

      describe('with showMetadata = true', () => {
        const updatedProps = {
          ...props,
          showMetadata: true,
        };
        const updatedTData = [
          {
            begin: 0,
            end: 0,
            text: 'Type: Caption<br />Language: eng<br />File Creation Date: 2025-06-20 10:56:44.008719<br />',
            tag: 'METADATA'
          },
          ...tData,
        ];

        beforeEach(() => {
          jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
            ...useTranscripts,
            transcript: updatedTData,
            transcriptInfo: {
              id: "",
              tUrl: 'http://example.com/transcript.vtt',
              tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
            }
          }));
          jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
            counts: [],
            ids: [0, 1, 2, 3],
            matchingIds: [],
            results: updatedTData,
          }));

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...updatedProps,
          });
          render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
        });

        test('renders successfully', () => {
          expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript_item')).toHaveLength(3);
          expect(screen.queryAllByTestId('transcript_metadata')).toHaveLength(1);
          expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
        });

        test('renders metadata in the header block', () => {
          expect(screen.queryAllByTestId('transcript_metadata')[0]).toHaveTextContent(
            'Type: CaptionLanguage: engFile Creation Date: 2025-06-20 10:56:44.008719'
          );
        });
      });
    });

    describe('with transcript as an annotation list', () => {
      beforeEach(() => {
        const tData = [
          { id: 0, begin: undefined, end: undefined, text: '[music]', tag: 'TIMED_CUE' },
          { id: 1, begin: undefined, end: undefined, text: 'transcript text 1', tag: 'TIMED_CUE' },
          { id: 2, begin: undefined, end: undefined, text: '<strong>transcript text 2</strong>', tag: 'TIMED_CUE' },
        ];
        // Mock custom hook output
        jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
          ...useTranscripts,
          transcript: tData,
          transcriptInfo: {
            tError: "",
            tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
          }
        }));
        jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
          ids: [0, 1, 2], matchingIds: [], results: tData,
        }));

        const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
          initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
          initialPlayerState: {},
          ...props,
        });
        render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
      });

      test('renders successfully', () => {
        expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript_time')).not.toBeInTheDocument();
        expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
          '[music]'
        );
        const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
        expect(transcriptItem).not.toHaveAttribute('starttime');
        expect(transcriptItem).not.toHaveAttribute('endtime');
      });

      test('highlights item on click', () => {
        const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
        fireEvent.click(transcriptItem);
        expect(transcriptItem.classList.contains('active')).toBeTruthy();
        // Does not call syncPlayback as there is no timing info
        expect(syncPlaybackMock).not.toHaveBeenCalled();
        const transcriptItem1 = screen.queryAllByTestId('transcript_item')[1];
        expect(transcriptItem1.classList.contains('active')).toBe(false);
      });

      test('removes previous item highlight on click', () => {
        // click on an item
        const transcriptItem1 = screen.queryAllByTestId('transcript_item')[0];
        fireEvent.click(transcriptItem1);
        // Does not call syncPlayback as there is no timing info
        expect(syncPlaybackMock).not.toHaveBeenCalled();
        expect(transcriptItem1.classList.contains('active')).toBeTruthy();

        const transcriptItem2 = screen.queryAllByTestId('transcript_item')[1];
        // click on a second item
        fireEvent.click(transcriptItem2);
        expect(transcriptItem2.classList.contains('active')).toBeTruthy();
        expect(transcriptItem1.classList.contains('active')).toBeFalsy();
      });
    });

    describe('renders untimed text', () => {
      test('in a MS docs file', () => {
        const props = {
          playerID: 'player-id',
          transcripts: [
            {
              canvasId: 0,
              items: [{ title: 'MS doc transcript (machine-generated)', url: 'http://example.com/transcript.doc' }],
            },
          ],
        };
        const tData = [
          {
            tag: 'NON_TIMED_LINE', textDisplayed: '<p><strong>Speaker 1:</strong> <em>Lorem ipsum</em> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. </p>',
            text: 'Speaker 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere.', id: 0,
          }
        ];
        // Mock custom hook output
        jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
          ...useTranscripts,
          selectedTranscript: { url: 'http://example.com/transcript.doc', isTimed: false },
          transcript: tData,
          transcriptInfo: {
            isMachineGen: true,
            tType: transcriptParser.TRANSCRIPT_TYPES.docx,
          }
        }));
        jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
          ids: [0], matchingIds: [], results: tData,
        }));

        const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
          initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
          initialPlayerState: {},
          ...props,
        });
        render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

        expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript_content_3')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript-machinegen-msg')).toBeInTheDocument();
        expect(screen.getByTestId('transcript-machinegen-msg')).toHaveTextContent("Machine-generated transcript may contain errors.");
      });

      test('in a plain text file', () => {
        const props = {
          playerID: 'player-id',
          transcripts: [
            {
              canvasId: 0,
              items: [{ title: 'Plain text transcript (Machine Generated)', url: 'http://example.com/transcript.txt' }],
            },
          ],
        };
        const tData = [
          { tag: 'NON_TIMED_LINE', textDisplayed: '00:00:01.200 --> 00:00:21.000', text: '00:00:01.200 --> 00:00:21.000', id: 0 },
          { tag: 'NON_TIMED_LINE', textDisplayed: '[music]', text: '[music]', id: 1 },
          { tag: 'NON_TIMED_LINE', textDisplayed: '00:00:22.200 --> 00:00:26.600', text: '00:00:22.200 --> 00:00:26.600', id: 2 },
          { tag: 'NON_TIMED_LINE', textDisplayed: 'Just before lunch one day, a puppet show <br>was put on at school.', text: 'Just before lunch one day, a puppet show was put on at school.', id: 3 },
          { tag: 'NON_TIMED_LINE', textDisplayed: '00:00:26.700 --> 00:00:31.500', text: '00:00:26.700 --> 00:00:31.500', id: 4 },
          { tag: 'NON_TIMED_LINE', textDisplayed: 'It was called \"Mister Bungle Goes to Lunch\"', text: 'It was called \"Mister Bungle Goes to Lunch\"', id: 5 }
        ];

        // Mock custom hook output
        jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
          ...useTranscripts,
          selectedTranscript: { url: 'http://example.com/transcript.txt', isTimed: false },
          transcript: tData,
          transcriptInfo: {
            isMachineGen: true,
            tType: transcriptParser.TRANSCRIPT_TYPES.plainText,
          }
        }));
        jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
          ids: [0, 1, 2, 3, 4, 5], matchingIds: [], results: tData,
        }));

        const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
          initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
          initialPlayerState: {},
          ...props,
        });
        render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

        expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript_content_2')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript-machinegen-msg')).toBeInTheDocument();
        expect(screen.getByTestId('transcript-machinegen-msg')).toHaveTextContent("Machine-generated transcript may contain errors.");
      });
    });
  });

  describe('renders a message for', () => {
    let playerRef = createRef(null);
    let useTranscripts = {};
    beforeEach(() => {
      useTranscripts = {
        canvasIndexRef: { current: 0 },
        isEmpty: true,
        isLoading: false,
        NO_SUPPORT_MSG: 'Transcript format is not supported, please check again.',
        playerRef: { ...playerRef },
        selectTranscript: jest.fn(),
        canvasTranscripts: [],
        selectedTranscript: { url: '', isTimed: false },
        transcript: [],
      };
      jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
        counts: [],
        ids: [],
        matchingIds: [],
        results: [],
      }));
    });

    test('an empty list of transcripts', () => {
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        transcriptInfo: {
          tError: "No valid Transcript(s) found, please check again.",
          tType: transcriptParser.TRANSCRIPT_TYPES.noTranscript,
        }
      }));
      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        playerID: "player-id",
        transcripts: [],
      });
      render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('No valid Transcript(s) found, please check again');
    });

    test('an empty transcript item list', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [],
          },
        ],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        transcriptInfo: {
          tError: "No valid Transcript(s) found, please check again.",
          tType: transcriptParser.TRANSCRIPT_TYPES.noTranscript,
        }
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('No valid Transcript(s) found, please check again');
    });

    test('undefined transcript url', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [{ title: 'Transcript 0', url: undefined }],
          },
        ],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        transcriptInfo: {
          tError: "Invalid URL for transcript, please check again.",
          tType: transcriptParser.TRANSCRIPT_TYPES.invalid,
        }
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_content_-1')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('Invalid URL for transcript, please check again.');
    });

    test('invalid transcript url', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [{ title: 'Transcript 1', url: 'www.example.com/transcript.json' }],
          },
        ],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        isEmpty: true,
        canvasTranscripts: [],
        selectedTranscript: { url: '', isTimed: false },
        transcript: [],
        transcriptInfo: {
          tError: "Invalid URL for transcript, please check again.",
          tType: transcriptParser.TRANSCRIPT_TYPES.invalid,
        }
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_content_-1')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'Invalid URL for transcript, please check again.'
      );
    });

    test('invalid transcript file type: .png', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [{ title: 'Image Transcript', url: 'https://example.com/transcript_image.png' }],
          },
        ],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.noSupport,
          tError: 'Transcript format is not supported, please check again.'
        }
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_content_-2')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('Transcript format is not supported, please check again.');
    });

    test('invalid transcript file format: text/html', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [{ title: 'Doc Transcript', url: 'https://example.com/section/2/supplemental_files/12' }],
          },
        ],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.noSupport,
          tError: 'Transcript format is not supported, please check again.'
        }
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_content_-2')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('Transcript format is not supported, please check again.');
    });

    test('manifest without supplementing motivation', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [{ title: 'Transcript 2', url: 'http://example.com/transcript-manifest.json' }],
          },
        ],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.noTranscript,
          tError: 'No valid Transcript(s) found, please check again.'
        }
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'No valid Transcript(s) found, please check again.'
      );
    });

    test('invalid WebVTT file', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [{ title: 'WebVTT Transcript', url: 'https://example.com/lunchroom_manners.vtt' }],
          },
        ],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.invalidVTT,
          tError: 'Invalid WebVTT file, please check again.'
        }
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<> <video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_content_-3')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('Invalid WebVTT file, please check again.');
    });

    test('WebVTT file with invalid timestamps', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [{ title: 'WebVTT Transcript', url: 'https://example.com/lunchroom_manners.vtt' }],
          },
        ],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        ...useTranscripts,
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.invalidTimestamp,
          tError: 'Invalid timestamp format in cue(s), please check again.'
        }
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_content_-4')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('Invalid timestamp format in cue(s), please check again.');
    });
  });

  describe('parses transcript information from annotations in state', () => {
    test('when there are supplementing annotations', () => {
      let playerRef = createRef(null);
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json'
      };
      const abortSpy = jest.fn();
      const mockAbortController = jest.fn(() => ({
        abort: abortSpy,
        signal: {},
      }));
      global.AbortController = mockAbortController;
      const tData = [
        { begin: 1.2, end: 21, text: '[music]', tag: 'TIMED_CUE' },
        { begin: 22.2, end: 26.6, text: 'transcript text 1', tag: 'TIMED_CUE' }
      ];
      // Mock custom hook output
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        canvasIndexRef: { current: 0 },
        playerRef: { ...playerRef },
        canvasTranscripts: [{
          filename: "Captions in WebVTT format",
          format: "text/vtt",
          id: "Captions in WebVTT format-0-0",
          isMachineGen: false,
          title: "Captions in WebVTT format",
          url: "https://example.com/manifest/lunchroom_manners.vtt"
        }],
        transcript: tData,
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
        }
      }));
      jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
        counts: [], ids: [0, 1], matchingIds: [], results: tData
      }));

      const annotations = [
        {
          canvasIndex: 0,
          annotationSets: [
            {
              canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
              filename: 'Captions in WebVTT format.vtt',
              format: 'text/vtt',
              id: 'Captions in WebVTT format-0-0',
              label: 'Captions in WebVTT format',
              linkedResource: true,
              motivation: ['supplementing'],
              timed: true,
              url: 'https://example.com/manifest/lunchroom_manners.vtt'
            },
          ]
        }
      ];
      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0, annotations },
        initialPlayerState: {},
        ...props,
      });
      render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
      act(() => { abortSpy(); });

      // AbortController has been called
      expect(abortSpy).toHaveBeenCalled();
      expect(screen.queryByTestId('transcript-selector')).toBeInTheDocument();
      expect(screen.getByTestId('transcript-select-option')).toBeInTheDocument();
      expect(screen.getByText('Captions in WebVTT format')).toBeInTheDocument();
      expect(screen.queryAllByTestId('transcript_time')[0]).toHaveTextContent('00:01');
      expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent('[music]');
    });

    test('when there aren\'t supplementing annotations', () => {
      let playerRef = createRef(null);
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json'
      };
      const abortSpy = jest.fn();
      const mockAbortController = jest.fn(() => ({
        abort: abortSpy,
        signal: {},
      }));
      global.AbortController = mockAbortController;
      const syncPlaybackMock = jest.fn();
      // Mock custom hook output
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        canvasIndexRef: { current: 0 },
        canvasTranscripts: [],
        playerRef: { ...playerRef },
        // syncPlayback: syncPlaybackMock,
        transcript: [],
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.noTranscript,
          tError: 'No valid Transcript(s) found, please check again.'
        }
      }));
      jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
        counts: [], ids: [], matchingIds: [], results: []
      }));

      const annotations = [
        {
          canvasIndex: 0,
          annotationSets: [
            {
              canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
              filename: 'Captions in WebVTT format.vtt',
              format: 'text/vtt',
              id: 'Captions in WebVTT format-0-0',
              label: 'Captions in WebVTT format',
              linkedResource: true,
              motivation: ['commenting'],
              timed: true,
              url: 'https://example.com/manifest/lunchroom_manners.vtt'
            },
          ]
        }
      ];
      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0, annotations },
        initialPlayerState: {},
        ...props,
      });
      render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
      act(() => { abortSpy(); });

      // AbortController has been called
      expect(abortSpy).toHaveBeenCalled();
      // Does not render transcript selector as there are no supplementing annotations
      expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('No valid Transcript(s) found, please check again');
    });
  });

  describe('with props', () => {
    let playerRef = createRef(null);
    test('manifestUrl with supplementing annotations', () => {
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json'
      };
      const tData = [
        { begin: 1.2, end: 21, text: '[music]', tag: 'TIMED_CUE' },
        { begin: 22.2, end: 26.6, text: 'transcript text 1', tag: 'TIMED_CUE' }
      ];
      // Mock custom hook output
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        canvasIndexRef: { current: 0 },
        playerRef: { ...playerRef },
        canvasTranscripts: [{
          filename: "WebVTT Transcript",
          format: "text/vtt",
          id: "WebVTT Transcript-0-0",
          isMachineGen: false,
          title: "WebVTT Transcript",
          url: "http://example.com/webvtt-transcript.vtt"
        }],
        transcript: tData,
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
        }
      }));
      jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
        counts: [], ids: [0, 1], matchingIds: [], results: tData
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props,
      });
      render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript-selector')).toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('transcript_time')[0]).toHaveTextContent('00:01');
      expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent('[music]');
      expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
    });

    test('manifestUrl without supplementing annotations', () => {
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json'
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        canvasIndexRef: { current: 0 },
        isEmpty: true,
        playerRef: { ...playerRef },
        canvasTranscripts: [],
        transcript: [],
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.noTranscript,
          tError: 'No valid Transcript(s) found, please check again.'
        }
      }));
      jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
        counts: [], ids: [0, 1], matchingIds: [], results: []
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props,
      });
      render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('No valid Transcript(s) found, please check again');
    });

    test('no manifestUrl and empty transcripts', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [],
      };
      jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
        canvasIndexRef: { current: 0 },
        isEmpty: true,
        playerRef: { ...playerRef },
        canvasTranscripts: [],
        transcript: [],
        transcriptInfo: {
          tType: transcriptParser.TRANSCRIPT_TYPES.noTranscript,
          tError: 'No valid Transcript(s) found, please check again.'
        }
      }));
      jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
        counts: [], ids: [0, 1], matchingIds: [], results: []
      }));

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
      expect(screen.queryByTestId('transcript-downloader')).not.toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('No valid Transcript(s) found, please check again.');
    });

    test.skip('manifestUrl and transcripts takes precedence', async () => {
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json',
        transcripts: [{
          canvasId: 0,
          items: []
        }],
      };

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        ...props
      });
      render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

      expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
      expect(screen.queryByTestId('transcript-downloader')).not.toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent('No valid Transcript(s) found, please check again.');
    });

    test.skip('manifestUrl with TextualBody supplementing annotations (Aviary)', async () => {
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json'
      };

      const transcriptsList = [
        {
          canvasId: 0,
          items: []
        },
        {
          canvasId: 1,
          items: [
            {
              title: 'Aviary Annotation Style Canvas',
              id: 'Aviary Annotation Style Canvas-1',
              url: 'http://example.com/manifest.json',
              isMachineGen: false,
            }
          ]
        }
      ];
      const readSupplementingAnnotationsMock = jest
        .spyOn(transcriptParser, 'readSupplementingAnnotations')
        .mockReturnValue(transcriptsList);

      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue({
          tData: [
            { begin: 22.2, end: 26.6, text: 'Transcript text line 1', tag: 'TIMED_CUE' },
            { begin: 26.7, end: 31.5, text: 'Transcript text line 2', tag: 'TIMED_CUE' }
          ],
          tUrl: 'http://example.com/manifest.json',
          tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
          tFileExt: 'json',
        });

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: multiSourceManifest, canvasIndex: 1 },
        initialPlayerState: {},
        ...props
      });

      render(
        <>
          <video id="player-id" />
          <TranscriptWithState />
        </>
      );

      await act(() => Promise.resolve());

      await waitFor(() => {
        expect(readSupplementingAnnotationsMock).toHaveBeenCalled();
        expect(parseTranscriptMock).toHaveBeenCalled();
        expect(screen.queryByTestId('transcript-selector')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).not.toBeInTheDocument();
        expect(
          screen.queryAllByTestId('transcript_time')[0]
        ).toHaveTextContent('00:00:22');
        expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
          'Transcript text line 1'
        );
        expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
      });
    });

    describe('showMoreSettings', () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'Transcript 1',
                url: 'http://example.com/transcript.json',
              },
            ],
          },
        ],
      };

      const useTranscripts = {
        canvasIndexRef: { current: 0 },
        isEmpty: false,
        isLoading: false,
        NO_SUPPORT_MSG: 'Transcript format is not supported, please check again.',
        playerRef: { ...playerRef },
        selectTranscript: jest.fn(),
      };

      const eventHandlers = {
        handleKeyDown: jest.fn(),
        handleLinkClicks: jest.fn(),
        handleShowMoreLessClick: jest.fn(),
        handleShowMoreLessKeydown: jest.fn(),
      };

      beforeEach(() => {
        // Mock Canvas, getComputedStyle, and clientWidth of annotationTextRef for a controlled test
        jest.spyOn(window, 'getComputedStyle').mockImplementation((ele) => ({
          lineHeight: '24px',
          fontSize: '16px',
          font: '16px / 24px "Open Sans", sans-serif',
        }));
        Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
          value: jest.fn(() => ({
            measureText: jest.fn((texts) => ({ width: texts.length * 10 })),
          })),
        });
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
          configurable: true,
          get: jest.fn(() => 800),
        });
      });

      describe('for untimed text', () => {
        beforeEach(() => {
          const tData = [
            {
              tag: 'NON_TIMED_LINE', textDisplayed: '<p><strong>Speaker 1:</strong> <em>Lorem ipsum</em> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. </p>',
              text: 'Speaker 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere.', id: 0,
            }
          ];
          // Mock custom hook output
          jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
            ...useTranscripts,
            selectedTranscript: { url: 'http://example.com/transcript.doc', isTimed: false },
            transcript: tData,
            transcriptInfo: {
              isMachineGen: true,
              tType: transcriptParser.TRANSCRIPT_TYPES.docx,
            }
          }));
          jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
            ids: [0], matchingIds: [], results: tData,
          }));
        });

        test('does not display show more button with default value', () => {
          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...props,
          });
          render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);
          expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_content_3')).toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript-cue-show-more-0').length).toBe(0);
        });

        test('does not display show more button with showMoreSettings={ enableShowMore: true }', () => {
          const updatedProps = {
            ...props,
            showMoreSettings: { enableShowMore: true }
          };
          jest.spyOn(hooks, 'useShowMoreOrLess')
            .mockReturnValueOnce({
              ...eventHandlers,
              hasLongerText: false,
              textToShow: '<p><strong>Speaker 1:</strong> <em>Lorem ipsum</em> dolor sit amet, consectetur adipiscing elit, sed do eiusmod \
tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. </p>'
            });

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...updatedProps,
          });
          render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

          expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_content_3')).toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript-cue-show-more-0').length).toBe(0);
        });
      });

      describe('for timed text', () => {
        beforeEach(() => {
          const tData = [
            {
              begin: 1.2, end: 21, tag: 'TIMED_CUE', id: 0,
              text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
mollit anim id est laborum.`
            },
            {
              begin: 22.2, end: 26.6, tag: 'TIMED_CUE', id: 1,
              text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
            },
            {
              begin: 27.3, end: 31, tag: 'TIMED_CUE', id: 2,
              text: `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure \
dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
            },
          ];
          // Mock custom hook output
          jest.spyOn(hooks, 'useTranscripts').mockImplementation(() => ({
            ...useTranscripts,
            transcript: tData,
            transcriptInfo: {
              tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
            }
          }));
          jest.spyOn(searchHooks, 'useFilteredTranscripts').mockImplementation(() => ({
            counts: [],
            ids: [0, 1, 2],
            matchingIds: [],
            results: tData,
          }));
        });

        test('does not display show more button with default value', () => {
          jest.spyOn(hooks, 'useShowMoreOrLess')
            .mockReturnValueOnce({
              ...eventHandlers,
              hasLongerText: false,
              textToShow: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor \
  in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
  sunt in culpa qui officia deserunt mollit anim id est laborum.'
            })
            .mockReturnValueOnce({
              ...eventHandlers,
              hasLongerText: false,
              textToShow: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in \
voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            })
            .mockReturnValueOnce({
              ...eventHandlers,
              hasLongerText: false,
              textToShow: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure \
dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            });

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...props,
          });
          render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

          expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript_time')[0]).toHaveTextContent('00:01');
          expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor \
in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
sunt in culpa qui officia deserunt mollit anim id est laborum.');
          expect(screen.queryAllByTestId('transcript-cue-show-more-0').length).toBe(0);
        });

        test('display show more button for longer text with showMoreSettings={ enableShowMore: true }', () => {
          const updatedProps = {
            ...props,
            showMoreSettings: { enableShowMore: true }
          };

          jest.spyOn(hooks, 'useShowMoreOrLess')
            .mockReturnValueOnce({
              ...eventHandlers,
              hasLongerText: true,
              textToShow: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor \
  in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
  sunt in culpa qui officia deserunt mollit anim id est...'
            })
            .mockReturnValueOnce({
              ...eventHandlers,
              hasLongerText: false,
              textToShow: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in \
voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            })
            .mockReturnValueOnce({
              ...eventHandlers,
              hasLongerText: false,
              textToShow: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure \
dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            });

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...updatedProps,
          });
          render(<><video id="player-id" ref={playerRef} /><TranscriptWithState /></>);

          expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript_time')[0]).toHaveTextContent('00:01');
          expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor \
in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
sunt in culpa qui officia deserunt mollit anim id est...');
          expect(screen.queryAllByTestId('transcript-cue-show-more-0').length).toBe(1);
        });
      });
    });
  });
});
