<template>
  <div style="text-align: center;">
    <input type="text"
           placeholder="Search"
           v-model="search"
           id="searchbox"
           class="form-control mousetrap"
           tabindex="1000"
    >

    <br>
    <br>

    <table>
      <tbody id="search-tabs-container"
             v-if="settings.tabs"
      >
        <!-- TABS -->
        <tr>
          <td class="border-below">
            <small>
              <span class="icon icon-doc-text-inv"></span>
              Open Tabs
            </small>
          </td>
        </tr>
        <tr v-for="(tab, index) in tabs"
            :key="index"
            v-if="index < 10 && applySearch(tab)"
        >
          <td @click="setActiveTab(index)"
              @keydown.enter="setActiveTab(index)"
              :tabindex="1000 + index"
          >
            {{ tab.name }}
          </td>
        </tr>
      </tbody>

      <tbody id="search-tabs-container"
             v-if="settings.archived"
      >
        <!-- ARCHIVED TABS -->
        <tr>
          <td class="border-below">
            <small>
              <span class="icon icon-archive"></span>
              Archive
            </small>
          </td>
        </tr>
        <tr v-for="(tab, index) in archive"
            :key="index"
            v-if="index < 10 && applySearch(tab)"
        >
          <td @click="restoreArchivedTab(index)"
              @keydown.enter="restoreArchivedTab(index)"
              :tabindex="1100 + index"
          >
            {{ tab.name }}
          </td>
        </tr>
      </tbody>
    </table>

    <small>
      <span class="icon icon-help"></span>
      <b>Pro tip</b>: <code>Ctrl + Shift + Space</code> toggles the search settings
    </small>

    <q-fab v-model="fab"
           color="white"
           text-color="grey-7"
           class="fixed animated fadeInUp"
           style="left: 10px; bottom: 10px;"
           icon="keyboard_arrow_up"
           direction="up"
    >
      <!-- TOOLTIP FOR TOGGLE -->
      <q-tooltip slot="tooltip"
                 anchor="center left"
                 self="center right"
                 :offset="[10, 0]"
      >
        Search Settings
      </q-tooltip>

      <!-- TABS TOGGLE -->
      <q-fab-action :color="tabsSettingsColor[0]"
                    :text-color="tabsSettingsColor[1]"
                    icon="tab"
                    @click="toggleSetting('tabs')"
      >
        <q-tooltip anchor="center left"
                   self="center right"
                   :offset="[20, 0]"
        >
          Toggle Tabs
        </q-tooltip>
      </q-fab-action>

      <q-fab-action :color="archivedSettingsColor[0]"
                    :text-color="archivedSettingsColor[1]"
                    icon="archive"
                    @click="toggleSetting('archived')"
      >
        <q-tooltip anchor="center left"
                   self="center right"
                   :offset="[20, 0]"
        >
          Toggle Archived
        </q-tooltip>
      </q-fab-action>
    </q-fab>
  </div>
</template>

<script>
import Mousetrap from 'mousetrap'
import Storage from '../services/Storage'

export default {
  props: ['tabs', 'archive'],

  data () {
    return {
      search: '',
      fab: false,
      settings: {
        tabs: true,
        archived: true
      }
    }
  },

  computed: {
    tabsSettingsColor () {
      if (this.settings.tabs) {
        return ['primary', 'white']
      } else {
        return ['white', 'grey-7']
      }
    },

    archivedSettingsColor () {
      if (this.settings.archived) {
        return ['primary', 'white']
      } else {
        return ['white', 'grey-7']
      }
    }
  },

  methods: {
    applySearch (tab) {
      let low = (string) => {
        return string.toLowerCase()
      }

      return low(tab.name).indexOf(low(this.search)) > -1 || low(tab.content).indexOf(low(this.search)) > -1
    },

    setActiveTab (index) {
      this.$emit('activetab', index)
      this.$emit('togglemodal')
    },

    restoreArchivedTab (index) {
      this.$emit('restorearchivedtab', index)
      this.$emit('togglemodal')
    },

    getSearchSettings () {
      let settings = Storage.load('settings').search
      if (settings) {
        this.settings = settings
      }
    },

    toggleSetting (name) {
      this.settings[name] = !this.settings[name]

      let settings = Storage.load('settings')
      settings.search = this.settings
    }
  },

  created () {
    this.getSearchSettings()

    setTimeout(() => {
      document.querySelector('#searchbox').focus()
    }, 0)

    Mousetrap.bind('ctrl+shift+space', (e) => { this.fab = !this.fab })
  }
}
</script>

<style>
#searchbox {
  width: 50vw;
}

/* .search-active {
  color: white;
  background-color: #116cd6;
} */

.border-below {
  border-bottom: solid 1px lightgrey;
  padding-top: 10px;
}
</style>
