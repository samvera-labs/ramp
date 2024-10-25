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
    renderings: getRenderingFiles(manifest)
  };
};
