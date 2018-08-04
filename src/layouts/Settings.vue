<template>
  <div class="container">
    <div class="row q-pa-sm animated fadeInDown shadow-1">
      <div class="col-6">
        <q-btn
          no-caps rounded dense
          icon="close"
          label="Cancel"
          color="negative"
          @click="cancel()"
        />
      </div>
      <div class="col-6 text-right">
        <q-btn
          no-caps rounded dense
          icon="save"
          label="Save"
          color="positive"
          @click="save()"
        />
      </div>
    </div>

    <div class="window-content animated fadeInUp">
      <div class="q-pa-md" style="width: 100vw;">
        <h1>{{ packageInfo.productName }}</h1>

        <br>

        <!-- REPLACE -->
        <div>
          <label>Replace</label>

          <div class="float-right">
            <q-btn-group rounded>
              <q-btn
                no-caps rounded dense
                label="Reset"
                color="secondary"
                @click="resetReplace()"
              />
              <q-btn
                no-caps rounded dense
                label="Disable"
                color="negative"
                v-if="settings.replace"
                @click="settings.replace = false; save()"
              />
              <q-btn
                no-caps rounded dense
                label="Enable"
                color="primary"
                v-if="!settings.replace"
                @click="settings.replace = true; save()"
              />
            </q-btn-group>
          </div>

          <table>
            <thead>
              <th>Input</th>
              <th>Result</th>
            </thead>
            <tbody>
              <tr
                v-for="(value, index) in settings.replaceList"
                :key="index"
              >
                <td>{{ index }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <br>

        <!-- IMPORT -->
        <json-import></json-import>

        <br>

        <!-- EXPORT -->
        <json-export></json-export>

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
import GithubGist from '../components/GithubGist'
import JsonExport from '../components/JsonExport'
import JsonImport from '../components/JsonImport'
import Storage from '../services/Storage'

export default {
  components: {
    GithubGist,
    JsonExport,
    JsonImport
  },

  data () {
    return {
      packageInfo: require('../../package.json'),

      settings: Storage.load('settings')
    }
  },

  methods: {
    cancel () {
      this.$router.push('/')
    },

    save () {
      Storage.save('settings', this.settings)
    },

    resetReplace () {
      this.settings.replaceList = Storage.getStructur().settings.replaceList

      this.save()
    }
  },

  created () {}
}
</script>

<style>
</style>
