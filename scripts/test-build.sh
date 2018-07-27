#!/usr/bin/env bash

npm install
npm run lint
node_modules/quasar-cli/bin/quasar build --mode electron --theme ios --target linux
