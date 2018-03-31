<template>
  <div class="window">
    <header class="toolbar toolbar-header animated fadeInDown">
      <div class="toolbar-actions">
        <button class="btn btn-primary"
                @click="cancel()"
        >
          <span class="icon icon-left-open" style="color: white;"></span>
          Back
        </button>
      </div>
    </header>

    <div class="window-content animated fadeInUp">
      <div class="padded-more" style="width: 100vw;">
        <h1>{{ packageInfo.productName }}</h1>

        <hr>

        <!-- REPLACE -->
        <div>
          <label>Replace</label>

          <div class="pull-right">
            <button class="btn btn-default"
                    @click="resetReplace()"
            >
              Reset
            </button>
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

        <!-- IMPORT/EXPORT -->
        <div>
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
        </div>

        <hr>

        <!-- BACKUPS -->
        <backup-table></backup-table>

        <hr>

        <!-- GITHUB GIST -->
        <github-gist></github-gist>
      </div>
    </div>

    <footer class="toolbar toolbar-footer animated fadeInUp">
      <div class="toolbar-actions">
        <button class="btn btn-negative"
                @click="cancel()"
        >
          <span class="icon icon-cancel" style="color: white;"></span>
          Cancel
        </button>

        <div class="pull-right">
          <button class="btn btn-positive"
                  @click="save()"
          >
            <span class="icon icon-floppy" style="color: white;"></span>
            Save
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import BackupTable from '../components/BackupTable'
import GithubGist from '../components/GithubGist'
import Storage from '../services/Storage'

export default {
  components: {
    BackupTable,
    GithubGist
  },

  data () {
    return {
      packageInfo: require('../../package.json'),

      settings: Storage.load('settings'),

      jsonImport: '',
      jsonExport: ''
    }
  },

  methods: {
    cancel () {
      this.$router.push('/')
    },

    save () {
      Storage.save('settings', this.settings)
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
  },

  created () {}
}
</script>

<style>
</style>
