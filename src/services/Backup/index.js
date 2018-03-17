import Storage from '../Storage'
import OS from 'os'
import Path from 'path'
import FS from 'fs'
import Moment from 'moment'

export default {
  /**
   * Create file with export JSON.
   *
   * @param {String} addittion
   */
  create (addittion = '') {
    let prefix = process.env.NODE_ENV === 'development' ? 'DEV_' : ''

    // check if vuenite dir exists
    let vueniteDir = Path.join(OS.homedir(), '.vuenite')
    if (!FS.existsSync(vueniteDir)) {
      FS.mkdirSync(vueniteDir)
    }

    // check if backup dir exists
    let backupDir = Path.join(vueniteDir, 'backup')
    if (!FS.existsSync(backupDir)) {
      FS.mkdirSync(backupDir)
    }

    if (process.env.NODE_ENV !== 'production') {
      backupDir = Path.join(backupDir, 'dev')
      if (!FS.existsSync(backupDir)) {
        FS.mkdirSync(backupDir)
      }
    }

    // check if backup already exists, if not do it (async)
    let backupFilename = Path.join(backupDir, prefix + Moment().format('YYYY-MM-DD_HH:mm_Z') + addittion + '.json')
    if (!FS.existsSync(backupFilename)) {
      FS.writeFile(backupFilename, Storage.getExportJSON(), (err) => {
        if (err) throw err
      })
    }
  }
}
