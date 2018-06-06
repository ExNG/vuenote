#!/usr/bin/env bash

sudo apt-get install wine zip fuse -y

# node_modules/quasar-cli/bin/quasar build --mode electron --theme ios --target darwin
node_modules/quasar-cli/bin/quasar build --mode electron --theme ios --target linux
node_modules/quasar-cli/bin/quasar build --mode electron --theme ios --target win32

# cp src/statics/icon.png dist/electron-ios/Vuenote-darwin-x64/icon.png
cp src/statics/icon.png dist/electron-ios/Vuenote-linux-x64/icon.png
cp src/statics/icon.png dist/electron-ios/Vuenote-win32-x64/icon.png

npm run buildDeb
npm run buildAppImage

cd dist
# cd electron-ios/Vuenote-darwin-x64/ && zip -r ../../vuenote-darwin-x64.zip ./* -9 && cd ../../
cd electron-ios/Vuenote-linux-x64/ && zip -r ../../vuenote-linux-x64.zip ./* -9 && cd ../../
cd electron-ios/Vuenote-win32-x64/ && zip -r ../../vuenote-win32-x64.zip ./* -9 && cd ../../
