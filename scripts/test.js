const path = require('path')
const fs = require('fs')

var log = (str) => {
  console.log('')
  console.log(str)
  console.log('')
}

/**
 * Run all tests from "/tests" dir.
 *
 * @param {String} dir
 */
var runAll = (dir) => {
  // Get dir content
  let files = fs.readdirSync(dir)

  files.forEach(function(file) {
    let filepath = path.join(dir, file)

    // Its a dir, run this method again on that dir
    if (fs.statSync(filepath).isDirectory()) {
      runAll(filepath)
    } else {
      // Its a test, run it
      log(`        => Running ${filepath}`)
      // TODO: ES6 modules obviously wont work
      require(filepath).forEach(test => test())
    }
  })
}

runAll(path.join(__dirname, '..', 'tests'))
