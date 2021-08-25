import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TranscriptSelector from './TranscriptSelector';

const setTranscriptMock = jest.fn();

describe('TranscriptSelector component', () => {
  describe('with trascript data', () => {
    beforeEach(() => {
      const props = {
        setTranscript: setTranscriptMock,
        title: 'Transcript test',
        transcriptData: [
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
          },
          {
            title: 'Transcript 2',
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
              {
                start: '00:00:22.200',
                end: '00:00:26.600',
                value: 'transcript text 2',
              },
            ],
          },
        ],
      };

      render(<TranscriptSelector {...props} />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('transcript-selector')).toBeInTheDocument();
      expect(
        screen.getByTestId('transcript-select-option')
      ).toBeInTheDocument();
      expect(screen.getByText('Transcript 1')).toBeInTheDocument();
    });

    test('changes transcript on select', () => {
      const option = screen.getByTestId('transcript-select-option');
      fireEvent.change(option);
      expect(setTranscriptMock).toHaveBeenCalledTimes(1);
    });
  });
});
