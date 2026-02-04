# @samvera/ramp 
[![Netlify Status](https://api.netlify.com/api/v1/badges/4fab1f64-7d56-4a69-b5f6-6cae5ed55537/deploy-status)](https://app.netlify.com/sites/iiif-react-media-player/deploys)
[![CircleCI](https://circleci.com/gh/samvera-labs/ramp.svg?style=svg)](https://app.circleci.com/pipelines/github/samvera-labs/ramp)

A ReactJS component library of interactive components created to display audio/video resources in [IIIF Presentation 3.0 manifests](http://iiif.io/api/presentation/3.0/). These components are designed and built with reusability, customizability, and accessibility in mind.

#### **This is the renamed NPM component library previously known as [`@samvera/iiif-react-media-player`](https://www.npmjs.com/package/@samvera/iiif-react-media-player)**

## Documentation

For full documentation of the component library, visit [GitHub Wiki](https://github.com/samvera-labs/ramp/wiki)

Demo site built show-casing all the components at https://ramp.avalonmediasystem.org/

## Installation Guide:

### Prerequisites

Please ensure you have the following installed:
- Node.js (>= 16.x)
- `react` and `react-dom` (>= 17.x)
- NPM or Yarn

**React Version Compatibility**
 - `@samvera/ramp` versions later than **v4.0.2** will only work with **React 19**
 - `@samvera/ramp` **v3.3.0 and later** support **React 18**. **Note:** `@samvera/ramp` v3.3.0 works with both React 17 and React 18. If upgrading to React 18, update both `react` and `react-dom` to the same version.
 - For **older versions** of `@samvera/ramp`, use **React 17**.


 For ReactJS upgrade instructions, see the [ReactJS official upgrade guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis).

### Steps

1. Add `@samvera/ramp` components library from NPM into your application"
```
yarn add @samvera/ramp
```
OR
```
npm install @samvera/ramp
```

**Important**:  
- Post `@samvera/ramp v4.0.2`, VideoJS is included as a dependency and does **not** need to be installed separately.
- For older versions:
  - `@samvera/ramp <= v3.1.2`: Install `video.js@7.21.3`
  - `@samvera/ramp v3.1.3` to `v4.0.2`: Install `video.js@8.10.0`
- For best results, use the recommended VideoJS version for your Ramp version.

2. Import the library into your application:
```
import { IIIFPlayer, MediaPlayer, StructuredNavigation, Transcript } from "@samvera/ramp";

// Import starter styles (includes VideoJS CSS)
import "@samvera/ramp/dist/ramp.css";
```

3. Example use of the components from the component library:

```
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

## Development

Ramp provides two development environments, 
- using [React Styleguidist](https://react-styleguidist.js.org/): a documentation site for all the components and their usage accompanied with code snippets, running on http://localhost:6060.
- using [Webpack](https://webpack.js.org/): show-case of how these components can be arranged on a web page and styled according to user preference, running on http://localhost:3003.

Both of these can run on your localhost at the same time, and can live-reload based on your code changes.

### Styleguidist environment

[React Styleguidist](https://react-styleguidist.js.org/), in addition to providing documentation, also offers an isolated development environment. To start the dev environment, run:

```
yarn dev
```

To build a static html version of the docs (which Github pages uses), run:

```
yarn styleguide:build
```

This will create a set of static documentation HTML files in the project's `/docs` directory. In this documentation, each component is explained with a code sample and a description of its props and functionality.


### Webpack environment

An example usage of all the components in the library is served from the `/demo` directory. This showcases the real-time usage of the components in an application. To start this example, run:

```
yarn demo
```

## Testing

Ramp uses [`Jest`](https://jestjs.io/) and [`react-testing-library`](https://github.com/testing-library/react-testing-library) to build an automated unit test suite. To run these tests, with a full coverage report, run:

```
yarn test
```

To run tests in `watch` mode:

```
yarn test:watch
```

The built library can be imported directly from GitHub to test unreleased code changes. To do this, please follow the following steps.

1. Create a new branch from `main` with the latest code
2. Run `yarn build` commande in your branch. This will create CommoneJS, ES Module, and UMD distribution files located in the `/dist/` directory.
3. Push these files into your branch in GitHub
4. In your application;
   - Remove the existing `@samvera/ramp` installation with `yarn remove @samvera/ramp`
   - Clean cache using `yarn cache clean`
   - Add the built library from your GitHub branch `yarn add https://github.com/samvera-labs/ramp#<your_branch_name>`

Once you've completed your testing, _please cleanup the test branch from GitHub_.

## Deployment

When new code is added into the `main` branch of the GitHub repo, it is deployed into two locations.

### Deploying to Netlify demo site

The [demo site](https://ramp.avalonmediasystem.org/) is hosted with [Netlify](https://www.netlify.com), which displays all the components in the library in a similar manner to real-life usage of them.

This demo instance can read a **publicly available IIIF Presentation 3.0 Manifest** given the URL of the manifest and display content in the manifest.

A new build is triggered and published in Netlify when code changes are merged to `main` branch in this repository.

### Deploying to GitHub Pages

The GitHub pages site, https://samvera-labs.github.io/ramp/ is built using ReactJS Styleguidist docs.

Similar to the demo site, a new build of this site it triggered and published when new code changes are merged to `main` branch.

## Contributing

If you're working on PR for this project, create a feature branch off of `main`.

We welcome your contributions. This repository follows the [Samvera Community Code of Conduct](https://samvera.atlassian.net/wiki/spaces/samvera/pages/405212316/Code+of+Conduct) and [language recommendations](https://github.com/samvera/maintenance/blob/main/templates/CONTRIBUTING.md#language).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/samvera-labs/ramp/tags).

## Contributors

- **Dananji Withana** - _Software Engineer_ - [Indiana University](https://iu.edu)
- **Mason Ballengee** - _Software Engineer_ - [Indiana University](https://iu.edu)
- **Chris Colvard** - _DevOps Engineer_ - [Indiana University](https://iu.edu)
- **Adam J. Arling** - _Front End Developer_ - [Northwestern University](https://northwestern.edu)
- **Patrick Lienau** - _Developer_ - [Thirdwave, LLC](https://www.thirdwavellc.com/)
- **Phuong Dinh** - _DevOps Engineer_ - [Indiana University](https://iu.edu)
- **Divya Katpally** - _Front End Developer_ - [Northwestern University](https://northwestern.edu)

See also the list of [contributors](https://github.com/samvera-labs/ramp/graphs/contributors) to see others who participated in this project.

## License

The library is available as open source under the terms of the [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0).

## Acknowledgments

- [Avalon Media System](https://www.avalonmediasystem.org/)
