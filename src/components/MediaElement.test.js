import React from 'react';
import { renderWithRedux } from '../../services/testing-helpers';
import MediaElement from './MediaElement';
import { fireEvent } from '@testing-library/react';

describe('MediaElement component', () => {
  const sources = [
    {
      src:
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/medium/480Kbps.mp4',
      format: 'audio/mp4',
      quality: 'medium',
    },
    {
      src:
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/auto/128Kbps.mp4',
      format: 'audio/mp4',
      quality: 'auto',
    },
    {
      src:
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/720Kbps.mp4',
      format: 'audio/mp4',
      quality: 'high',
    },
  ];

  const tracks = [
    {
      id:
        'https://www.iandevlin.com/html5test/webvtt/upc-video-subtitles-en.vtt',
      type: 'Text',
      format: 'application/webvtt',
      label: 'subtitles',
    },
  ];

  const videoProps = {
    id: 'avln-mediaelement-component',
    mediaType: 'video',
    preload: 'auto',
    width: 480,
    height: 360,
    poster: '',
    crossorigin: 'anonymous',
    sources: JSON.stringify(sources),
    tracks: JSON.stringify(tracks),
    options: JSON.stringify({}),
  };

  const audioProps = {
    id: 'avln-mediaelement-component',
    mediaType: 'audio',
    preload: 'auto',
    width: 780,
    height: 200,
    poster: '',
    crossorigin: 'anonymous',
    sources: JSON.stringify(sources),
    tracks: JSON.stringify([]),
    options: JSON.stringify({}),
  };

  test('renders a video player successfully', () => {
    const { queryByTestId } = renderWithRedux(<MediaElement {...videoProps} />);
    expect(queryByTestId('video-element')).toBeInTheDocument();
    expect(queryByTestId('audio-element')).not.toBeInTheDocument();
  });

  test('renders an audio player successfully', () => {
    const { queryByTestId } = renderWithRedux(<MediaElement {...audioProps} />);
    expect(queryByTestId('video-element')).not.toBeInTheDocument();
    expect(queryByTestId('audio-element')).toBeInTheDocument();
  });

  test('passes through the correct props', () => {
    const { queryByTestId } = renderWithRedux(<MediaElement {...videoProps} />);
    const videoElement = queryByTestId('video-element');
    expect(videoElement).toHaveAttribute('height', '360');
    expect(videoElement).toHaveAttribute('width', '480');
    expect(videoElement).toHaveAttribute(
      'id',
      expect.stringContaining(audioProps.id)
    );
  });

  test('renders the correct media source elements', () => {
    const { queryByTestId } = renderWithRedux(<MediaElement {...videoProps} />);
    const videoElement = queryByTestId('video-element');
    expect(videoElement.querySelectorAll('source').length).toEqual(3);
  });

  test('renders auto quality by default', () => {
    const { queryByTestId } = renderWithRedux(<MediaElement {...audioProps} />);
    expect(queryByTestId('audio-element').src).toEqual(
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/auto/128Kbps.mp4'
    );
  });

  test('renders source for the selected quality', () => {
    const { getByTestId } = renderWithRedux(<MediaElement {...audioProps} />);

    // auto quality by default
    expect(getByTestId('audio-element').src).toEqual(
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/auto/128Kbps.mp4'
    );

    // simulate quality selection
    fireEvent.click(getByTestId('quality-btn'));
    fireEvent.click(getByTestId('quality-mep_5-qualities-high'));

    // selected medium quality
    expect(getByTestId('audio-element').src).toEqual(
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/720Kbps.mp4'
    );
  });

  test('do not render captions for audio player', () => {
    const { queryByTestId } = renderWithRedux(<MediaElement {...audioProps} />);

    expect(queryByTestId('audio-element')).toBeInTheDocument();
    expect(queryByTestId('captions-btn')).not.toBeInTheDocument();
  });

  test('renders captions by default for video player', () => {
    const { container, getByTestId } = renderWithRedux(
      <MediaElement {...videoProps} />
    );

    expect(getByTestId('video-element')).toBeInTheDocument();

    const captionBtn = container.querySelector('.mejs__captions-button');
    expect(captionBtn).toBeInTheDocument();
    expect(
      captionBtn.classList.contains('mejs__captions-enabled')
    ).toBeTruthy();
  });

  test('turns on/off captions', () => {
    const { container, getByTestId } = renderWithRedux(
      <MediaElement {...videoProps} />
    );

    expect(getByTestId('video-element')).toBeInTheDocument();

    const captionBtn = container.querySelector('.mejs__captions-button');
    expect(captionBtn).toBeInTheDocument();
    // simulates captions button click
    fireEvent.click(captionBtn);
    expect(captionBtn.classList.contains('mejs__captions-enabled')).toBeFalsy();
  });
});
