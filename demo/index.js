import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/app';
import manifest from '../assets/manifests/production/mahler-symphony-3.json';
import config from '../env';

console.log(config);

const props = {
  manifestUrl: `${config.url}/manifests/mahler-symphony-3.json`,
};
console.log(props);

ReactDOM.render(<App {...props} />, document.getElementById('root'));
