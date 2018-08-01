<template>
  <q-popover>
    <q-list separator link>
      <q-item v-close-overlay @click.native="clearCache()">
        Clear cache (Deletes all settings, tabs and debug settings)
      </q-item>
      <q-item v-close-overlay @click.native="testNotification()">
        Open test notifications
      </q-item>
      <q-item v-close-overlay>
        <a href="https://github.com/ExNG/vuenote/issues">
          Report issue (github.com/ExNG/vuenote/issues)
        </a>
      </q-item>
      <q-item v-close-overlay>
        Cancel
      </q-item>
    </q-list>
  </q-popover>
</template>

<script>
import Notification from '../services/Notification'
import Storage from '../services/Storage'

export default {
  data () {
    return {}
  },

  methods: {
    clearCache () {
      let struture = Storage.structure

      for (let name in struture) {
        Storage.unset(name)
      }

      Notification({title: 'Debug', description: 'In order for the changes to take effect you need to restart Vuenote'})
    },

    testNotification () {
      Notification({title: 'Test Notification', description: 'Here`s a test notification! Default'})
      Notification({title: 'Test Notification', description: 'Here`s a test notification! Positive', type: 'positive'})
      Notification({title: 'Test Notification', description: 'Here`s a test notification! Negative', type: 'negative'})
      Notification({title: 'Test Notification', description: 'Here`s a test notification! Warning', type: 'warning'})
      Notification({title: 'Test Notification', description: 'Here`s a test notification! info', type: 'info'})
    }
  }
}
</script>

<style>
#debug-modal .btn {
  min-width: 80%;
}
</style>
