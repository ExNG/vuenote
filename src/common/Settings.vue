<template>
  <div>
    <h1>{{ packageInfo.productName }} settings</h1>

    <hr>

    <!-- settings -->

    <div class="form-group">
      <label>Example input</label>
      <input type="text" class="form-control" placeholder="Placeholder ...">
    </div>

    <hr>

    <div class="row">
      <div class="col-xs-6">
        <button class="btn btn-negative"
                @click="toggleSettings()"
        >Close</button>
      </div>

      <div class="col-xs-6">
        <button class="btn btn-positive pull-right"
                @click="toggleSettings()"
        >Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import Storage from '../services/Storage'

export default {
  props: ['packageInfo'],

  data () {
    return {
      settings: Storage.load('settings')
    }
  },

  methods: {
    toggleSettings () {
      this.$emit('toggle-settings-pane')
    }
  }
}
</script>

<style>
</style>
