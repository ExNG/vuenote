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

    <!-- REPLACE -->
    <div>
      <button class="btn btn-default"
              @click="resetReplace()"
      >
        Reset
      </button>

      <div class="pull-right">
        <button class="btn btn-negative"
                v-show="settings.replace"
                @click="settings.replace = false; save()"
        >
          Disable
        </button>
        <button class="btn btn-positive"
                v-show="!settings.replace"
                @click="settings.replace = true; save()"
        >
          Enable
        </button>
      </div>

      <br><br>

      <table>
        <thead>
          <th>Input</th>
          <th>Result</th>
        </thead>
        <tbody>
          <tr v-for="(value, index) in settings.replaceList"
              :key="index"
          >
            <td>{{ index }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr>

    <div class="form-group">
      <label>Import</label>
      <input type="text" class="form-control" placeholder="{}" v-model="jsonImport">

      <button class="btn btn-warning"
              style="width: 100%;"
              @click="importJSON(jsonImport)"
      >Import JSON</button>
    </div>

    <div class="form-group">
      <label>Export</label>
      <input type="text" class="form-control" placeholder="{}" v-model="jsonExport">

      <button class="btn btn-primary"
              style="width: 100%;"
              @click="getExport()"
      >Generate Export JSON</button>
    </div>

    <hr>

    <backup-table></backup-table>

    <hr>

    <div class="row">
      <div class="col-xs-6">
        <button class="btn btn-negative"
                @click="toggleSettings()"
        >Close</button>
      </div>

      <div class="col-xs-6">
        <button class="btn btn-positive pull-right"
                @click="save(); toggleSettings()"
        >Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import BackupTable from '../components/BackupTable'
import Storage from '../services/Storage'

export default {
  props: ['packageInfo'],

  components: {
    BackupTable
  },

  data () {
    return {
      settings: Storage.load('settings'),
      jsonExport: null,
      jsonImport: null
    }
  },

  methods: {
    save () {
      Storage.save('settings', this.settings)
    },

    toggleSettings () {
      this.$emit('toggle-settings-pane')
    },

    getExport () {
      this.jsonExport = Storage.getExportJSON()
    },

    importJSON (data) {
      Storage.importJSON(data)
    },

    resetReplace () {
      // TODO: Structure is returning wrong data
      // ... so basically reset is not working
      this.settings.replaceList = Storage.structure.settings.replaceList

      this.save()
    }
  }
}
</script>

<style>
</style>
