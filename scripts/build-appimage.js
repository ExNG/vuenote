var pak = require('quasar-pak')
var path = require('path')

pak.appimage({
  package: require('../package.json'),
  dist: path.join(__dirname, '..', 'dist', 'electron-ios'),
  dest: path.join(__dirname, '..', 'dist')
})
