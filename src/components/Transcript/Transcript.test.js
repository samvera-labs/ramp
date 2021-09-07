import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Transcript from './Transcript';
import * as transcriptParser from '@Services/transcript-parser';

describe('Transcript component', () => {
  const promise = Promise.resolve();
  describe('with transcript data', () => {
    let parseTranscriptMock;
    beforeEach(async () => {
      const parsedData = {
        tData: [
          {
            start: '00:00:01.200',
            end: '00:00:21.000',
            value: '[music]',
          },
          {
            start: '00:00:22.200',
            end: '00:00:26.600',
            value: 'transcript text 1',
          },
        ],
        tUrl: 'http://example.com/transcript.json',
      };
      parseTranscriptMock = jest
        .spyOn(transcriptParser, 'parseTranscriptData')
        .mockReturnValue(parsedData);
      const props = {
        transcripts: [
          {
            title: 'Transcript 1',
            data: null,
            url: 'http://example.com/transcript.json',
          },
        ],
      };
      render(<Transcript {...props} />);
      await act(() => promise);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('transcript_nav'));
      expect(screen.queryAllByTestId('transcript_text'));
      expect(screen.queryAllByTestId('transcript_time'));
    });

    test('renders time and text', () => {
      expect(parseTranscriptMock).toHaveBeenCalledTimes(1);
      expect(
        screen.queryAllByTestId('transcript_time')[0].children[0]
      ).toHaveTextContent('00:00:01');
      expect(screen.queryAllByTestId('transcript_text')[0]).toHaveTextContent(
        '[music]'
      );
      expect(screen.queryAllByTestId('transcript_item')[0]).toHaveAttribute(
        'starttime'
      );
      expect(screen.queryAllByTestId('transcript_item')[0]).toHaveAttribute(
        'endtime'
      );
    });

    test('transcript item clicks adds highlight', async () => {
      const transcriptItem = screen.queryAllByTestId('transcript_item')[0];
      fireEvent.click(transcriptItem);
      expect(transcriptItem.classList.contains('active'));
    });
  });

  describe('without transcript data', () => {
    test('does not render', () => {
      render(<Transcript />);
    });
    expect(screen.queryByTestId('transcript_nav')).not.toBeInTheDocument();
  });

  describe('renders non timed-text', () => {
    test('in a MS docs file', async () => {
      const props = {
        transcripts: [
          {
            title: 'MS doc transcript',
            data: null,
            url: 'http://example.com/transcript.doc',
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
        transcripts: [
          {
            title: 'Plain text transcript',
            data: null,
            url: 'http://example.com/transcript.txt',
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
