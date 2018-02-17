<template>
  <div class="btn-group">
    <button class="btn btn-default"
          @click.prevent="minimize()"
    >
      <span class="icon icon-down-open"></span>
    </button>

    <button class="btn btn-default"
          @click.prevent="maximize()"
    >
      <span class="icon icon-up-open"></span>
    </button>

    <button class="btn btn-default"
          @click.prevent="close()"
    >
      <span class="icon icon-cancel"></span>
    </button>
  </div>
</template>

<script>
import { remote } from 'electron'
var mainWindow = remote.getCurrentWindow()

export default {
  data () {
    return {}
  },

  methods: {
    minimize () {
      mainWindow.minimize()
    },

    maximize () {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      }
      else {
        mainWindow.maximize()
      }
    },

    close () {
      mainWindow.close()
    }
  }
}
</script>

<style>
</style>
