# @samvera/ramp 
[![Netlify Status](https://api.netlify.com/api/v1/badges/4fab1f64-7d56-4a69-b5f6-6cae5ed55537/deploy-status)](https://app.netlify.com/sites/iiif-react-media-player/deploys)
[![CircleCI](https://circleci.com/gh/samvera-labs/ramp.svg?style=svg)](https://app.circleci.com/pipelines/github/samvera-labs/ramp)

### **Renamed NPM component library previously known as [`@samvera/iiif-react-media-player`](https://www.npmjs.com/package/@samvera/iiif-react-media-player)**

An NPM component library of interactive [IIIF Presentation 3.0 API](http://iiif.io/api/presentation/3.0/) powered audio/video media player ReactJS components.

### **[Demo](https://ramp.avalonmediasystem.org/) | [GitHub Wiki](https://github.com/samvera-labs/ramp/wiki)**

## General Usage:

Add the `@samvera/ramp` components library from NPM into your ReactJS application via `yarn` or `npm`.

```
yarn add @samvera/ramp

// Add peer dependencies
yarn add video.js@7.21.3
```

**NOTE** (*Ramp <= v3.1.2*): `video.js@7.21.3` needs to be used because the included version of `@silvermine/videojs-quality-selector` is incompatible with Video.js >= v8.0.0.

**NOTE** (*Next release*): Ramp will be upgrading to `video.js@8.10.0` in its next release because `@silvermine/videojs-quality-selector` has been updated. If you are installing Ramp from the Main branch you need to run `yarn add video.js@8.10.0` in your ReactJS application to get the correct peer dependency.

### Example usage

```
import React from 'react';
import { IIIFPlayer, MediaPlayer, StructuredNavigation, Transcript } from "@samvera/ramp";
import 'video.js/dist/video-js.css';

// Import starter styles 
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

## Documentation

See the [Styleguidist docs](https://samvera-labs.github.io/ramp/) for documentation on the components. And the [GitHub Wiki](https://github.com/samvera-labs/ramp/wiki) for more details on usage and implementation of these components.


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

This will create a set of static documentation HTML files in the project's `/styleguide` directory. In this documentation, each component is explained with a code sample and a description of its props and functionality.

An example usage of all the components in the library is served from the `/demo` directory. This showcases the real-time usage of the components in an application. To start this example, run:

```
yarn demo
```

Then open up a browser and navigate to http://localhost:3003. It has live reload enabled via `webpack`, so live updates are immediately rendered in the browser during development.

## Deployment

To deploy your forked version of this repo, run:

```
yarn build
```

This will create CommoneJS, ES Module, and UMD distribution files located in the `/dist/` directory.

### Netlify Demo-site Deploy

A [demo site](https://ramp.avalonmediasystem.org/) is hosted with [Netlify](https://www.netlify.com).

This demo instance can read a **publicly available IIIF Presentation 3.0 Manifest** given the URL of the manifest and display content in the manifest.

A new build is triggered and published in Netlify when code changes are merged to the `main` branch in this repository.

## Running the tests

To run the tests, with a full coverage report, run:

```
yarn test
```

To run tests in `watch` mode:

```
yarn test:watch
```

Ramp uses [`Jest`](https://jestjs.io/) and [`react-testing-library`](https://github.com/testing-library/react-testing-library) to build its test suite.

### Coding style tests

There is a `prettierrc` file with project coding style settings.

## Contributing

If you're working on PR for this project, create a feature branch off of main.

This repository follows the [Samvera Community Code of Conduct](https://samvera.atlassian.net/wiki/spaces/samvera/pages/405212316/Code+of+Conduct) and [language recommendations](https://github.com/samvera/maintenance/blob/main/templates/CONTRIBUTING.md#language).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/samvera-labs/ramp/tags).

## Contributors

- **Dananji Withana** - _Front End Developer_ - [Indiana University](https://iu.edu)
- **Mason Ballengee** - _Software Engineer_ - [Indiana University](https://iu.edu)
- **Chris Colvard** - _DevOps Engineer_ - [Indiana University](https://iu.edu)
- **Adam J. Arling** - _Front End Developer_ - [Northwestern University](https://northwestern.edu)
- **Phuong Dinh** - _DevOps Engineer_ - [Indiana University](https://iu.edu)
- **Divya Katpally** - _Front End Developer_ - [Northwestern University](https://northwestern.edu)

See also the list of [contributors](https://github.com/samvera-labs/ramp/graphs/contributors) to see others who participated in this project.

## License

The library is available as open source under the terms of the [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0).

## Acknowledgments

- [Avalon Media System](https://www.avalonmediasystem.org/)
