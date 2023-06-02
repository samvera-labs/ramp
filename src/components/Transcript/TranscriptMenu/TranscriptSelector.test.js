import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TranscriptSelector from './TranscriptSelector';

const setTranscriptMock = jest.fn();

describe('TranscriptSelector component', () => {
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
    machineGenerated: false,
    noTranscript: false,
    url: 'http://example.com/transcript'
  };
  describe('with default props', () => {
    beforeEach(() => {
      render(<TranscriptSelector {...props} />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('transcript-selector')).toBeInTheDocument();
      expect(
        screen.getByTestId('transcript-select-option')
      ).toBeInTheDocument();
      expect(screen.getByText('Transcript 1')).toBeInTheDocument();
      expect(screen.queryByTestId('transcript-machinegen-msg')).not.toBeInTheDocument();
    });

    test('changes transcript on select', () => {
      const option = screen.getByTestId('transcript-select-option');
      fireEvent.change(option);
      expect(setTranscriptMock).toHaveBeenCalledTimes(1);
    });
  });

  test('with prop noTranscript=true', () => {
    let updatedProps = { ...props, noTranscript: true };
    render(<TranscriptSelector {...updatedProps} />);
    expect(screen.getByTestId('transcript-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('transcript-downloader')).not.toBeInTheDocument();
  });

  test('with prop machineGenerated=true', () => {
    let updatedProps = { ...props, machineGenerated: true };
    render(<TranscriptSelector {...updatedProps} />);
    expect(screen.getByTestId('transcript-selector')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-downloader')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-machinegen-msg')).toHaveTextContent(
      "Machine-generated transcript may contain errors."
    );
  });
});
