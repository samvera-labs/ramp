import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/app';
import manifest from '../public/manifests/lunchroom_manners.json';
import config from '../env';

console.log(config);

const props = {
  manifestUrl: `${config.url}/manifests/mahler-symphony-3.json`,
  // manifest: manifest
};
console.log(props);

ReactDOM.render(<App {...props} />, document.getElementById('root'));
