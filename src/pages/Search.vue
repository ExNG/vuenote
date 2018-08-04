<template>
  <div>
    <q-input
      id="searchbox"
      class="mousetrap"
      type="text"
      float-label="Search"
      tabindex="1000"
      v-model="search"
    />

    <br>

    <div class="row" v-if="settings.tabs">
      <div class="col-12" v-if="settings.tabs">
        <b>Tabs</b>
      </div>
      <div
        class="col-12 cursor-pointer"
        v-for="(tab, index) in tabs"
        :key="index"
        v-if="settings.tabs && index < 10 && applySearch(tab)"
        @click="setActiveTab(index)"
        @keydown.enter="setActiveTab(index)"
        :tabindex="1000 + index"
      >
        {{ tab.name }}
      </div>
    </div>

    <br>

    <div class="row" v-if="settings.archived">
      <div class="col-12" v-if="settings.archived">
        <b>Archive</b>
      </div>
      <div
        class="col-12 cursor-pointer"
        v-for="(tab, index) in archive"
        :key="index"
        v-if="settings.archived && index < 10 && applySearch(tab)"
        @click="restoreArchivedTab(index)"
        @keydown.enter="restoreArchivedTab(index)"
        :tabindex="1100 + index"
      >
        {{ tab.name }}
      </div>
    </div>

    <br>

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
      Storage.save('settings', settings)
    }
  },

  created () {
    this.getSearchSettings()

    this.$nextTick(() => {
      let el = this.$el.querySelector('input#searchbox')

      el.classList.add('mousetrap') // Hack to add class to input to allow shortcut detection

      setTimeout(() => {
        el.focus()
      }, 0)
    })

    Mousetrap.bind('ctrl+shift+space', () => { this.fab = !this.fab })
  }
}
</script>

<style>
input#searchbox {
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
