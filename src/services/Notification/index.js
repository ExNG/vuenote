import { Notify } from 'quasar'

export default function (title, description) {
  let timeout = (15 * 1000)

  try {
    console.log('here')
    console.log(Notify)
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

    let notificationObj = new Notification(title, {
      icon: 'statics/icon.png',
      body: description
    })

    notificationObj.onclick = () => {
      console.log('Notification clicked')
    }
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
