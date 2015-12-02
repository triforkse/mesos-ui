#!/bin/sh
if ([ "$TRAVIS_BRANCH" == "master" ] || [ ! -z "$TRAVIS_TAG" ]) && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo "Let's deploy!"
  VERSION="travis-$TRAVIS_BRANCH-$TRAVIS_JOB_NUMBER"
  API_JSON=$(printf '{"tag_name": "%s","target_commitish": "master","name": "%s","body": "Automatic release of version %s (thanks Travis!)","draft": false,"prerelease": false}' $VERSION $VERSION $VERSION)
  curl -s --data "$API_JSON" https://api.github.com/repos/$TRAVIS_REPO_SLUG/releases?access_token=$ACCESS_TOKEN > /dev/null
fi
