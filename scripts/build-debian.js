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
mkdirSync(debPackageDir)
console.log('--> Created: ' + debPackageDir)
mkdirSync(path.join(debPackageDir, 'usr'))
console.log('--> Created: ' + path.join(debPackageDir, 'usr'))
mkdirSync(path.join(debPackageDir, 'usr', 'local'))
console.log('--> Created: ' + path.join(debPackageDir, 'usr', 'local'))

var debBin = path.join(debPackageDir, 'usr', 'local', 'bin')
mkdirSync(debBin)
console.log('--> Created: ' + debBin)
console.log('--> Finished creating structure')
console.log('')

// copy binaries to debianPackageDir
console.log('# Copying binaries to ' + debBin)
ncp(binDir, debBin, function () {
  console.log('--> ' + debBin + ' content: ' , fs.readdirSync(debBin))
  console.log('')

  console.log('# Creating control file in DEBIAN')
  var debFolder = path.join(debPackageDir, 'DEBIAN')
  mkdirSync(debFolder)
  console.log('--> Created: ' + debFolder)
  console.log('')

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

  console.log('# Start building .deb package')
  var debBuildCommand = 'dpkg-deb --verbose --build ' + debPackageDir + ' ' + path.join(debPackageDir, '..', debPackageFileName)
  console.log('--> Running ', debBuildCommand)

  // var buildDone = false
  nrc.run(debBuildCommand, {onDone: function () {
    console.log('--> Done. File located at ' + path.join(debPackageDir, '..', debPackageFileName))
    console.log('')
    console.log('# Done')
    // buildDone = true
  }})

  // TODO: any while loop will prevent the onDone function from running,
  //       so the package will be build but the callback cannot signall it
  // var wait = function (ms){
  //    var start = new Date().getTime();
  //    var end = start;
  //    while(end < start + ms) {
  //      end = new Date().getTime();
  //   }
  // }
  //
  // while (!buildDone) {
  //   wait(30 * 1000)
  //   console.log('--> Building...')
  // }
})
