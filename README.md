# @samvera/ramp

### **Renamed component library previously known as [`@samvera/iiif-react-media-player`](https://www.npmjs.com/package/@samvera/iiif-react-media-player)**

<br />

A library of interactive IIIF powered audio/video media player React components.

### **[Demo](https://iiif-react-media-player.netlify.app/)**

<br />

## General Usage:

Add the `@samvera/ramp` components library from NPM into your ReactJS application via `yarn` or `npm`.

```
yarn add @samvera/ramp

// Add peer dependencies
yarn add video.js@7.21.3
yarn add videojs-hotkeys
```

**NOTE**: `video.js@7.21.3` needs to be used until the [fix](https://github.com/silvermine/videojs-quality-selector/pull/93) to use the latest Video.js (v8.0.4) in `@silvermine/videojs-quality-selector` is merged.

### Example usage

```
import React from 'react';
import { IIIFPlayer, MediaPlayer, StructuredNavigation, Transcript } from "@samvera/ramp";
import 'video.js/dist/video-js.css';

// Import starter styles (in the future this will be optional)
import "@samvera/ramp/dist/ramp.css";

const App = () => {
  // Get your manifest from somewhere
  const manifestUrl = "https://some-manifest-url-here.json";

  // Transcript props
  const props = {
    playerID: 'player-id',
    transcripts: [
      {
        canvasId: 0,
        items: [ { title: "Title", url: "https://some-transcript-url-here.json" } ]
      }
    ]
  }

  return (
    <IIIFPlayer manifestUrl={manifestUrl}>
      <MediaPlayer enableFileDownload={false} />
      <StructuredNavigation />
      <Transcript {...props} />
    </IIIFPlayer>
  );
}

export default App;
```

More detailed explanation and usage of these components, please refer to the [Wiki](https://github.com/samvera-labs/iiif-react-media-player/wiki) documentation.

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

An example usage of all the components in the library is served from the `/demo` directory. This showcases real-time usage of the components in this library in an application. To start this example, run:

```
yarn demo
```

Then open up a browser and navigate to http://localhost:3000. Live reload via `webpack` is enabled, so you'll be able to see live updates in the browser during development.

## Deployment

To deploy your forked version of this repo, run:

```
yarn build
```

This will create CommoneJS, ES Module, and UMD distribution files located in the `/dist/` directory.

### Netlify Demo-site Deploy

A demo site is hosted with [Netlify](https://www.netlify.com) at https://iiif-react-media-player.netlify.app. 

This demo instance can read a **publicly available IIIF manifest** given the URL of the manifest and display content in the manifest.

A new build is triggered and published in Netlify when code changes are merged to the `main` branch in this repository.

## Documentation

See the [Styleguidist docs](https://samvera-labs.github.io/iiif-react-media-player/) for documentation on the components. And our [GitHub Wiki](https://github.com/samvera-labs/iiif-react-media-player/wiki) for more details on usage and implementation of these components.

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

If you're working on PR for this project, create a feature branch off of main.

This repository follows the [Samvera Community Code of Conduct](https://samvera.atlassian.net/wiki/spaces/samvera/pages/405212316/Code+of+Conduct) and [language recommendations](https://github.com/samvera/maintenance/blob/main/templates/CONTRIBUTING.md#language).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/avalonmediasystem/react-structural-metadata-editor/tags).

## Authors

- **Dananji Withana** - _Front End Developer_ - [Indiana University](https://iu.edu)
- **Adam J. Arling** - _Front End Developer_ - [Northwestern University](https://northwestern.edu)
- **Phuong Dinh** - _Front End Developer_ - [Indiana University](https://iu.edu)
- **Divya Katpally** - _Front End Developer_ - [Northwestern University](https://northwestern.edu)

See also the list of [contributors](https://github.com/samvera-labs/iiif-react-media-player/graphs/contributors) who participated in this project.

## License

The library is available as open source under the terms of the [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0).

## Acknowledgments

- [Avalon Media System](https://www.avalonmediasystem.org/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/4fab1f64-7d56-4a69-b5f6-6cae5ed55537/deploy-status)](https://app.netlify.com/sites/iiif-react-media-player/deploys)
[![CircleCI](https://circleci.com/gh/samvera-labs/iiif-react-media-player.svg?style=svg)](https://app.circleci.com/pipelines/github/avalonmediasystem/react-iiif-media-player)
