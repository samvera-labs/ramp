let url = '';
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:6060';
} else {
  url = 'https://samvera-labs.github.io/iiif-react-media-player';
}

export default url;
