#!/bin/bash

# Bail on first error
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

# dont deploy pull requests, only merges
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo PR detected, bailing
  exit 0;
fi

# store src commit hash
SHA=`git rev-parse --verify HEAD`

# deploy (triggers cleanup and build through npm pre scripts)
if [ -z "$TRAVIS_TAG" ]; then
  npm run deploy:web:staging
else
  npm run deploy:web:prod
fi

if [ -z "$TRAVIS_TAG" ]; then
  echo "successfully deployed commit ${SHA} to memory-n-back-staging.surge.sh"
else
  echo "successfully deployed commit ${SHA} to memory-n-back.surge.sh"
fi
