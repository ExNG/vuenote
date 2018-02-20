import Storage from '../Storage'


/**
 * This handler will run everytime the application starts.
 * It's there for usefull to make sure all keys are
 * present before they're called.
 */
export default function () {
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
      }
      else {
        // yes, merge default value with existing data and save it
        let newData = Object.assign(structureData, userData)
        Storage.save(index, newData)
      }
    }
    catch (e) {
      console.log(e)
    }
  }
}
