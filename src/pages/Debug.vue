<template>
  <q-popover>
    <q-list separator link>
      <q-item v-close-overlay @click.native="clearCache()">
        Clear cache (Deletes all settings, tabs and debug settings)
      </q-item>
      <q-item v-close-overlay @click.native="testNotification()">
        Open test notification
      </q-item>
      <q-item v-close-overlay @click.native="openDevtools()">
        Open dev tools
      </q-item>
      <q-item v-close-overlay @click.native="openIssues()">
        Report issue (github.com/ExNG/vuenite/issues)
      </q-item>
      <q-item v-close-overlay>
        Cancel
      </q-item>
    </q-list>
  </q-popover>
</template>

<script>
import { shell, remote } from 'electron'
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

      Notification('Debug', 'In order for the changes to take effect you need to restart Vuenite')
    },

    testNotification () {
      Notification('Test Notification', [
        'Here`s a test notification!',
        'It does not have multiple lines.'
      ].join('\n'))
    },

    openDevtools () {
      remote.getCurrentWindow().toggleDevTools()
    },

    openIssues () {
      shell.openExternal('https://github.com/ExNG/vuenite/issues')
    }
  }
}
</script>

<style>
#debug-modal .btn {
  min-width: 80%;
}
</style>
