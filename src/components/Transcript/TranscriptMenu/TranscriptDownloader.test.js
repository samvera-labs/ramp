import React from 'react';
import { render, screen } from '@testing-library/react';
import TranscriptDownloader from './TranscriptDownloader';
import manifest from '@Json/test_data/mahler-symphony-audio';
import {
  withManifestProvider,
  withPlayerProvider,
} from '../../../services/testing-helpers';

// downloadTranscriptMock = jest.fn();

describe('TranscriptDownloader component', () => {
  beforeEach(() => {
    const props = {
      title: 'Transcript test',
      url: 'https://example.com/transcript.json',
    };

    const withPlayer = withPlayerProvider(TranscriptDownloader, { ...props });
    const TranscriptDownloaderComp = withManifestProvider(withPlayer, {
      initialState: { manifest: manifest, canvasIndex: 0 },
    });

    render(<TranscriptDownloaderComp />);
  });

  test('renders successfully', () => {
    expect(screen.getByTestId('transcript-downloader')).toBeInTheDocument();
  });
});
