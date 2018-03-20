import { Notify } from 'quasar'

export default function (title, description) {
  let timeout = (5 * 1000)

  try {
    Notify.create({
      message: title,
      timeout: timeout,
      type: 'info',

      color: 'positive',
      textColor: 'black',
      avatar: 'statics/icon.png',

      detail: description,
      position: 'bottom-left'
    })

    // TODO: Native notification not working on windows
    // let notificationObj = new Notification(title, {
    //   icon: 'statics/icon.png',
    //   body: description
    // })
    //
    // notificationObj.onclick = () => {
    //   console.log('Notification clicked')
    // }
  } catch (e) {
    Notify.create({
      message: 'Error occurred when displaying a notification',
      timeout: timeout,
      type: 'negative',
      avatar: 'statics/icon.png',
      position: 'bottom-left'
    })
  }
}
