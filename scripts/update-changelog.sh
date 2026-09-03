# Reference: https://gist.github.com/motss/d9d6c58ca7b064982dcdbb5e663f047f#file-get-merged-prs-from-last-release-tag-then-format-for-changelog-using-github-cli-sh-L29

#!/bin/sh

# Read the bumped version (new) from package.json
VERSION="v$(node -p "require('./package.json').version")"

# Get the last published tag if exists
PREV_TAG="$(git describe --tags --abbrev=0 2>/dev/null || echo "")"

# Get the current date in MM/DD/YYYY format
DATE="$(date +%m/%d/%Y)"

# Get the timestamp of the last release tag using limit=1. 
# By default, these are listed in descending order bu GitHub.

# Read a tag name as the first argument to override any special releases made between the last full release
# and the current release, which is used as the cutoff for getting the timestamp of the last published full release.
# e.g. when a special release was was created with cherry-picked PRs instead of a full release.
# Example use: bash ./scripts/update-changelog.sh v5.1.0
SINCE_TAG="$1"
if [ -n "$SINCE_TAG" ]; then
  TIMESTAMP=$(
  gh release view "$SINCE_TAG" \
    --json publishedAt \
    --jq ".publishedAt | fromdateiso8601"
  )
else
  TIMESTAMP=$(
  gh release list \
    --limit 1 \
    --json tagName,publishedAt \
    --jq ".[0].publishedAt | fromdateiso8601"
  )
fi

# Get a list of merged PRs
PRS=$(gh pr list --state merged --limit 1)

# Ensure there is at least one merged PR in the repository
if [ -z "$PRS" ]; then
  echo "No merged-PR commits found since ${PREV_TAG:-the start of history}; CHANGELOG.md not updated."
  exit 0
fi

# When SINCE_TAG is used to backfill past a special release with cherry-picked PRs, identify the already documented
# PRs in the CHANGELOG.md and exclude them in the new section.
ALREADY_LISTED=$(grep -oE '/pull/[0-9]+' CHANGELOG.md | grep -oE '[0-9]+' | sort -un | jq -s '.')

ENTRIES=$(
gh pr list \
  --state merged \
  --json author,number,mergeCommit,mergedAt,url,title \
  --limit 999 \
  --jq ".[] | \
  select (.mergedAt | fromdateiso8601 > $TIMESTAMP) | \
  select ([.number] | inside($ALREADY_LISTED) | not) | \
  \"- \(.title) by @\(.author.login) in \(.url)\""
)

TITLE="$(head -n 1 CHANGELOG.md)"
REST="$(tail -n +2 CHANGELOG.md)"

TMP_FILE="$(mktemp)"
{
  echo "$TITLE"
  echo
  echo "## ${VERSION} tag (${DATE})"
  echo "$ENTRIES"
  echo "$REST"
} > "$TMP_FILE"

mv "$TMP_FILE" CHANGELOG.md
git add CHANGELOG.md
