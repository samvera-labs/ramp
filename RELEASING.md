# Releasing @samvera/ramp

This document describes how to cut a release of `@samvera/ramp` component library and publish it to NPM.

## Prerequisites

- Publish access to `@samvera/ramp` on [npmjs.com](https://www.npmjs.com/), with 2FA enabled which is required to approve a staged publish — see step 3 below.
- Write access to the `samvera-labs/ramp` GitHub repository
- A [Trusted Publisher](https://docs.npmjs.com/trusted-publishers/) configured on `@samvera/ramp`'s [npmjs.com](https://www.npmjs.com/package/@samvera/ramp) "Settings" page, pointing at `samvera-labs/ramp` and workflow file `publish-and-release.yml` (this is a one-time setup).

## Steps

1. **Bump the version** in `package.json` on `main`, commit and push.
   ```
   npm version <major/minor/patch..> --no-git-tag-version
   ```
   Using `--no-git-tag-version` disables the automatic creation of a version commit and a tag, which let's the version bump to be reviewed before creating the tag.

2. **Tag the release** on the merged commit and push the tag:

   ```
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

   Pushing this tag triggers the [publish and release](.github/workflows/publish-and-release.yml) workflow, which builds and stages the library for publish in NPM and creates a release in GitHub.
   Using `--fozen-lockfile` with `yarn install` in this build process, installs the dependencies from the commited `yarn.lock` file on the Node version pinned in [.nvmrc](.nvmrc) file.
   Once the staging succeeds, it creates a GitHub release for the new tag with the release notes from the merged PRs, and attach the build files, `package.json`, and a snapshot of the current `README.md`.
3. **Approve the staged publish** using either of the following approaches;
   - with 2FA from [npmjs.com](https://docs.npmjs.com/staged-publishing/) OR
   - `npm stage approve <stage-id>` locally in CLI, using the stage ID from the workflow log or `npm stage list` to make the staged version live and installable.

4. **Reject the staged publish** if it was decided not to ship this version, using `npm stage reject <stage-id>`.
