<template>
  <div class="btn-group">
    <button class="btn btn-default">
      <span class="icon icon-down-open"
            @click.prevent="minimize()"
      ></span>
    </button>

    <button class="btn btn-default">
      <span class="icon icon-up-open"
            @click.prevent="maximize()"
      ></span>
    </button>

    <button class="btn btn-default">
      <span class="icon icon-cancel"
            @click.prevent="close()"
      ></span>
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
