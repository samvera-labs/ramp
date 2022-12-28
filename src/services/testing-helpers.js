import React from 'react';
import { ManifestProvider } from '../context/manifest-context';
import { PlayerProvider } from '../context/player-context';

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
