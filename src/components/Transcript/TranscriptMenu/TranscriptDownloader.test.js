import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TranscriptDownloader from './TranscriptDownloader';

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    blob: () => ({
      then: jest.fn(() => {}),
    }),
  })
);

describe('TranscriptDownloader component', () => {
  beforeEach(() => {
    const props = {
      fileName: 'Transcript test',
      fileUrl: 'https://example.com/transcript.json',
    };

    render(<TranscriptDownloader {...props} />);
  });

  test('renders successfully', () => {
    expect(screen.getByTestId('transcript-downloader')).toBeInTheDocument();
  });

  // // FIXME:: fix this test
  // test('downloads a file on click', async () => {
  //   const link = {
  //     click: jest.fn(),
  //   };
  //   global.URL.createObjectURL = jest.fn(
  //     () => 'https://example.com/transcript.json'
  //   );
  //   global.URL.revokeObjectURL = jest.fn();
  //   global.Blob = function (content, options) {
  //     return { content, options };
  //   };

  //   jest.spyOn(document, 'createElement').mockImplementation(() => link);

  //   const downloadBtn = screen.getByTestId('transcript-downloadbtn');
  //   fireEvent.click(downloadBtn);

  //   await waitFor(() => {
  //     expect(link.href).toBe('https://example.com/transcript.json');
  //     expect(link.download).toEqual('Transcript test');
  //     expect(link.click).toHaveBeenCalledTimes(1);
  //   });
  // });
});
