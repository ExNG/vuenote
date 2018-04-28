import Config from '../Config'
import Storage from '../Storage'
import Path from 'path'
import FS from 'fs'
import Moment from 'moment'

export default {
  /**
   * Get backup path from Config service.
   *
   * @return {String}
   */
  getBackupDir () {
    return Config.paths.backup
  },

  /**
   * Create file with export JSON.
   *
   * @param {String} addittion
   */
  create (addittion = '') {
    let backupDir = this.getBackupDir()

    let prefix = process.env.NODE_ENV === 'development' ? 'DEV_' : ''

    // check if backup already exists, if not do it (async)
    let backupFilename = Path.join(backupDir, prefix + Moment().format('YYYY-MM-DD') + addittion + '.json')
    if (!FS.existsSync(backupFilename)) {
      FS.writeFile(backupFilename, Storage.getExportJSON(), (err) => {
        if (err) throw err
      })
    }
  },

  /**
   * Return list of backups.
   *
   * @return {Array}
   */
  list () {
    let backupDir = this.getBackupDir()
    let out = []

    FS.readdirSync(backupDir).forEach(file => {
      out.push({
        name: file,
        content: null
      })
    })

    return out
  },

  /**
   * Return backup content.
   *
   * @param {String} name
   * @return {Null} || {Array}
   */
  getContent (name) {
    let backupDir = this.getBackupDir()
    let backupPath = Path.join(backupDir, name)

    if (FS.existsSync(backupPath)) {
      let fileContent = FS.readFileSync(backupPath)
      return JSON.parse(fileContent)
    } else {
      return null
    }
  },

  /**
   * Import JSON from backup.
   *
   * @param {String} name
   * @param {Null} || {Bool}
   */
  restore (name) {
    let backupDir = this.getBackupDir()
    let backupPath = Path.join(backupDir, name)

    if (FS.existsSync(backupPath)) {
      Storage.importJSON(FS.readFileSync(backupPath))
      return true
    } else {
      return null
    }
  },

  /**
   * Delete backup.
   *
   * @param {String} name
   * @param {Null} || {Bool}
   */
  delete (name) {
    let backupDir = this.getBackupDir()
    let backupPath = Path.join(backupDir, name)

    if (FS.existsSync(backupPath)) {
      FS.unlinkSync(backupPath)
      return true
    } else {
      return null
    }
  }
}
