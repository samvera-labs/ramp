import React from 'react';
import { render, screen } from '@testing-library/react';
import { withManifestAndPlayerProvider } from '../../services/testing-helpers';
import MediaPlayer from './MediaPlayer';
import audioManifest from '@Json/mahler-symphony-audio';
import videoManifest from '@Json/mahler-symphony-video';

describe('MediaPlayer component with audio manifest', () => {
  beforeEach(() => {
    const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
      initialManifestState: { manifest: audioManifest, canvasIndex: 0 },
      initialPlayerState: {},
    });
    render(<PlayerWithManifest />);
  })

  test("renders successfully", ()=> {
    expect(screen.getByTestId('media-player'))
  })

  test('reads media type as audio from manifest', () => {
    expect(screen.getByTestId('audio-element'));
  })
})

describe('MediaPlayer component with video manifest', () => {
  beforeEach(() => {
    const PlayerWithManifest = withManifestAndPlayerProvider(MediaPlayer, {
      initialManifestState: { manifest: videoManifest, canvasIndex: 0 },
      initialPlayerState: {},
    });
    render(<PlayerWithManifest />);
  })

  test("renders successfully", ()=> {
    expect(screen.getByTestId('media-player'))
  })

  test('reads media type as audio from manifest', () => {
    expect(screen.getByTestId('video-element'));
  }) 
});
