import Storage from '../Storage'
import OS from 'os'
import Path from 'path'
import FS from 'fs'
import Moment from 'moment'

export default {
  prepare () {
    // check if vuenote dir exists
    let vuenoteDir = Path.join(OS.homedir(), '.vuenote')
    if (!FS.existsSync(vuenoteDir)) {
      FS.mkdirSync(vuenoteDir)
    }

    // check if backup dir exists
    let backupDir = Path.join(vuenoteDir, 'backup')
    if (!FS.existsSync(backupDir)) {
      FS.mkdirSync(backupDir)
    }

    // if not in production env save backups in dev/
    if (process.env.NODE_ENV !== 'production') {
      backupDir = Path.join(backupDir, 'dev')
      if (!FS.existsSync(backupDir)) {
        FS.mkdirSync(backupDir)
      }
    }

    return {
      vuenoteDir: vuenoteDir,
      backupDir: backupDir
    }
  },

  /**
   * Create file with export JSON.
   *
   * @param {String} addittion
   */
  create (addittion = '') {
    let prepare = this.prepare()
    let backupDir = prepare.backupDir

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
    let prepare = this.prepare()
    let backupDir = prepare.backupDir
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
    let prepare = this.prepare()
    let backupDir = prepare.backupDir
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
    let prepare = this.prepare()
    let backupDir = prepare.backupDir
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
    let prepare = this.prepare()
    let backupDir = prepare.backupDir
    let backupPath = Path.join(backupDir, name)

    if (FS.existsSync(backupPath)) {
      FS.unlinkSync(backupPath)
      return true
    } else {
      return null
    }
  }
}
