<template>
  <div>
    <label>Import</label>

    <input type="text" class="form-control" placeholder="{}" v-model="jsonImport">

    <button class="btn btn-warning"
            style="width: 100%;"
            @click="importJSON(jsonImport)"
    >Import JSON</button>
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
