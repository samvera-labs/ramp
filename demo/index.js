import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(<App
  manifestURL={manifestURL()}
/>, document.getElementById('root'));
