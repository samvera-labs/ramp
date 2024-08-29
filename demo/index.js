import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './app';
import config from './config';

const manifestURL = () => {
  const params = new URLSearchParams(window.location.search);
  let url = `${config.url}/manifests/${config.env}/lunchroom_manners.json`;
  if (params.has('iiif-content')) {
    url = params.get('iiif-content');
  }
  return url;
};

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(<App manifestURL={manifestURL} />);
