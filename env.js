let config = {};

if (process.env.NODE_ENV === 'development') {
  config.url = 'http://localhost:6060';
  config.env = 'development';
} else {
  config.url = 'https://samvera-labs.github.io/ramp';
  config.env = 'production';
}

export default config;
