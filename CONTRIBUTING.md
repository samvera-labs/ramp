# Contributing to Ramp

Thank you for your interest in contributing! This guide covers everything you need to get the project running locally, make changes, and submit a pull request.

We follow the [Samvera Community Code of Conduct](https://samvera.atlassian.net/wiki/spaces/samvera/pages/405212316/Code+of+Conduct) and [language recommendations](https://github.com/samvera/maintenance/blob/main/templates/CONTRIBUTING.md#language).

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20.x
- [yarn](https://yarnpkg.com/) or [npm](https://docs.npmjs.com/)

## Installation

Clone the repository and install dependencies:

```
git clone https://github.com/samvera-labs/ramp.git
cd ramp
yarn install
```

## Development environments

Ramp provides two local development environments that can run simultaneously and both live-reload on code changes.

### Styleguidist (port 6060)

[React Styleguidist](https://react-styleguidist.js.org/) serves interactive component documentation with live code examples. Use this environment when working on component APIs or documentation.

```
yarn dev
```

Open http://localhost:6060 in your browser.

To build a static HTML version of the docs (used by GitHub Pages):

```
yarn styleguide:build
```

The output is written to the project's `/docs` directory.

### Vite demo (port 3003)

The `/demo` directory contains a full example application showing how the components can be composed and styled together. Use this environment to verify real-world rendering and layout behavior.

```
yarn demo
```

Open http://localhost:3003 in your browser.

## Testing

Ramp uses [Jest](https://jestjs.io/) and [React Testing Library](https://github.com/testing-library/react-testing-library) for unit tests.

Run the full test suite with coverage:

```
yarn test
```

Run tests in watch mode:

```
yarn test:watch
```

## Building

To produce the CommonJS, ES Module, and UMD distribution files in `/dist/` run:

```
yarn build
```

This also runs `yarn styleguide:build` to regenerate the static docs.

## Testing unreleased changes in a ReactJS application

To test a branch's built output before it is published to NPM:

1. Create a feature branch off `main` and make your changes.
2. Run `yarn build` to generate the distribution files in `/dist/`.
3. Commit and push the `/dist/` files to your branch on GitHub.
4. In the consuming application:
   ```
   yarn remove @samvera/ramp
   yarn cache clean
   yarn add https://github.com/samvera-labs/ramp#<your_branch_name>
   ```

Once testing is complete, **delete the test branch from GitHub** and do not merge the built `/dist/` files into `main`.

## Deployment

Merging to `main` automatically triggers two deployments:

- **[Demo site](https://ramp.avalonmediasystem.org/)** — hosted on Netlify, showing a real-world component layout. Accepts any publicly available IIIF Presentation 3.0 Manifest URL as input.
- **[GitHub Pages docs](https://samvera-labs.github.io/ramp/)** — the Styleguidist documentation site, rebuilt from the `/docs` output.

No manual steps are required for either deployment.

## Branch and PR conventions

- Create feature branches off `main` (e.g. `feature/my-change` or `fix/my-bug`).
- Open pull requests against `main`.
- Keep PRs focused — one logical change per PR makes review and revert easier.
- Run `yarn test` before opening a PR and make sure all tests pass.

