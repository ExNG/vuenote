import { Toast } from 'quasar'

export default function (title, description) {
  try {
    let notificationObj = new Notification(title, {
      icon: '../icons/icon.png',
      body: description
    })

    notificationObj.onclick = () => {
      console.log('Notification clicked')
    }
  }
  catch (e) {
    Toast.create.negative({
      html: 'Error occurred when displaying a notification',
      icon: 'alarm_add',
      timeout: (15 * 1000)
    })
  }
}
