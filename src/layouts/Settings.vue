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

        <div>
          <label>Darkmode</label>

          <div class="pull-right">
            <button class="btn btn-primary"
                    v-show="!settings.darkmode"
                    @click="settings.darkmode = true; save()"
            >
              Enable
            </button>
            <button class="btn btn-primary"
                    v-show="settings.darkmode"
                    @click="settings.darkmode = false; save()"
            >
              Disable
            </button>
          </div>
        </div>

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

        <!-- IMPORT -->
        <json-import></json-import>

        <hr>

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
