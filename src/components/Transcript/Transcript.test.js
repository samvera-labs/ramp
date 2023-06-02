import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Transcript from './Transcript';
import * as transcriptParser from '@Services/transcript-parser';

describe('Transcript component', () => {
  let promise;
  beforeEach(() => {
    promise = Promise.resolve();
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
            },
            {
              begin: 22.2,
              end: 26.6,
              text: 'transcript text 1',
            },
            {
              begin: 27.3,
              end: 31,
              text: '<strong>transcript text 2</strong>',
            },
          ],
          tUrl: 'http://example.com/transcript.json',
        };
        parseTranscriptMock = jest
          .spyOn(transcriptParser, 'parseTranscriptData')
          .mockReturnValue(parsedData);

        render(
          <React.Fragment>
            <video id="player-id" />
            <Transcript {...props} />
          </React.Fragment>
        );
        await act(() => promise);
      });
      test('renders successfully', async () => {
        await waitFor(() => {
          expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
          expect(
            screen.queryAllByTestId('transcript_time')[0].children[0]
          ).toHaveTextContent('00:01');
          expect(screen.queryAllByTestId('transcript_text')[0]).toHaveTextContent(
            '[music]'
          );
          const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
          expect(transcriptItem).toHaveAttribute('starttime');
          expect(transcriptItem).toHaveAttribute('endtime');
        });
      });

      test('renders html markdown text', async () => {
        await waitFor(() => {
          const transcriptText = screen.queryAllByTestId('transcript_text')[2];
          expect(transcriptText.innerHTML).toEqual(
            '<strong>transcript text 2</strong>'
          );
          expect(transcriptText).toHaveTextContent('transcript text 2');
        });
      });

      test('highlights transcript item on click', async () => {
        await waitFor(() => {
          const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
          fireEvent.click(transcriptItem);
          expect(transcriptItem.classList.contains('active')).toBeTruthy();
        });
      });
    });

    describe('non timed-text', () => {
      let parseTranscriptMock;
      beforeEach(async () => {
        const parsedData = {
          tData: [
            {
              begin: null,
              end: null,
              text: '[music]',
            },
            {
              begin: null,
              end: null,
              text: 'transcript text 1',
            },
            {
              begin: null,
              end: null,
              text: '<strong>transcript text 2</strong>',
            },
          ],
          tUrl: 'http://example.com/transcript.json',
        };
        parseTranscriptMock = jest
          .spyOn(transcriptParser, 'parseTranscriptData')
          .mockReturnValue(parsedData);

        render(
          <React.Fragment>
            <video id="player-id" />
            <Transcript {...props} />
          </React.Fragment>
        );
        await act(() => promise);
      });

      test('renders successfully', async () => {
        await waitFor(() => {
          expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
          expect(screen.queryByTestId('transcript_time')).not.toBeInTheDocument();
          expect(screen.queryAllByTestId('transcript_text')[0]).toHaveTextContent(
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
                  title: 'MS doc transcript',
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
        };
        const parseTranscriptMock = jest
          .spyOn(transcriptParser, 'parseTranscriptData')
          .mockReturnValue(parsedData);

        render(
          <React.Fragment>
            <video id="player-id" />
            <Transcript {...props} />
          </React.Fragment>
        );
        await act(() => promise);

        await waitFor(() => {
          expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
          expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_docs')).toBeInTheDocument();
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
                  title: 'Plain text transcript',
                  url: 'http://example.com/transcript.txt',
                },
              ],
            },
          ],
        };
        const parsedData = {
          tData: null,
          tUrl: 'http://example.com/transcript.txt',
        };
        const parseTranscriptMock = jest
          .spyOn(transcriptParser, 'parseTranscriptData')
          .mockReturnValue(parsedData);

        render(
          <React.Fragment>
            <video id="player-id" />
            <Transcript {...props} />
          </React.Fragment>
        );
        await act(() => promise);

        await waitFor(() => {
          expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
          expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
          expect(screen.queryByTestId('transcript_viewer')).toBeInTheDocument();
          expect(screen.getByTestId('transcript_viewer').src).toEqual(
            'http://example.com/transcript.txt'
          );
        });
      });
    });
  });

  describe('renders a message with invalid transcript data', () => {
    test('empty list of transcripts', () => {
      render(<Transcript playerID="player-id" transcripts={[]} />);
      expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'No valid Transcript(s) found, please check again'
      );
    });

    test('empty transcript item list', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [],
          },
        ],
      };
      render(
        <React.Fragment>
          <video id="player-id" />
          <Transcript {...props} />
        </React.Fragment>
      );
      await act(() => promise);
      expect(screen.queryByTestId('transcript_menu')).not.toBeInTheDocument();
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'No valid Transcript(s) found, please check again'
      );
    });

    test('manifest without supplementing motivation', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'Transcript 1',
                url: 'http://example.com/transcript-manifest.json',
              },
            ],
          },
        ],
      };
      const checkManifestAnnotationMock = jest
        .spyOn(transcriptParser, 'checkManifestAnnotations')
        .mockReturnValue([{
          title: 'Manifest without supplementing',
          validity: 0,
          url: 'http://example.com/transcript-manifest.json'
        }]);

      render(
        <React.Fragment>
          <video id="player-id" />
          <Transcript {...props} />
        </React.Fragment>
      );
      await act(() => promise);

      await waitFor(() => {
        expect(checkManifestAnnotationMock).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'No valid Transcript(s) found, please check again.'
        );
      });
    });

    test('undefined transcript url', async () => {
      const props = {
        playerID: 'player-id',
        transcripts: [
          {
            canvasId: 0,
            items: [
              {
                title: 'Transcript 1',
                url: undefined,
              },
            ],
          },
        ],
      };
      const checkManifestAnnotationMock = jest
        .spyOn(transcriptParser, 'checkManifestAnnotations')
        .mockReturnValue([{
          title: 'Transcript 1',
          validity: -1,
          url: undefined
        }]);

      render(
        <React.Fragment>
          <video id="player-id" />
          <Transcript {...props} />
        </React.Fragment>
      );
      await act(() => promise);

      expect(checkManifestAnnotationMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'Invalid URL for transcript, please check again.'
      );
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
      const checkManifestAnnotationMock = jest
        .spyOn(transcriptParser, 'checkManifestAnnotations')
        .mockReturnValue([{
          title: 'Transcript 1',
          validity: -1,
          url: 'www.example.com/transcript.json'
        }]);

      render(
        <React.Fragment>
          <video id="player-id" />
          <Transcript {...props} />
        </React.Fragment>
      );
      await act(() => promise);

      expect(checkManifestAnnotationMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'Invalid URL for transcript, please check again.'
      );
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
      const checkManifestAnnotationMock = jest
        .spyOn(transcriptParser, 'checkManifestAnnotations')
        .mockReturnValue([{
          title: 'Image transcript - no transcript',
          validity: 0,
          url: 'https://example.com/transcript_image.png'
        }]);

      render(
        <React.Fragment>
          <video id="player-id" />
          <Transcript {...props} />
        </React.Fragment>
      );
      await act(() => promise);

      await waitFor(() => {
        expect(checkManifestAnnotationMock).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'No valid Transcript(s) found, please check again'
        );
      });
    });
  });

  describe('without transcript data', () => {
    it('doesn\'t display transcript select and download', async () => {
      const originalError = console.error.bind(console.error);
      console.error = jest.fn();
      const props = {
        playerID: 'player-id',
        transcripts: [],
      };

      render(
        <React.Fragment>
          <video id="player-id" />
          <Transcript {...props} />
        </React.Fragment>
      );
      await act(() => promise);

      await waitFor(() => {
        expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
        expect(screen.queryByTestId('transcript-selector')).not.toBeInTheDocument();
        expect(screen.queryByTestId('transcript-downloader')).not.toBeInTheDocument();
        expect(screen.getByTestId('no-transcript')).toHaveTextContent(
          'No valid Transcript(s) found, please check again.');
        console.error = originalError;
      });
    });
  });
});
