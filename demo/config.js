let config = {};

const base_url = window.location.origin;
if (process.env.NODE_ENV === 'development') {
  config.url = 'http://localhost:3003';
  config.env = 'dev';
} else {
  config.url = base_url;
  config.env = 'prod';
}

export default config;
