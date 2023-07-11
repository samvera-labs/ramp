import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import config from './config';

const manifestURL = () => {
  const params = new URLSearchParams(window.location.search);
  // let url = `${config.url}/manifests/${config.env}/lunchroom_manners.json`;
  let url = 'https://avalon-dev.dlib.indiana.edu/media_objects/fj236208t/manifest.json';
  if (params.has('iiif-content')) {
    url = params.get('iiif-content');
  }
  return url;
};

ReactDOM.render(<App
  manifestURL={manifestURL()}
/>, document.getElementById('root'));
