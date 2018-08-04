<template>
  <div>
    <label>Import</label>

    <q-btn
      rounded dense
      label="Import JSON"
      color="negative"
      class="float-right"
      @click="importJSON(jsonImport)"
    />

    <q-input
      type="text"
      placeholder="{}"
      v-model="jsonImport"
    />
  </div>
</template>

<script>
import Storage from '../services/Storage'

export default {
  data () {
    return {
      jsonImport: ''
    }
  },

  methods: {
    importJSON (data) {
      Storage.importJSON(data)
    }
  }
}
</script>

<style>
</style>
