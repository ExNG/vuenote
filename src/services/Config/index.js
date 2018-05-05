import fs from 'fs'
import os from 'os'
import path from 'path'

// import Notification from '../Notification'
import Essential from '../Essential'

var createDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

// Paths

var packageInfo = require('../../../package.json')
var dir = path.join(os.homedir(), '.' + packageInfo.name)

// Deciding if dev enviroment
if (!process.env.PROD) {
  dir = path.join(os.homedir(), '.' + packageInfo.name + '_dev')
}
createDir(dir)

var backup = path.join(dir, 'backup')
createDir(backup)
var data = path.join(dir, 'data')
createDir(data)

export default {
  paths: {
    dir,
    backup,
    data
  },

  /**
   * Returns all paths.
   *
   * @returns {Object}
   */
  getPaths () {
    return Essential.clone(this.paths)
  },

  /**
   * Save data to data folder.
   *
   * @param {String} name
   * @param {String} value
   * @return {Bool}
   */
  set (name, value) {
    let file = path.join(this.paths.data, name)

    if (this._exist(file)) {
      fs.writeFileSync(file, value)
      return true
    } else {
      return false
    }
  },

  /**
   * Remove item from data.
   *
   * @param {String} name
   * @return {Bool}
   */
  unset (name) {
    let file = path.join(this.paths.data, name)

    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
      return true
    } else {
      return false
    }
  },

  /**
   * Return data saved in data folder.
   *
   * @param {String} name
   * @return {String}||{Bool}
   */
  get (name) {
    let file = path.join(this.paths.data, name)

    if (this._exist(file)) {
      return fs.readFileSync(file)
    } else {
      return false
    }
  },

  /**
   * Check if dir exists, if not create it.
   *
   * @param {String} path
   * @return {Bool}
   */
  _exist (path) {
    if (fs.existsSync(path)) {
      return true
    } else {
      fs.writeFileSync(path, JSON.stringify({}))
      return true
    }
  }
}
