import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import config from '../env';



ReactDOM.render(<App
  manifestURL={`${config.url}/${config.env}/lunchroom_manners.json`}
/>, document.getElementById('root'));
