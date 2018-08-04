<template>
  <div class="container">

    <transition appear enter-active-class="animated fadeInDown">
      <div class="row navbar-buttons shadow-1" v-if="showOverlay">
        <div class="col-6 q-pa-sm">
          <q-btn
            rounded dense
            icon="add"
            label="New Tab"
            v-show="tabs.length === 0"
            @click="addTab({})"
          />
          <q-btn
            rounded dense
            icon="add"
            v-show="tabs.length > 0"
            @click="addTab({})"
          />

          <q-btn
            rounded dense
            icon="save"
            @click="save()"
          />

          <q-btn-group rounded dense>
            <q-btn
              rounded dense
              icon="edit"
              :color="panes.left ? 'primary' : null"
              @click="togglePane('left')"
            />

            <q-btn
              rounded dense
              icon="visibility"
              :color="panes.right ? 'primary' : null"
              @click="togglePane('right')"
            />
          </q-btn-group>
        </div>

        <div class="col-6 q-pa-sm aright">
          <q-btn-group rounded dense>
            <q-btn
              rounded dense
              icon="format_bold"
              @click="paste('**Text**')"
            />

            <q-btn
              rounded dense
              icon="format_italic"
              @click="paste('*Text*')"
            />

            <q-btn rounded dense>
              <q-icon name="expand_more"/>
              <text-options :paste="paste"></text-options>
            </q-btn>
          </q-btn-group>

          <q-btn rounded dense>
            <q-icon name="menu"/>
            <q-popover>
              <q-list separator link>
                <q-item>
                  Export
                  <export v-if="tabs[activeTab] && tabs.length >= 1"
                          :content="tabs[activeTab].content"
                          :name="tabs[activeTab].name"
                          :active-tab="activeTab"
                          :preview-visible="panes.right"
                  ></export>
                </q-item>

                <q-item v-close-overlay @click.native="$router.push('/settings')">
                  Settings
                </q-item>

                <q-item>
                  Debug
                  <debug></debug>
                </q-item>

                <q-item v-close-overlay @click.native="shortcutsModal = true">
                  Shortcuts

                  <q-modal v-model="shortcutsModal">
                    <div class="q-pa-md">
                      <shortcuts></shortcuts>
                      <div style="text-align: right;">
                        <q-btn color="primary" @click="shortcutsModal = false">Close</q-btn>
                      </div>
                    </div>
                  </q-modal>
                </q-item>

                <q-item v-close-overlay @click.native="aboutModal = true">
                  About

                  <q-modal v-model="aboutModal">
                    <div class="q-pa-md">
                      <about :packageInfo="packageInfo"></about>
                      <div style="text-align: right;">
                        <q-btn color="primary" @click="aboutModal = false">Close</q-btn>
                      </div>
                    </div>
                  </q-modal>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
        </div>
      </div>
    </transition>

    <div class="row">
      <div class="col-3 max">
        <tab-menu></tab-menu>
      </div>

      <!-- EDITOR -->
      <transition appear
                  enter-active-class="animated fadeIn"
      >
        <div class="col max q-pa-md" v-if="panes.left">
          <div v-for="(tab, index) in tabs"
               :key="index"
          >
            <edit-input :content="tab.content"
                        :index="Number(index)"
                        @update="setTabContent(index, $event)"
                        v-if="tabs[activeTab] && activeTab === Number(index)"
                        class="edit-input"
            ></edit-input>
          </div>
        </div>
      </transition>
      <!-- END EDITOR -->

      <!-- PREVIEW -->
      <transition appear
                  enter-active-class="animated fadeIn"
      >
        <div class="col max q-pa-md" v-if="panes.right">
          <div v-for="(tab, index) in tabs"
               :key="index"
          >
            <markdown-preview :tab="tab"
                              :id="'preview-' + index"
                              v-if="tabs[activeTab] && activeTab === Number(index)"
            ></markdown-preview>
          </div>
        </div>
      </transition>
      <!-- END PREVIEW -->

      <!-- NONE -->
      <transition appear
                  enter-active-class="animated fadeIn"
      >
        <div class="col max" v-if="!panes.left && !panes.right">
          <div class="absolute-center" style="text-align: center;">
            <h4 style="color: lightgrey">Literally nothing to see here :(</h4>
          </div>
        </div>
      </transition>
      <!-- END NONE -->
    </div>

    <q-fab
      color="primary"
      text-color="white"
      class="fixed animated fadeInUp"
      style="right: 10px; bottom: 10px;"
      icon="keyboard_arrow_left"
      direction="left"
    >
      <q-fab-action
        icon="assistant"
        color="primary"
        text-color="white"
        @click="applyMarkdownStyle()"
      >
        <q-tooltip>
          Prettify
        </q-tooltip>
      </q-fab-action>

      <q-fab-action
        icon="slideshow"
        :color="tabs[activeTab].slide ? 'warning' : 'primary'"
        text-color="white"
        @click="toggleSlides()"
        v-if="tabs[activeTab] && Object.keys(tabs[activeTab]).includes('slide')"
      >
        <q-tooltip>
          Toggle Presentation
        </q-tooltip>
      </q-fab-action>
    </q-fab>

    <q-modal v-model="searchModal">
      <div class="q-pa-md">
        <transition appear
                    leave-active-class="animated fadeOut"
                    enter-active-class="animated fadeIn"
        >
          <search v-if="searchModal"
                  :tabs="tabs"
                  :archive="archived"
                  :activetab="activeTab"
                  v-on:activetab="setActiveTab($event)"
                  v-on:restorearchivedtab="restoreArchivedTab($event)"
                  v-on:togglemodal="searchModal = !searchModal"
          ></search>
        </transition>
      </div>
    </q-modal>
  </div>
</template>

<script>
import { AppFullscreen } from 'quasar'

import About from '../pages/About'
import Debug from '../pages/Debug'
import EditInput from '../pages/EditInput'
import Essential from '../services/Essential'
import Export from '../pages/Export'
import ExportDialog from '../services/Export'
import Markdown from '../services/Markdown'
import MarkdownPreview from '../pages/MarkdownPreview'
import Mousetrap from 'mousetrap'
import Notification from '../services/Notification'
import Search from '../pages/Search'
import Shortcuts from '../pages/Shortcuts'
import StartupHandler from '../services/StartupHandler'
import Storage from '../services/Storage'
import TabMenu from '../components/TabMenu'
import TextOptions from '../components/TextOptions'

export default {
  components: {
    About,
    Debug,
    EditInput,
    Export,
    MarkdownPreview,
    Search,
    Shortcuts,
    TabMenu,
    TextOptions
  },

  data () {
    return {
      packageInfo: require('../../package.json'),

      shortcutsModal: false,
      aboutModal: false,
      searchModal: false,

      showTooltip: false,

      activeTab: 0,
      showOverlay: true,
      panes: {
        left: true,
        right: true
      },

      settings: {},

      tabs: [],
      archived: [],
      cloud: {}
    }
  },

  methods: {
    setActiveTab (tabIndex) {
      tabIndex = Number(tabIndex)
      if (!this.tabs[tabIndex]) {
        return
      }

      // Reset events to not duplicate them
      this.$off('content-updated')
      this.$off('content-paste')

      this.activeTab = tabIndex
    },

    addTab ({name = 'Unamed Tab', content = ''}) {
      let data = Essential.add({
        name: name,
        content: content
      })

      this.setActiveTab(Number(this.tabs.push(data)) - 1)

      this.save()
    },

    removeTab (index) {
      this.activeTab = Number(index - 1)

      this.tabs[index].slide = false

      this.$nextTick(() => {
        if (this.activeTab <= 0) {
          this.activeTab = null
        }

        this.tabs.splice(Number(index), 1)

        this.save()
      })
    },

    renameTab (index) {
      this.$q.dialog({
        title: 'Rename Tab',
        ok: true,
        cancel: true,

        prompt: {
          model: this.tabs[index].name,
          type: 'text'
        }
      })
        .then(data => {
          this.tabs[index].name = data
          this.save()
        })
    },

    archiveTab (index) {
      index = Number(index)
      this.archived.push(this.tabs[index])
      this.activeTab = index - 1
      this.tabs.splice(index, 1)

      this.save()
    },

    restoreArchivedTab (index) {
      index = Number(index)
      if (this.archived[index]) {
        this.tabs.push(this.archived[index])
        this.activeTab = this.tabs.length - 1
        this.archived.splice(index, 1)

        this.save()
      }
    },

    togglePane (paneName) {
      let settings = Storage.load('settings')

      this.panes[paneName] = !this.panes[paneName]
      settings.panes = this.panes

      Storage.save('settings', settings)
    },

    exportDoc () {
      ExportDialog.exportDialog(this.tabs[this.activeTab].content, this.tabs[this.activeTab].name, this.activeTab)
    },

    save () {
      Storage.save('archived', this.archived)
      Storage.save('tabs', this.tabs)
    },

    setTabContent (tabIndex, content) {
      this.tabs[tabIndex].content = content
    },

    applyMarkdownStyle () {
      let content = this.tabs[this.activeTab].content

      if (this.settings.replace) {
        let strings = this.settings.replaceList

        for (let string in strings) {
          while (content.indexOf(string) !== -1) {
            content = content.replace(string, strings[string])
          }
        }
      }

      content = Markdown.applyStyle(content)

      this.tabs[this.activeTab].content = String(content)

      this.$emit('content-updated')
    },

    toggleSlides () {
      let activeTab = this.tabs[this.activeTab]
      activeTab.slide = !activeTab.slide

      // Slide is active
      if (activeTab.slide) {
        // Disable editor
        if (this.panes.left) {
          this.togglePane('left')
        }

        // Enable Preview
        if (!this.panes.right) {
          this.togglePane('right')
        }
      } else {
        // Enable Editor
        if (!this.panes.left) {
          this.togglePane('left')
        }

        // Disable Preview
        if (this.panes.right) {
          this.togglePane('right')
        }
      }
    },

    paste (str) {
      let data = {
        index: this.activeTab,
        data: str
      }

      // Emit datato paste
      this.$emit('content-paste', data)
    }
  },

  created () {
    StartupHandler()

    this.tabs = Storage.load('tabs')

    this.archived = Storage.load('archived')

    this.settings = Storage.load('settings')
    this.panes = this.settings.panes

    this.cloud = Storage.load('cloud')

    Mousetrap.bind('ctrl+s', (e) => {
      this.save()
      Notification({title: 'Saved', type: 'info'})
    })
    Mousetrap.bind('ctrl+p', (e) => {
      this.applyMarkdownStyle()
      Notification({title: 'Beautified', type: 'info'})
    })
    Mousetrap.bind('ctrl+shift+s', (e) => {
      this.applyMarkdownStyle()
      this.save()
      Notification({title: 'Saved and Beautified', type: 'info'})
    })

    Mousetrap.bind('ctrl+f', (e) => {
      if (AppFullscreen.isCapable) {
        // request first time fullscreen
        AppFullscreen.request()
        AppFullscreen.toggle()
      }
    })

    Mousetrap.bind('ctrl+n', (e) => { this.addTab({}) })
    Mousetrap.bind('ctrl+w', (e) => { this.archiveTab(Number(this.activeTab)) })
    Mousetrap.bind('ctrl+q', (e) => { window.close() })
    Mousetrap.bind('option+down', (e) => { this.showOverlay = !this.showOverlay })
    Mousetrap.bind('option+left', (e) => { this.togglePane('left') })
    Mousetrap.bind('option+right', (e) => { this.togglePane('right') })
    Mousetrap.bind('option+s', (e) => { this.$router.push('/settings') })

    Mousetrap.bind('ctrl+space', (e) => { this.searchModal = !this.searchModal })

    Mousetrap.bind('option', (e) => {
      this.showTooltip = true

      if (this.tooltipTimeoout) clearTimeout(this.tooltipTimeoout)

      this.tooltipTimeoout = setTimeout(() => {
        this.showTooltip = false
      }, 5000)
    }, 'keydown')
    Mousetrap.bind('option', (e) => { this.showTooltip = false }, 'keyup')

    Mousetrap.bind('option+1', () => { this.setActiveTab(0) })
    Mousetrap.bind('option+2', () => { this.setActiveTab(1) })
    Mousetrap.bind('option+3', () => { this.setActiveTab(2) })
    Mousetrap.bind('option+4', () => { this.setActiveTab(3) })
    Mousetrap.bind('option+5', () => { this.setActiveTab(4) })
    Mousetrap.bind('option+6', () => { this.setActiveTab(5) })
    Mousetrap.bind('option+7', () => { this.setActiveTab(6) })
    Mousetrap.bind('option+8', () => { this.setActiveTab(7) })
    Mousetrap.bind('option+9', () => { this.setActiveTab(8) })
    Mousetrap.bind('option+0', () => { this.setActiveTab(9) })
  }
}
</script>

<style lang="scss" scoped>
.navbar-buttons {
  button {
    margin-right: 7.5px;
  }

  .q-btn-group {
    margin-right: 7.5px;
    button {
      margin-right: unset;
    }
  }
}

.max {
  max-height: calc(100vh - 44px);
  overflow-y: auto;
}
</style>
