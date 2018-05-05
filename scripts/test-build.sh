#!/usr/bin/env bash

npm install
npm run lint
node_modules/quasar-cli/bin/quasar build --clean --mode electron --theme ios
