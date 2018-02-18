import Storage from '../Storage'

export default function () {
  let structure = Storage.structure

  for (let index in structure) {
    try {
      let structureData = structure[index]
      let userData = Storage.load(index)

      if (!userData) {
        Storage.save(index, structureData)
      }
      else {
        let newData = Object.assign(structureData, userData)
        Storage.save(index, newData)
      }
    }
    catch (e) {
      console.log(e)
    }
  }
}
