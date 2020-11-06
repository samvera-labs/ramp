import React from 'react';
import { renderWithRedux } from '../../services/testing-helpers';
import MediaElementContainer from './MediaElementContainer';
import manifestAudio from '../../json/mahler-symphony-audio';
import manifestVideo from '../../json/mahler-symphony-video';

describe('MediaElementContainer component', () => {
  test('reads media type as audio from manifest', () => {
    // with manifest with audio as type
    const { getByTestId, queryByTestId } = renderWithRedux(
      <MediaElementContainer manifest={manifestAudio} />
    );
    expect(getByTestId('mediaelement')).toBeInTheDocument();
    expect(queryByTestId('audio-element')).toBeInTheDocument();
  });

  test('reads media type as video from manifest', () => {
    // with manifest with video as type
    const { getByTestId, queryByTestId } = renderWithRedux(
      <MediaElementContainer manifest={manifestVideo} />
    );
    expect(getByTestId('mediaelement')).toBeInTheDocument();
    expect(queryByTestId('video-element')).toBeInTheDocument();
  });
});
