# @samvera/iiif-react-media-player

Interactive, IIIF powered audio/video media player React components.

## General Usage:

Add the `@samvera/iiif-react-media-player` component into your ReactJS application via `yarn` or `npm`.

```
yarn add @samvera/iiif-react-media-player

// Add peer dependencies
yarn add video.js
yarn add videojs-hotkeys
```

### Example usage

```
import React from 'react';
import { IIIFPlayer, MediaPlayer, StructuredNavigation } from "@samvera/iiif-react-media-player";
import 'video.js/dist/video-js.css';

// Import starter styles (in the future this will be optional)
import "@samvera/iiif-react-media-player/dist/iiif-react-media-player.css";

const App = () => {
  // Get your manifest from somewhere
  const manifestUrl = "https://some-manifest-url-here.json";

  return (
    <IIIFPlayer manifestUrl={manifestUrl}>
      <MediaPlayer />
      <StructuredNavigation />
    </IIIFPlayer>
  );
}

export default App;
```

### Cross-site Requests

** This info pulled from the [Diva.js](https://github.com/ddmal/diva.js) package**

You may receive an error that looks something like this:

```bash
XMLHttpRequest cannot load http://example.com/demo/imagefiles.json. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8000' is therefore not allowed access.
```

This is a security precaution that all browsers use to prevent cross-site request forgeries. If you receive this message it is because your `manifestUrl` prop and the server used to serve the OpenSeadragon React Viewer are not at the same server address.

To fix this you must ensure that the OpenSeadragon React Viewer host's React application, and the location pointed to by the `manifestUrl` prop are being served by the same server, or you must create an exception using the Access-Control-Allow-Origin header on your server to explicitly white-list the `manifestUrl` location.

#### IIIF 3.0 spec

http://iiif.io/api/presentation/3.0/

## Developing

### Styleguidist development

Styleguidist, in addition to providing documentation, also offers an isolated development environment. To start the dev environment, run:

```
yarn dev
```

To build a static html version of the docs (which Github pages uses), run:

```
yarn styleguide:build
```

This will output static documentation HTML files to the project's `/styleguide` directory.

## Deployment

To deploy your forked version of this repo, run:

```
yarn build
```

This will create CommoneJS, ES Module, and UMD distribution files located in the `/dist/` directory.

## Documentation

See the [Styleguidist docs](https://samvera-labs.github.io/iiif-react-media-player/) for documentation on the components.

## Running the tests

To run the tests, with a full coverage report:

```
yarn test
```

To run tests in `watch` mode:

```
yarn test:watch
```

`Jest` is our testing framework, and we're in the process of incorporating `react-testing-library` https://github.com/testing-library/react-testing-library.

### Coding style tests

There is a `prettierrc` file with project coding style settings.

## Built With

- [React](https://reactjs.org/) - JavaScript component library
- [Jest](https://jestjs.io/) - Testing framework

## Contributing

Please read [CONTRIBUTING.md](contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/avalonmediasystem/react-structural-metadata-editor/tags).

## Authors

- **Adam J. Arling** - _Front End Developer_ - [Northwestern University](https://northwestern.edu)
- **Phuong Dinh** - _Front End Developer_ - [Indiana University](https://iu.edu)
- **Dananji Withana** - _Front End Developer_ - [Indiana University](https://iu.edu)
- **Divya Katpally** - _Front End Developer_ - [Northwestern University](https://northwestern.edu)

See also the list of [contributors](https://github.com/avalonmediasystem/react-structural-metadata-editor/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- [Avalon Media System](https://www.avalonmediasystem.org/)

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo
[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
