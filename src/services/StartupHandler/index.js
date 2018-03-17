import Storage from '../Storage'
import OS from 'os'
import Path from 'path'
import FS from 'fs'
import Moment from 'moment'

/**
 * This handler will run everytime the application starts.
 * It's there for usefull to make sure all keys are
 * present before they're called.
 */
export default function () {
  // check if vuenite dir exists
  let vueniteDir = Path.join(OS.homedir(), '.vuenite')
  if (!FS.existsSync(vueniteDir)) {
    FS.mkdir(vueniteDir)
  }

  // check if backup dir exists
  let backupDir = Path.join(vueniteDir, 'backup')
  if (!FS.existsSync(backupDir)) {
    FS.mkdir(backupDir)
  }

  // check if backup already exists, if not do it (async)
  let backupFilename = Path.join(backupDir, Moment().format('YYYY-MM-DD_HH:MM') + '.json')
  if (!FS.existsSync(backupFilename)) {
    FS.writeFile(backupFilename, Storage.getExportJSON(), (err) => {
      if (err) throw err
    })
  }

  console.error('backupFilename', backupFilename)

  let structure = Storage.structure

  // loop over every item
  for (let index in structure) {
    try {
      // default item value
      let structureData = structure[index]

      // existing userdata, if not set yet it will be by Storage service
      let userData = Storage.load(index)

      // check if it already exists
      if (!userData) {
        // no, save default value
        Storage.save(index, structureData)
      } else {
        // yes, merge default value with existing data and save it
        let newData = Object.assign(structureData, userData)
        Storage.save(index, newData)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
