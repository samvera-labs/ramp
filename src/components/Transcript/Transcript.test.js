import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Transcript from './Transcript';
import * as transcriptParser from '@Services/transcript-parser';
import { withManifestAndPlayerProvider } from '@Services/testing-helpers';
import lunchroomManners from '@TestData/lunchroom-manners';
import multiSourceManifest from '@TestData/multi-source-manifest';

describe('Transcript component', () => {
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

  describe('with valid transcript data', () => {
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

    describe('with timed-text', () => {
      let parseTranscriptMock;
      beforeEach(async () => {
        const parsedData = {
          tData: [
            {
              begin: 1.2,
              end: 21,
              text: '[music]',
              tag: 'TIMED_CUE'
            },
            {
              begin: 22.2,
              end: 26.6,
              text: 'transcript text 1',
              tag: 'TIMED_CUE'
            },
            {
              begin: 27.3,
              end: 31,
              text: '<strong>transcript text 2</strong>',
              tag: 'TIMED_CUE'
            },
          ],
          tUrl: 'http://example.com/transcript.json',
          tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
          tFileExt: 'json',
        };
        parseTranscriptMock = jest
          .spyOn(transcriptParser, 'parseTranscriptData')
          .mockReturnValue(parsedData);

        const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
          initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
          initialPlayerState: {},
          ...props,
        });

        render(
          <>
            <video id="player-id" />
            <TranscriptWithState />
          </>
        );

        await act(() => Promise.resolve());
      });

      test('renders successfully', async () => {
        await waitFor(() => {
          // is called on initial load and canvasIndex updates
          expect(parseTranscriptMock).toHaveBeenCalled();
          expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
          expect(
            screen.queryAllByTestId('transcript_time')[0]
          ).toHaveTextContent('00:01');
          expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
            '[music]'
          );
          expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
        });
      });

      test('renders html markdown text', async () => {
        await waitFor(() => {
          const transcriptText = screen.queryAllByTestId('transcript_timed_text')[2];
          expect(transcriptText.innerHTML).toEqual(
            '<strong>transcript text 2</strong>'
          );
          expect(transcriptText).toHaveTextContent('transcript text 2');
        });
      });

      test('highlights cue when clicking on cue\'s timestamp', async () => {
        await waitFor(() => {
          const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
          expect(transcriptItem.children).toHaveLength(2);
          expect(transcriptItem.children[0].textContent).toEqual('[00:00:01]');
          expect(transcriptItem.children[1].textContent).toEqual('[music]');
          expect(transcriptItem.classList.contains('active')).toBeFalsy();
          // Click on the cue's timestamp
          fireEvent.click(transcriptItem.children[0]);
          expect(transcriptItem.classList.contains('active')).toBeTruthy();
        });
      });

      test('does nothing when clicking on the cue\'s text', async () => {
        await waitFor(() => {
          const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
          fireEvent.click(transcriptItem.children[1]);
          expect(transcriptItem.classList.contains('active')).toBeFalsy();
        });
      });
    });

    describe('with WebVTT', () => {
      let parseTranscriptMock;
      const parsedData = {
        tData: [
          {
            begin: 1.2,
            end: 21,
            text: '[music]',
            tag: 'TIMED_CUE'
          },
          {
            begin: 22.2,
            end: 26.6,
            text: 'transcript text 1',
            tag: 'TIMED_CUE'
          },
          {
            begin: 27.3,
            end: 31,
            text: '<strong>transcript text 2</strong>',
            tag: 'TIMED_CUE'
          },
        ],
        tUrl: 'http://example.com/transcript.vtt',
        tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
        tFileExt: 'vtt',
      };

      describe('with showNotes = false (default)', () => {
        beforeEach(async () => {
          parseTranscriptMock = jest
            .spyOn(transcriptParser, 'parseTranscriptData')
            .mockReturnValue(parsedData);

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...props,
          });

          render(
            <>
              <video id="player-id" />
              <TranscriptWithState />
            </>
          );

          await act(() => Promise.resolve());
        });

        test('renders successfully', async () => {
          await waitFor(() => {
            expect(parseTranscriptMock).toHaveBeenCalled();
            expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
            expect(screen.queryAllByTestId('transcript_item')).toHaveLength(3);
            expect(screen.queryAllByTestId('transcript_note')).toHaveLength(0);
            expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
          });
        });

        test('does not render comment in the header block', async () => {
          await waitFor(() => {
            expect(screen.queryAllByTestId('transcript_note').length).toBe(0);
          });
        });

        test('renders the rest of the cues with timestamps', async () => {
          await waitFor(() => {
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
        });

        test('highlights cue when clicking on the cue\'s timestamp', async () => {
          await waitFor(() => {
            const transcriptItem = screen.queryAllByTestId('transcript_item')[1];
            expect(transcriptItem.children).toHaveLength(2);
            expect(transcriptItem.children[0].textContent).toEqual('[00:00:22]');
            expect(transcriptItem.children[1].textContent).toEqual('transcript text 1');
            // Click on the cue's timestamp
            fireEvent.click(transcriptItem.children[0]);
            expect(transcriptItem.classList.contains('active')).toBeTruthy();
          });
        });

        test('does nothing when clicking on the cue\'s text', async () => {
          await waitFor(() => {
            const transcriptItem = screen.queryAllByTestId('transcript_item')[1];
            fireEvent.click(transcriptItem.children[1]);
            expect(transcriptItem.classList.contains('active')).toBeFalsy();
          });
        });
      });

      describe('with showNotes = true', () => {
        const updatedProps = {
          ...props,
          showNotes: true,
        };
        const updatedParsedData = {
          ...parsedData,
          tData: [
            {
              begin: 0,
              end: 0,
              text: 'NOTE<br />This is a multi-line comment.<br />Following is a list of cues.',
              tag: 'NOTE'
            },
            ...parsedData.tData,
            {
              begin: 32,
              end: 36,
              text: 'NOTE<br />This is the end of the cues.<br />',
              tag: 'NOTE'
            },
          ],
        };

        beforeEach(async () => {
          parseTranscriptMock = jest
            .spyOn(transcriptParser, 'parseTranscriptData')
            .mockReturnValue(updatedParsedData);

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...updatedProps,
          });

          render(
            <>
              <video id="player-id" />
              <TranscriptWithState />
            </>
          );

          await act(() => Promise.resolve());
        });

        test('renders successfully', async () => {
          await waitFor(() => {
            expect(parseTranscriptMock).toHaveBeenCalled();
            expect(screen.queryAllByTestId('transcript_note')).toHaveLength(2);
            expect(screen.queryAllByTestId('transcript_item')).toHaveLength(3);
          });
        });

        test('renders comment in the header block', async () => {
          await waitFor(() => {
            expect(screen.queryAllByTestId('transcript_note')[0]).toHaveTextContent(
              'NOTEThis is a multi-line comment.Following is a list of cues.'
            );
          });
        });

        test('renders NOTE in the WebVTT body', async () => {
          await waitFor(() => {
            expect(screen.queryAllByTestId('transcript_note')[1]).toHaveTextContent(
              'NOTEThis is the end of the cues.'
            );
          });
        });
      });

      describe('with showMetadata = false (default)', () => {
        beforeEach(async () => {
          parseTranscriptMock = jest
            .spyOn(transcriptParser, 'parseTranscriptData')
            .mockReturnValue(parsedData);

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...props,
          });

          render(
            <>
              <video id="player-id" />
              <TranscriptWithState />
            </>
          );

          await act(() => Promise.resolve());
        });

        test('renders successfully', async () => {
          await waitFor(() => {
            expect(parseTranscriptMock).toHaveBeenCalled();
            expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
            expect(screen.queryAllByTestId('transcript_item')).toHaveLength(3);
            expect(screen.queryAllByTestId('transcript_metadata')).toHaveLength(0);
            expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
          });
        });

        test('does not render metadata in the header block', async () => {
          await waitFor(() => {
            expect(screen.queryAllByTestId('transcript_metadata').length).toBe(0);
          });
        });
      });

      describe('with showMetadata = true', () => {
        const updatedProps = {
          ...props,
          showMetadata: true,
        };
        const updatedParsedData = {
          ...parsedData,
          tData: [
            {
              begin: 0,
              end: 0,
              text: 'Type: Caption<br />Language: eng<br />File Creation Date: 2025-06-20 10:56:44.008719<br />',
              tag: 'METADATA'
            },
            ...parsedData.tData,
          ],
        };

        beforeEach(async () => {
          parseTranscriptMock = jest
            .spyOn(transcriptParser, 'parseTranscriptData')
            .mockReturnValue(updatedParsedData);

          const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
            initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
            initialPlayerState: {},
            ...updatedProps,
          });

          render(
            <>
              <video id="player-id" />
              <TranscriptWithState />
            </>
          );

          await act(() => Promise.resolve());
        });

        test('renders successfully', async () => {
          await waitFor(() => {
            expect(parseTranscriptMock).toHaveBeenCalled();
            expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
            expect(screen.queryAllByTestId('transcript_item')).toHaveLength(3);
            expect(screen.queryAllByTestId('transcript_metadata')).toHaveLength(1);
            expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
          });
        });

        test('renders metadata in the header block', async () => {
          await waitFor(() => {
            expect(screen.queryAllByTestId('transcript_metadata')[0]).toHaveTextContent(
              'Type: CaptionLanguage: engFile Creation Date: 2025-06-20 10:56:44.008719'
            );
          });
        });
      });
    });

    describe('with transcript as an annotation list', () => {
      let parseTranscriptMock;
      beforeEach(async () => {
        const parsedData = {
          tData: [
            {
              begin: null,
              end: null,
              text: '[music]',
              tag: 'TIMED_CUE'
            },
            {
              begin: null,
              end: null,
              text: 'transcript text 1',
              tag: 'TIMED_CUE'
            },
            {
              begin: null,
              end: null,
              text: '<strong>transcript text 2</strong>',
              tag: 'TIMED_CUE'
            },
          ],
          tUrl: 'http://example.com/transcript.json',
          tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
          tFileExt: 'json',
        };
        parseTranscriptMock = jest
          .spyOn(transcriptParser, 'parseTranscriptData')
          .mockReturnValue(parsedData);

        const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
          initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
          initialPlayerState: {},
          ...props,
        });

        render(
          <>
            <video id="player-id" />
            <TranscriptWithState />
          </>
        );

        await act(() => Promise.resolve());
      });

      test('renders successfully', async () => {
        await waitFor(() => {
          expect(parseTranscriptMock).toHaveBeenCalled();
          expect(screen.queryByTestId('transcript_content_1')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_time')).not.toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
            '[music]'
          );
          const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
          expect(transcriptItem).not.toHaveAttribute('starttime');
          expect(transcriptItem).not.toHaveAttribute('endtime');
        });
      });

      test('highlights item on click', async () => {
        await waitFor(() => {
          const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
          fireEvent.click(transcriptItem);
          expect(transcriptItem.classList.contains('active')).toBeTruthy();
          const transcriptItem1 = screen.queryAllByTestId('transcript_item')[1];
          expect(transcriptItem1.classList.contains('active')).toBe(false);
        });
      });

      test('removes previous item highlight on click', async () => {
        await waitFor(() => {
          // click on an item
          const transcriptItem1 = screen.queryAllByTestId('transcript_item')[0];
          fireEvent.click(transcriptItem1);
          expect(transcriptItem1.classList.contains('active')).toBeTruthy();

          const transcriptItem2 = screen.queryAllByTestId('transcript_item')[1];
          // click on a second item
          fireEvent.click(transcriptItem2);
          expect(transcriptItem2.classList.contains('active')).toBeTruthy();
          expect(transcriptItem1.classList.contains('active')).toBeFalsy();
        });
      });
    });

    describe('renders plain text', () => {
      test('in a MS docs file', async () => {
        const originalError = console.error.bind(console.error);
        console.error = jest.fn();
        const props = {
          playerID: 'player-id',
          transcripts: [
            {
              canvasId: 0,
              items: [
                {
                  title: 'MS doc transcript (machine-generated)',
                  url: 'http://example.com/transcript.doc',
                },
              ],
            },
          ],
        };
        const parsedData = {
          tData: [
            '<p><strong>Speaker 1:</strong> <em>Lorem ipsum</em> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. </p>',
          ],
          tUrl: 'http://example.com/transcript.doc',
          tType: transcriptParser.TRANSCRIPT_TYPES.docx,
          tFileExt: 'doc',
        };
        const parseTranscriptMock = jest
          .spyOn(transcriptParser, 'parseTranscriptData')
          .mockReturnValue(parsedData);


        const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
          initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
          initialPlayerState: {},
          ...props,
        });

        render(
          <>
            <video id="player-id" />
            <TranscriptWithState />
          </>
        );

        await act(() => Promise.resolve());

        await waitFor(() => {
          expect(parseTranscriptMock).toHaveBeenCalled();
          expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_content_3')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript-machinegen-msg')).toBeInTheDocument();
          expect(screen.getByTestId('transcript-machinegen-msg')).toHaveTextContent(
            "Machine-generated transcript may contain errors."
          );
          console.error = originalError;
        });
      });

      test('in a plain text file', async () => {
        const props = {
          playerID: 'player-id',
          transcripts: [
            {
              canvasId: 0,
              items: [
                {
                  title: 'Plain text transcript (Machine Generated)',
                  url: 'http://example.com/transcript.txt',
                },
              ],
            },
          ],
        };
        const parsedData = {
          tData: ["1<br>00:00:01.200 --&gt; 00:00:21.000<br>[music]<br><br>2<br>00:00:22.200 --&gt; 00:00:26.600<br>Just before lunch one day, a puppet show <br>was put on at school.<br><br>3<br>00:00:26.700 --&gt; 00:00:31.500<br>It was called \"Mister Bungle Goes to Lunch\".<br><br>"],
          tUrl: 'http://example.com/transcript.txt',
          tType: transcriptParser.TRANSCRIPT_TYPES.plainText,
          tFileExt: 'txt',
        };
        const parseTranscriptMock = jest
          .spyOn(transcriptParser, 'parseTranscriptData')
          .mockReturnValue(parsedData);


        const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
          initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
          initialPlayerState: {},
          ...props,
        });

        render(
          <>
            <video id="player-id" />
            <TranscriptWithState />
          </>
        );

        await act(() => Promise.resolve());

        await waitFor(() => {
          expect(parseTranscriptMock).toHaveBeenCalled();
          expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_content_2')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript-machinegen-msg')).toBeInTheDocument();
          expect(screen.getByTestId('transcript-machinegen-msg')).toHaveTextContent(
            "Machine-generated transcript may contain errors."
          );
        });
      });
    });
  });

  describe('renders a message for', () => {
    test('an empty list of transcripts', () => {
      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
        initialPlayerState: {},
        playerID: "player-id",
        transcripts: [],
      });

      render(
        <>
          <video id="player-id" />
          <TranscriptWithState />
        </>
      );

      expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'No valid Transcript(s) found, please check again'
      );
    });

    test('an empty transcript item list', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [],
          },
        ],
      };

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
      expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
      expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'No valid Transcript(s) found, please check again'
      );
    });

    test('undefined transcript url', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'Transcript 0',
                url: undefined,
              },
            ],
          },
        ],
      };
      const parsedData = {
        tData: [],
        tUrl: undefined,
        tType: transcriptParser.TRANSCRIPT_TYPES.invalid,
      };
      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue(parsedData);

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(parseTranscriptMock).toHaveBeenCalled();
        expect(screen.queryByTestId('transcript_content_-1')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'Invalid URL for transcript, please check again.'
        );
      });
    });

    test('invalid transcript url', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'Transcript 1',
                url: 'www.example.com/transcript.json',
              },
            ],
          },
        ],
      };

      const parsedData = {
        tData: [],
        tUrl: 'www.example.com/transcript.json',
        tType: transcriptParser.TRANSCRIPT_TYPES.invalid,
      };
      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue(parsedData);

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(parseTranscriptMock).toHaveBeenCalled();
        expect(screen.queryByTestId('transcript_content_-1')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'Invalid URL for transcript, please check again.'
        );
      });
    });

    test('invalid transcript file type: .png', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'Image Transcript',
                url: 'https://example.com/transcript_image.png',
              },
            ],
          },
        ],
      };

      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue({
          tData: [],
          tUrl: 'https://example.com/transcript_image.png',
          tType: transcriptParser.TRANSCRIPT_TYPES.noSupport,
        });

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(parseTranscriptMock).toHaveBeenCalled();
        expect(screen.queryByTestId('transcript_content_-2')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'Transcript format is not supported, please check again.'
        );
      });
    });

    test('invalid transcript file format: text/html', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'Doc Transcript',
                url: 'https://example.com/section/2/supplemental_files/12',
              },
            ],
          },
        ],
      };

      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue({
          tData: [],
          tUrl: 'https://example.com/section/2/supplemental_files/12',
          tType: transcriptParser.TRANSCRIPT_TYPES.noSupport,
        });

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(parseTranscriptMock).toHaveBeenCalled();
        expect(screen.queryByTestId('transcript_content_-2')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'Transcript format is not supported, please check again.'
        );
      });
    });

    test('manifest without supplementing motivation', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'Transcript 2',
                url: 'http://example.com/transcript-manifest.json',
              },
            ],
          },
        ],
      };

      const parsedData = {
        tData: [],
        tUrl: 'http://example.com/transcript-manifest.json',
        tType: transcriptParser.TRANSCRIPT_TYPES.noTranscript,
      };
      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue(parsedData);

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(parseTranscriptMock).toHaveBeenCalled();
        expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'No valid Transcript(s) found, please check again.'
        );
      });
    });

    test('invalid WebVTT file', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'WebVTT Transcript',
                url: 'https://example.com/lunchroom_manners.vtt',
              },
            ],
          },
        ],
      };

      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue({
          tData: [],
          tUrl: 'https://example.com/lunchroom_manners.vtt',
          tType: transcriptParser.TRANSCRIPT_TYPES.invalidVTT,
        });

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(parseTranscriptMock).toHaveBeenCalled();
        expect(screen.queryByTestId('transcript_content_-3')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'Invalid WebVTT file, please check again.'
        );
      });
    });

    test('WebVTT file with invalid timestamps', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'WebVTT Transcript',
                url: 'https://example.com/lunchroom_manners.vtt',
              },
            ],
          },
        ],
      };

      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue({
          tData: [],
          tUrl: 'https://example.com/lunchroom_manners.vtt',
          tType: transcriptParser.TRANSCRIPT_TYPES.invalidTimestamp,
        });

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(parseTranscriptMock).toHaveBeenCalled();
        expect(screen.queryByTestId('transcript_content_-4')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'Invalid timestamp format in cue(s), please check again.'
        );
      });
    });
  });

  describe('parses transcript information', () => {
    test('from annotations when it is present in state', async () => {
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
      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue({
          tData: [
            { begin: 1.2, end: 21, text: '[music]', tag: 'TIMED_CUE' },
            { begin: 22.2, end: 26.6, text: 'transcript text 1', tag: 'TIMED_CUE' }
          ],
          tUrl: 'http://example.com/webvtt-transcript.vtt',
          tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
          tFileExt: 'vtt',
        });
      const annotations = [
        {
          canvasIndex: 0,
          annotationSets: [
            {
              canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
              filename: 'lunchroom-manners.vtt',
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
        ...props
      });

      render(
        <>
          <video id="player-id" />
          <TranscriptWithState />
        </>
      );

      await act(async () => {
        // Make sure useEffect runs
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      act(() => { abortSpy(); });

      // Fetch request is aborted
      expect(abortSpy).toHaveBeenCalled();
      // Transcript information rendered from annotations
      expect(screen.queryByTestId('transcript-selector')).toBeInTheDocument();
      expect(screen.getByTestId('transcript-select-option')).toBeInTheDocument();
      expect(screen.getByText('Captions in WebVTT format')).toBeInTheDocument();
      // Transcript content is fetched and displayed in the component
      expect(parseTranscriptMock).toHaveBeenCalled();
      expect(parseTranscriptMock).toHaveBeenCalledWith(
        'https://example.com/manifest/lunchroom_manners.vtt',
        'text/vtt',
        0, false, false);
      expect(
        screen.queryAllByTestId('transcript_time')[0]
      ).toHaveTextContent('00:01');
      expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
        '[music]'
      );
    });
  });

  describe('with props', () => {
    test('manifestUrl with supplementing annotations', async () => {
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json'
      };

      const transcriptsList = [
        {
          canvasId: 0,
          items: [
            {
              title: 'WebVTT Transcript',
              id: 'WebVTT Transcript-0-0',
              url: 'http://example.com/webvtt-transcript.vtt',
              isMachineGen: false,
            }
          ]
        },
        {
          canvasId: 1,
          items: []
        },
        {
          canvasId: 2,
          items: [
            {
              title: 'MS Doc',
              id: 'MS Doc-2-0',
              url: 'http://example.com/ms-doc.docx',
              isMachineGen: true
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
            { begin: 1.2, end: 21, text: '[music]', tag: 'TIMED_CUE' },
            { begin: 22.2, end: 26.6, text: 'transcript text 1', tag: 'TIMED_CUE' }
          ],
          tUrl: 'http://example.com/webvtt-transcript.vtt',
          tType: transcriptParser.TRANSCRIPT_TYPES.timedText,
          tFileExt: 'vtt',
        });

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        ).toHaveTextContent('00:01');
        expect(screen.queryAllByTestId('transcript_timed_text')[0]).toHaveTextContent(
          '[music]'
        );
        expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
      });
    });

    test('manifestUrl without supplementing annotations', async () => {
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json'
      };

      const readSupplementingAnnotationsMock = jest
        .spyOn(transcriptParser, 'readSupplementingAnnotations')
        .mockReturnValue([]);

      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue({});

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        // on initial load and canvas index update
        expect(readSupplementingAnnotationsMock).toHaveBeenCalled();
        expect(parseTranscriptMock).not.toHaveBeenCalled();
        expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
        expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'No valid Transcript(s) found, please check again'
        );
      });
    });

    test('manifestUrl and transcripts takes precedence', async () => {
      const props = {
        playerID: 'player-id',
        manifestUrl: 'http://example.com/manifest.json',
        transcripts: [{
          canvasId: 0,
          items: []
        }],
      };

      const readSupplementingAnnotationsMock = jest
        .spyOn(transcriptParser, 'readSupplementingAnnotations');


      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(readSupplementingAnnotationsMock).not.toHaveBeenCalled();
        expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
        expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'No valid Transcript(s) found, please check again'
        );
      });
    });

    test('no manifestUrl and empty transcripts', async () => {
      const originalError = console.error.bind(console.error);
      console.error = jest.fn();
      const props = {
        playerID: 'player-id',
        transcripts: [],
      };

      const TranscriptWithState = withManifestAndPlayerProvider(Transcript, {
        initialManifestState: { manifest: lunchroomManners, canvasIndex: 0 },
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
        expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript_content_0')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
        expect(screen.queryByTestId('transcript-downloader')).not.toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'No valid Transcript(s) found, please check again.');
        console.error = originalError;
      });
    });

    test('manifestUrl with TextualBody supplementing annotations (Aviary)', async () => {
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
  });
});
