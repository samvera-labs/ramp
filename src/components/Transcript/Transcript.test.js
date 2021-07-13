import React from 'react';
import { render, screen } from '@testing-library/react';
import Transcript from './Transcript';
import manifest from '@Json/test_data/mahler-symphony-audio';
import {
  withManifestProvider,
  withManifestAndPlayerProvider,
  withPlayerProvider,
} from '../../services/testing-helpers';

describe('Transcript component', () => {
  describe('with trascript data', () => {
    beforeEach(() => {
      const props = {
        transcript: [
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
      };

      const withPlayer = withPlayerProvider(Transcript, {
        ...props,
      });
      const TranscriptComp = withManifestProvider(withPlayer, {
        initialState: { manifest: manifest, canvasIndex: 0 },
      });
      render(<TranscriptComp />);
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
  });

  describe('without transcript data', () => {
    test('does not render', () => {
      const TranscriptComp = withManifestAndPlayerProvider(Transcript, {
        initialState: { manifest: manifest, canvasIndex: 0 },
      });
      render(<TranscriptComp />);
    });
    expect(screen.queryByTestId('transcript_nav')).not.toBeInTheDocument();
  });
});
