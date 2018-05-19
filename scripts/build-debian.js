var pak = require('quasar-pak')
var path = require('path')

pak.debian({
  package: require('../package.json'),
  dist: path.join(__dirname, '..', 'dist', 'electron-ios'),
  dest: path.join(__dirname, '..', 'dist'),
  filename: require('../package.json').name + '_amd64.deb'
})
