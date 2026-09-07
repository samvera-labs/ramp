import React from 'react';
import { ManifestProvider } from '../context/manifest-context';
import { PlayerProvider } from '../context/player-context';
import { canvasesInManifest, getRenderingFiles } from './iiif-parser';

export function withManifestAndPlayerProvider(
  Component,
  { initialManifestState = {}, initialPlayerState = {}, ...restProps } = {}
) {
  return () => (
    <ManifestProvider initialState={initialManifestState}>
      <PlayerProvider initialState={initialPlayerState}>
        <Component {...restProps} />
      </PlayerProvider>
    </ManifestProvider>
  );
}

export function withManifestProvider(
  Component,
  { initialState = {}, ...restProps } = {}
) {
  return () => (
    <ManifestProvider initialState={initialState}>
      <Component {...restProps} />
    </ManifestProvider>
  );
}

export function withPlayerProvider(
  Component,
  { initialState = {}, ...restProps } = {}
) {
  return () => (
    <PlayerProvider initialState={initialState}>
      <Component {...restProps} />
    </PlayerProvider>
  );
}

export function manifestState(manifest, canvasIndex = 0, isPlaylist = false) {
  return {
    playlist: { isPlaylist, markers: [], isEditing: false },
    customStart: { startIndex: 0, startTime: 0 },
    manifest,
    allCanvases: canvasesInManifest(manifest),
    canvasIndex,
    canvasSegments: [],
    structures: { hasStructure: false, isCollapsed: false },
    renderings: getRenderingFiles(manifest),
    annotations: [],
    auth: { token: null, status: 'idle' },
    srcIndex: 0,
  };
};

// Build a minimal valid 'audiowaveform' binary buffer dataset
export const buildWaveformBinary = (samples) => {
  const headerSize = 24;
  const buffer = new ArrayBuffer(headerSize + samples.length);
  const view = new DataView(buffer);
  view.setInt32(0, 2, true);
  view.setUint32(4, 1, true);
  view.setInt32(8, 44100, true);
  view.setInt32(12, 512, true);
  view.setUint32(16, samples.length / 2, true);
  view.setInt32(20, 1, true);
  new Int8Array(buffer, headerSize).set(samples);
  return buffer;
};
