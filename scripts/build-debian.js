console.log('# Start building .deb package')
console.log('')

var path = require('path')
var fs = require('fs')
var ncp = require('ncp')
var nrc = require('node-run-cmd')

// Set necessary variables
var scriptPath = path.dirname(require.main.filename)
var packageInfo = require(path.join(scriptPath, '..', 'package.json'))
var debPackageName = packageInfo.name + '_' + packageInfo.version
var debPackageFileName = packageInfo.name + '_amd64.deb'

var binDir = path.join(scriptPath, '..', 'dist', 'electron-ios', packageInfo.productName + '-linux-x64')
var distdir = path.join(scriptPath, '..', 'dist')
var debPackageDir = path.join(distdir, debPackageName)

// custom function to make debian dir
const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

// Create package folder structure
console.log('# Create package folder structure')

// /
mkdirSync(debPackageDir)
console.log('--> Created: ' + debPackageDir)

// /usr
mkdirSync(path.join(debPackageDir, 'usr'))
console.log('--> Created: ' + path.join(debPackageDir, 'usr'))

// /usr/local
mkdirSync(path.join(debPackageDir, 'usr', 'local'))
console.log('--> Created: ' + path.join(debPackageDir, 'usr', 'local'))

var debBin = path.join(debPackageDir, 'usr', 'local', 'bin')
// /usr/local/bin
mkdirSync(debBin)
console.log('--> Created: ' + debBin)

var appDir = path.join(debBin, packageInfo.name)

// /usr/share
mkdirSync(path.join(debPackageDir, 'usr', 'share'))
console.log('--> Created: ' + path.join(debPackageDir, 'usr', 'share'))

// /usr/share/applications
var usrShareApps = path.join(debPackageDir, 'usr', 'share', 'applications')
mkdirSync(usrShareApps)
console.log('--> Created: ' + usrShareApps)

console.log('--> Finished creating structure')
console.log('')

// Create /usr/share/applications/vuenite.desktop
console.log('# Creating ' + path.join(usrShareApps, packageInfo.name + '.desktop'))
var desktopentryContent = [
  '[Desktop Entry]',
  'Name=' + packageInfo.productName,
  'Exec=/usr/local/bin/' + packageInfo.name + '/' + packageInfo.productName,
  'Icon=/usr/local/bin/' + packageInfo.name + '/' + 'icon.png',
  'Type=Application',
  'Categories=GTK;GNOME;Utility;'
].join('\n') + '\n'
fs.writeFileSync(path.join(usrShareApps, packageInfo.name + '.desktop'), desktopentryContent)
console.log('--> Created: ', path.join(usrShareApps, packageInfo.name + '.desktop'))
console.log('--> ' + path.join(usrShareApps, packageInfo.name + '.desktop') + ' content: ', desktopentryContent)
console.log('')

// copy binaries to debianPackageDir
console.log('# Copying binaries to ' + appDir)
ncp(binDir, appDir, function () {
  console.log('--> ' + appDir + ' content: ' , fs.readdirSync(appDir))
  console.log('')

  // Create debian folder
  console.log('# Creating control file in DEBIAN')
  var debFolder = path.join(debPackageDir, 'DEBIAN')
  mkdirSync(debFolder)
  console.log('--> Created: ' + debFolder)
  console.log('')

  // Create DEBIAN/content
  console.log('# Creating control file')
  var controlContent = [
    'Package: ' + packageInfo.name,
    'Version: ' + packageInfo.version,
    'Section: base',
    'Priority: optional',
    'Architecture: amd64',
    // 'Depends: libsomethingorrather (>= 1.2.13), anotherDependency (>= 1.2.6)',
    'Maintainer: ' + packageInfo.author,
    'Description: ' + packageInfo.description
  ].join('\n') + '\n'
  fs.writeFileSync(path.join(debFolder, 'control'), controlContent)
  console.log('--> Created: ', path.join(debFolder, 'control'))
  console.log('--> ' + path.join(debFolder, 'control') + ' content: ', controlContent)
  console.log('')

  console.log('# Creating copyright file')
  var copyrightContent = [
    'Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/',
    'Upstream-Name: ' + packageInfo.productName,
    'Upstream-Contact: ' + packageInfo.author,
    'Source: ' + packageInfo.homepage,
    '',
    'Files: *',
    'Copyright: ' + packageInfo.author,
    'License: MIT'
  ].join('\n') + '\n'
  fs.writeFileSync(path.join(debFolder, 'copyright'), copyrightContent)
  console.log('--> Created: ', path.join(debFolder, 'copyright'))
  console.log('--> ' + path.join(debFolder, 'copyright') + ' content: ', copyrightContent)
  console.log('')

  // Build debian package
  console.log('# Start building .deb package')
  var debBuildCommand = 'dpkg-deb --verbose --build ' + debPackageDir + ' ' + path.join(debPackageDir, '..', debPackageFileName)
  console.log('--> Running ', debBuildCommand)

  nrc.run(debBuildCommand, {onDone: function () {
    console.log('--> Done. File located at ' + path.join(debPackageDir, '..', debPackageFileName))
    console.log('')
    console.log('# Done')
  }})
})
