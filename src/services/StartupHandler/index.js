import Backup from '../Backup'
import Storage from '../Storage'
import Tab from '../Tab'

/**
 * This handler will run everytime the application starts.
 * It's there for usefull to make sure all keys are
 * present before they're called.
 */
export default function () {
  // Backup before structure merge
  Backup.create('')

  let structure = Storage.structure

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
            newTabs.push(Tab.add(tab))
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

  // Backup after structure merge
  Backup.create('_AfterMerge')
}
