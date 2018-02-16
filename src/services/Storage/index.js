import { Toast, Dialog } from 'quasar'

export default {
  load (name) {
    return JSON.parse(localStorage.getItem(name))
  },

  save (name, value) {
    try {
      localStorage.setItem(name, JSON.stringify(value))
      return true
    }
    catch (e) {
      Toast.create.negative({
        html: 'Could not save your notes!',
        icon: 'error',
        timeout: (60 * 1000),
        button: {
          label: 'More',
          handler () {
            Dialog.create({
              title: 'Error while saving notes',
              message: 'The problem is most likely that you ran out of space.',
              buttons: [
                'Close'
              ]
            })
          },
          color: 'white'
        }
      })
      return false
    }
  }
}
