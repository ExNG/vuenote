import Storage from '../Storage'
import Essential from '../Essential'

/**
 * This handler will run everytime the application starts.
 * It's there for usefull to make sure all keys are
 * present before they're called.
 */
export default function () {
  let appData = Storage.load('appData')

  if (!appData || !appData.version) {
    Storage.init()

    appData['version'] = require('../../../package.json').version

    Storage.save('appData', appData)
  }

  let structure = Storage.getStructur()

  // loop over every item
  for (let itemName in structure) {
    try {
      // default item value
      let structureData = structure[itemName]

      // existing userdata, if not set yet it will be by Storage service
      let userData = Storage.load(itemName)

      // check if it already exists
      if (!userData) {
        // no, save default value
        Storage.save(itemName, structureData)
      } else {
        // Add missing tab keys
        if (itemName === 'tabs' && userData.length >= 1) {
          let newTabs = []

          // Let all tabs go through tab creation
          for (let tab of userData) {
            newTabs.push(Essential.add(tab))
          }

          userData = newTabs
        }

        // yes, merge default value with existing data and save it
        let newData = Object.assign(structureData, userData)
        Storage.save(itemName, newData)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
