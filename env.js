let config = {};
if (process.env.NODE_ENV === 'development') {
  config.url = 'http://localhost:3000';
  config.env = process.env.NODE_ENV;
} else {
  config.url = 'https://react-media-player-iiif.netlify.app';
  config.env = process.env.NODE_ENV;
}

export default config;
