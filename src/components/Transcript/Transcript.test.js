import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Transcript from './Transcript';
import * as transcriptParser from '@Services/transcript-parser';

describe('Transcript component', () => {
  const promise = Promise.resolve();
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

        render(<Transcript {...props} />);
        await act(() => promise);
      });
      test('renders successfully', () => {
        expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
        expect(
          screen.queryAllByTestId('transcript_time')[0].children[0]
        ).toHaveTextContent('00:00:01');
        expect(screen.queryAllByTestId('transcript_text')[0]).toHaveTextContent(
          '[music]'
        );
        const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
        expect(transcriptItem).toHaveAttribute('starttime');
        expect(transcriptItem).toHaveAttribute('endtime');
      });
      test('renders html markdown text', () => {
        const transcriptText = screen.queryAllByTestId('transcript_text')[2];
        expect(transcriptText.innerHTML).toEqual(
          '<strong>transcript text 2</strong>'
        );
        expect(transcriptText).toHaveTextContent('transcript text 2');
      });
      test('highlights transcript item on click', async () => {
        const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
        fireEvent.click(transcriptItem);
        expect(transcriptItem.classList.contains('active')).toBeTruthy();
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

        render(<Transcript {...props} />);
        await act(() => promise);
      });
      test('renders successfully', () => {
        expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('transcript_time')).not.toBeInTheDocument();
        expect(screen.queryAllByTestId('transcript_text')[0]).toHaveTextContent(
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
      });
      test('removes previous item highlight on click', () => {
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

  describe('with invalid data', () => {
    test('renders successfully when empty', () => {
      render(<Transcript playerID="player-id" transcripts={[]} />);
      expect(screen.queryByTestId('transcript_nav')).not.toBeInTheDocument();
    });

    test('renders message for annotations without supplementing motivation', async () => {
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
      const parsedData = {
        tData: [],
        tUrl: 'http://example.com/transcript-manifest.json',
      };
      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue(parsedData);

      render(<Transcript {...props} />);
      await act(() => promise);

      expect(screen.queryByTestId('no-transcript')).toBeInTheDocument();
      expect(screen.getByTestId('no-transcript')).toHaveTextContent(
        'No Transcript was found in the given IIIF Manifest (Canvas)'
      );
    });
  });

  describe('renders plain text', () => {
    test('in a MS docs file', async () => {
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
        tData: null,
        tUrl: 'http://example.com/transcript.doc',
      };
      const parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue(parsedData);

      render(<Transcript {...props} />);
      await act(() => promise);

      expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
      expect(
        screen.queryByTestId('transcript_gdoc-viewer')
      ).toBeInTheDocument();
      expect(screen.getByTestId('transcript_gdoc-viewer').src).toEqual(
        'https://docs.google.com/gview?url=http://example.com/transcript.doc&embedded=true'
      );
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

      render(<Transcript {...props} />);
      await act(() => promise);

      expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
      expect(
        screen.queryByTestId('transcript_gdoc-viewer')
      ).toBeInTheDocument();
      expect(screen.getByTestId('transcript_gdoc-viewer').src).toEqual(
        'https://docs.google.com/gview?url=http://example.com/transcript.txt&embedded=true'
      );
    });
  });
});
