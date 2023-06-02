import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TranscriptDownloader from './TranscriptDownloader';
import * as util from '@Services/utility-helpers';

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    blob: () => ({
      then: jest.fn(() => { }),
    }),
  })
);

describe('TranscriptDownloader component', () => {
  beforeEach(() => {
    const props = {
      fileName: 'Transcript test',
      fileUrl: 'https://example.com/transcript.json',
      machineGenerated: false
    };

    render(<TranscriptDownloader {...props} />);
  });

  test('renders successfully', () => {
    expect(screen.getByTestId('transcript-downloader')).toBeInTheDocument();
  });

  test('downloads a file on click', async () => {
    const fileDownloadMock = jest
      .spyOn(util, 'fileDownload');

    const downloadBtn = screen.getByTestId('transcript-downloader');
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(fileDownloadMock).toHaveBeenCalled();
    });
  });
});
