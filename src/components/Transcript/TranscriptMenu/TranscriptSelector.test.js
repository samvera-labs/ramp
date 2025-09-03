import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TranscriptSelector from './TranscriptSelector';

const selectTranscriptMock = jest.fn();

describe('TranscriptSelector component', () => {
  const props = {
    selectTranscript: selectTranscriptMock,
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
    transcriptInfo: {
      title: 'Transcript test',
      id: 'Transcript test-0-0',
      isMachineGen: false,
      tUrl: 'http://example.com/transcript',
      tFileExt: 'json',
      filename: 'transcript.json',
    },
    noTranscript: false,
    setAutoScroll: jest.fn()
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
    });

    test('changes transcript on select', () => {
      const option = screen.getByTestId('transcript-select-option');
      fireEvent.change(option);
      expect(selectTranscriptMock).toHaveBeenCalledTimes(1);
    });
  });

  test('with prop noTranscript=true', () => {
    let updatedProps = { ...props, noTranscript: true };
    render(<TranscriptSelector {...updatedProps} />);
    expect(screen.getByTestId('transcript-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('transcript-downloader')).not.toBeInTheDocument();
  });

  test('with prop machineGenerated=true', () => {
    let updatedProps = {
      ...props,
      transcriptInfo: {
        ...props.transcriptInfo,
        isMachineGen: true
      }
    };
    render(<TranscriptSelector {...updatedProps} />);
    expect(screen.getByTestId('transcript-selector')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-downloader')).toBeInTheDocument();
  });

  test('with time synced transcript content', () => {
    let updatedProps = {
      ...props,
      transcriptInfo: {
        ...props.transcriptInfo,
        tType: 1,
      }
    };
    render(<TranscriptSelector {...updatedProps} />);
    expect(screen.getByTestId('transcript-selector')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-downloader')).toBeInTheDocument();
  });

  test('without time synced transcript content', () => {
    let updatedProps = {
      ...props,
      transcriptInfo: {
        ...props.transcriptInfo,
        tType: 3,
      }
    };
    render(<TranscriptSelector {...updatedProps} />);
    expect(screen.getByTestId('transcript-selector')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-downloader')).toBeInTheDocument();
    expect(screen.queryByTestId('transcript-auto-scroll-check')).not.toBeInTheDocument();
  });
});
