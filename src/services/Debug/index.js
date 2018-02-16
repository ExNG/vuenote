import {
  Dialog,
  Toast
} from 'quasar'
import Storage from '../Storage'

export default {
  debugDialog () {
    Dialog.create({
      title: 'Debug Options',
      message: 'Hello traveler! This very dangerous and some say here be dragons. This is the last warning.',
      form: {},
      buttons: [
        'Cancel',
        {
          label: 'Clear cache (Deletes all settings, tabs and debug settings)',
          handler () {
            let struture = Storage.structure

            for (let name in struture) {
              Storage.unset(name)
            }

            Toast.create.negative({
              html: 'In order for the changes to take effect you need to restart Vuenite',
              icon: 'error',
              timeout: (60 * 1000)
            })
          }
        }
      ]
    })
  }
}
