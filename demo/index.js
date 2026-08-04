import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './app';
import config from './config';

// Manifests bundled under public/manifests/{dev,prod} for both environments
const DEMO_MANIFESTS = [
  { label: 'Lunchroom Manners (Presentation 3)', filename: 'lunchroom_manners.json' },
  { label: 'Cross-Canvas Ranges in Structures (Presentation 3)', filename: 'cross-canvas-range.json' },
  { label: 'Lunchroom Manners (Presentation 4)', filename: 'lunchroom-manners-v4.json' },
  { label: 'Volleyball for Boys (Presentation 3)', filename: 'volleyball-for-boys.json' },
  { label: 'Playlist (Presentation 3)', filename: 'playlist-manifest.json' },
];

// Build sample Manifest URL for the current deployed environment
const DEMO_MANIFEST_OPTIONS = DEMO_MANIFESTS.map(({ label, filename }) => ({
  label,
  url: `${config.url}/manifests/${config.env}/${filename}`,
}));

const manifestURL = () => {
  const params = new URLSearchParams(window.location.search);
  // Do not pre-select a sample Manifest from combobox on initial page load
  let url = '';
  // But, if 'iiif-content' query param is present respect it and set Manifest URL
  if (params.has('iiif-content')) {
    url = params.get('iiif-content');
  }
  return url;
};

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(<App manifestURL={manifestURL} DEMO_MANIFEST_OPTIONS={DEMO_MANIFEST_OPTIONS} />);
