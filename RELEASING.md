# Releasing @samvera/ramp

This document describes how to cut a release of `@samvera/ramp` component library and publish it to NPM.

## Prerequisites

- Publish access to `@samvera/ramp` on [npmjs.com](https://www.npmjs.com/), with 2FA enabled which is required to approve a staged publish - see step 3 below.
- Write access to the `samvera-labs/ramp` GitHub repository
- A [Trusted Publisher](https://docs.npmjs.com/trusted-publishers/) configured on [`@samvera/ramp`](https://www.npmjs.com/package/@samvera/ramp)'s "Settings" page, pointing at `samvera-labs/ramp` and workflow file `publish-and-release.yml` (this is a one-time setup)

## Steps

1. **Bump the version** in `package.json` on `main`.
   ```
   npm version <major/minor/patch..> --no-git-tag-version
   ```
   Using `--no-git-tag-version` disables the automatic creation of a version commit and a tag, which let's the version bump to be reviewed before creating the tag.
   This also runs the `"version"` hook in `package.json`, which prepends a new section to the `CHANGELOG.md` with the merged PRs since the last release via [scripts/update-changelog.sh](scripts/update-changelog.sh). These changes need to be reviewed and adjusted as needed and commited along with the version bump iteself.

   **Special case**: if the last release was created for a specific set of cherry-picked commits for a special release (e.g. `v5.1.1` release was created off of `v5.1.0` release with a cherry-picked commit in [PR](https://github.com/samvera-labs/ramp/pull/1003)), then the last release doesn't carry a full release of all the changes made upto that point in time. In that case, the `CHANGELOG.md` section created above needs to overwritten with an accurate list of changes. 

   Since `npm version` doesn't allow forwarding CLI args to lifecycle scripts, the [scripts/update-changelog.sh](scripts/update-changelog.sh) script needs to be run directly. To do this, follow the steps;
   1. Unstage and delete the newly added section in `CHANGELOG.md` by the `"version"` hook in `package.json`
   2. Run [scripts/update-changelog.sh](scripts/update-changelog.sh) directly using `bash ./scripts/update-changelog.sh <LAST_FULL_RELEASE_TAG>` command. e.g. for the next release from `v5.1.1` in the above scenario run `bash ./scripts/update-changelog.sh v5.1.0`
   3. This command will gather merged PRs since the last full release tag excluding the cherry-picked PRs and write a new section for the current tag in `CHANGELOG.md`

   Commit and push these changes for review and merge.

2. **Tag the release** on the merged commit (with version bump and `CHANGELOG.md` changes) and push the tag:

   ```
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

   Pushing this tag triggers the [publish and release](.github/workflows/publish-and-release.yml) workflow, which builds and stages the library to be published in NPM and creates a Release in GitHub.

   Using `--fozen-lockfile` with `yarn install`, installs the dependencies from the commited `yarn.lock` file on the Node version pinned in [.nvmrc](.nvmrc) file.

   Once the staging succeeds, it creates a GitHub Release for the new tag with the release notes from the merged PRs, and attach the build files, `package.json`, and a snapshot of the current `README.md`.

3. **Approve the staged publish** using either of the following approaches;
   - Using NPM website with 2FA from [npmjs.com](https://docs.npmjs.com/staged-publishing#using-npmjscom-1) OR
   - Using the [CLI](https://docs.npmjs.com/staged-publishing#using-the-cli-1) with `npm stage approve <stage-id>` locally, using the stage ID from the workflow log or `npm stage list` 
   
   to make the staged version live and installable.

4. **Reject the staged publish** if it was decided not to ship this version, using [`npm stage reject <stage-id>`](https://docs.npmjs.com/cli/v11/commands/npm-stage#npm-stage-reject) locally in CLI.
