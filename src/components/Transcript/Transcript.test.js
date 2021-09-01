import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Transcript from './Transcript';

describe('Transcript component', () => {
  describe('with transcript data', () => {
    beforeEach(() => {
      const props = {
        transcripts: [
          {
            title: 'Transcript 1',
            data: [
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
            url: 'http://example.com/transcript.json',
          },
        ],
      };
      render(<Transcript {...props} />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('transcript_nav'));
      expect(screen.queryAllByTestId('transcript_text'));
      expect(screen.queryAllByTestId('transcript_time'));
    });

    test('renders time and text', () => {
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
    test('in a MS docs file', () => {
      const props = {
        transcripts: [
          {
            title: 'MS doc transcript',
            data: null,
            url: 'http://example.com/transcript.doc',
          },
        ],
      };
      render(<Transcript {...props} />);
      expect(screen.queryByTestId('transcript_nav')).toBeInTheDocument();
      expect(
        screen.queryByTestId('transcript_gdoc-viewer')
      ).toBeInTheDocument();
      expect(screen.getByTestId('transcript_gdoc-viewer').src).toEqual(
        'https://docs.google.com/gview?url=http://example.com/transcript.doc&embedded=true'
      );
    });

    test('in a plain text file', () => {
      const props = {
        transcripts: [
          {
            title: 'Plain text transcript',
            data: null,
            url: 'http://example.com/transcript.txt',
          },
        ],
      };
      render(<Transcript {...props} />);
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
