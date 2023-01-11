let config = {};

if (process.env.NODE_ENV === 'development') {
  config.url = 'http://localhost:3000';
  config.env = 'dev';
} else {
  config.url = 'https://iiif-react-media-player.netlify.app';
  config.env = 'prod';
}

export default config;
