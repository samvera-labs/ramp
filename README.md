# @samvera/ramp 
[![Netlify Status](https://api.netlify.com/api/v1/badges/4fab1f64-7d56-4a69-b5f6-6cae5ed55537/deploy-status)](https://app.netlify.com/sites/iiif-react-media-player/deploys)
[![CircleCI](https://circleci.com/gh/samvera-labs/ramp.svg?style=svg)](https://app.circleci.com/pipelines/github/samvera-labs/ramp)

A ReactJS component library of interactive components created to display audio/video resources in [IIIF Presentation 3.0 manifests](http://iiif.io/api/presentation/3.0/). These components are designed and built with reusability, customizability, and accessibility in mind.

#### **This is the renamed NPM component library previously known as [`@samvera/iiif-react-media-player`](https://www.npmjs.com/package/@samvera/iiif-react-media-player)**

## Documentation

For full documentation of the component library, visit [GitHub Wiki](https://github.com/samvera-labs/ramp/wiki)

Demo site showcasing all the components at https://ramp.avalonmediasystem.org/

## Installation Guide:

### With React (NPM package)

For React applications using a build tool (Webpack, Vite, etc.).

#### Prerequisites

Please ensure you have the following installed:
- Node.js (>= 20.x)
- `react` and `react-dom` (version compatibility with each Ramp version listed below)
- NPM or Yarn

**React Version Compatibility**
 - `@samvera/ramp` **v5.0.0 and later** require **React 19**
 - `@samvera/ramp` **v3.3.0** to **v4.0.2** support **React 18**. **Note:** `@samvera/ramp` v3.3.0 works with both React 17 and React 18. If upgrading to React 18, update both `react` and `react-dom` to the same version.
 - For **older versions** of `@samvera/ramp`, use **React 17**.

For ReactJS upgrade instructions, see the official upgrade guides [for React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis) and [for React 19](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) as needed.

#### Steps

1. Add `@samvera/ramp` components library from NPM into your application:
```
yarn add @samvera/ramp
npm install @samvera/ramp
```

From `@samvera/ramp v5.x`, VideoJS is included as a dependency and does **not** need to be installed separately.

**For `@samvera/ramp` versions < `5.x`**, install the recommended VideoJS version for your Ramp version:
  - `@samvera/ramp` versions < `v3.1.3`: Install `video.js@7.21.3`
  - `@samvera/ramp` versions between (inclusive) `v3.1.3` and `v4.0.2`: Install `video.js@8.10.0`

```
yarn add video.js@<version>
npm install video.js@<version>
```

2. Import the library into your application:
```
import { IIIFPlayer, MediaPlayer, StructuredNavigation, Transcript } from "@samvera/ramp";

// For @samvera/ramp versions < v5.0.0 import VideoJS styles from installed library
// import "video.js/dist/video-js.css";

// Import starter styles (includes VideoJS CSS for @samvera/ramp >= 5.0.0)
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
---

### Without React (Standalone bundle)

For plain HTML/JS applications (Rails, PHP, etc.) with no React or build tools.
The standalone bundle uses [Preact](https://preactjs.com/) internally to keep the file size small, but exposes the full React API so the app can render components using `React.createElement`.

#### Steps

1. In your HTML page, load the bundle and styles directly from [unpkg](https://unpkg.com/) (no download or build step required):

```html
<link rel="stylesheet" href="https://unpkg.com/@samvera/ramp/dist/ramp.css" />
<script src="https://unpkg.com/@samvera/ramp/dist/ramp.standalone.umd.js"></script>
```

To pin to a specific version, include it in the URL:
```html
<link rel="stylesheet" href="https://unpkg.com/@samvera/ramp@5.0.0/dist/ramp.css" />
<script src="https://unpkg.com/@samvera/ramp@5.0.0/dist/ramp.standalone.umd.js"></script>
```

Alternatively, download both files from the [latest release](https://github.com/samvera-labs/ramp/releases) and serve them locally.

```html
<link rel="stylesheet" href="ramp.css" />
<script src="ramp.standalone.umd.js"></script>
```

2. In the HTML page, render the player:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="https://unpkg.com/@samvera/ramp/dist/ramp.css" />
</head>

<body>
  <script src="https://unpkg.com/@samvera/ramp/dist/ramp.standalone.umd.js"></script>
  <div id="root"></div>
  <script>
    // Import components and React
    const { IIIFPlayer, MediaPlayer, StructuredNavigation, React, ReactDOM } = RampIIIF;
    // Parse Manifest URL
    const manifestUrl = new URLSearchParams(window.location.search).get('iiif-content');

    if (!manifestUrl) {
      alert('No manifest URL provided. Add ?iiif-content=<url> to the page URL.');
    } else {
      let parsed;
      try {
        parsed = new URL(manifestUrl);
      } catch {
        alert('Invalid URL in iiif-content parameter.');
        parsed = null;
      }

      if (parsed) {
        const root = document.getElementById('root');
        const playerTree = React.createElement(
          IIIFPlayer,
          { manifestUrl },
          React.createElement(
            'div', { className: 'iiif-player-demo' },
            React.createElement(MediaPlayer),
            React.createElement(StructuredNavigation)
          )
        );

        ReactDOM.createRoot(root).render(playerTree);
      }
    }
  </script>
</body>
</html>
```

## Questions

If you have any questions, reach out on the [Samvera Community Slack](https://samvera.slack.com):

- [#ramp](https://samvera.slack.com/archives/C01FGR7GSHF) — Ramp-specific questions and discussion
- [#avalon](https://samvera.slack.com/archives/C1C3C4F5L) — broader Avalon media system discussion

Or, submit a new issue in the [GitHub issues](github.com/samvera-labs/ramp/issues) to report any issues or new feature requests.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, development workflow, testing, and branch conventions.

This repository follows the [Samvera Community Code of Conduct](https://samvera.atlassian.net/wiki/spaces/samvera/pages/405212316/Code+of+Conduct) and [language recommendations](https://github.com/samvera/maintenance/blob/main/templates/CONTRIBUTING.md#language).

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
