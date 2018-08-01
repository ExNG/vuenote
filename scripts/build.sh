#!/usr/bin/env bash

node_modules/quasar-cli/bin/quasar build --mode pwa --theme mat

cd dist
cd pwa-mat/ && zip -r ../vuenote.zip ./* -9 && cd ../
