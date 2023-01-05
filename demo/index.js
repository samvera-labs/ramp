import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import config from '../env';

ReactDOM.render(<App
  manifestURL={`${config.url}/manifests/mahler-symphony-3.json`}
/>, document.getElementById('root'));
