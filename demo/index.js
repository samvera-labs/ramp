import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './app';
import config from './config';

// Manifests bundled under public/manifests/{dev,prod} for both environments
const DEMO_MANIFESTS = [
  {
    label: 'Lunchroom Manners (Presentation 3)',
    filename: 'lunchroom_manners.json',
    description: 'A single-Canvas video Manifest with structure and transcripts.',
  },
  {
    label: 'Cross-Canvas Ranges in Structures (Presentation 3)',
    filename: 'cross-canvas-range.json',
    description: 'A multi-Canvas Manifest with structure Range spanning across Canvases.',
  },
  {
    label: 'Lunchroom Manners (Presentation 4)',
    filename: 'lunchroom-manners-v4.json',
    description: 'A single-Canvas video Manifest using IIIF Presentation API 4.0 spec.',
  },
  {
    label: 'Volleyball for Boys (Presentation 3)',
    filename: 'volleyball-for-boys.json',
    description: 'A single-Canvas video Manifest with a text transcript and without structure.',
  },
  {
    label: 'Sample Playlist (Presentation 3)',
    filename: 'playlist-manifest.json',
    description: 'A playlist Manifest with playlist items as clips from multiple items similar to Avalon.',
  },
];

// Build sample Manifest URL for the current deployed environment
const DEMO_MANIFEST_OPTIONS = DEMO_MANIFESTS.map(({ label, filename, description }) => ({
  label,
  description,
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
