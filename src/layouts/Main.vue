<template>
  <div class="window">

    <transition appear
                enter-active-class="animated fadeInDown"
    >
      <header class="toolbar toolbar-header animated fadeInDown"
              v-if="showOverlay"
      >
        <div class="toolbar-actions">
          <button class="btn btn-primary"
                  v-show="tabs.length === 0"
                  @click="addTab({})"
          >
            <span class="icon icon-plus icon-text" style="color: white;"></span>
            New Tab
          </button>

          <button class="btn btn-default"
                  v-show="tabs.length >= 1"
                  @click="addTab({})"
          >
            <span class="icon icon-plus-circled"></span>
          </button>

          <button class="btn btn-default"
                  @click="save()"
          >
            <span class="icon icon-floppy icon-text"></span>
            Save
          </button>

          <div class="btn-group">
            <button class="btn btn-default"
                    @click="togglePane('sm')"
                    :class="{ 'active': panes.sm }"
            >
              <span class="icon icon-bookmark"></span>
            </button>
            <button class="btn btn-default"
                    @click="togglePane('left')"
                    :class="{ 'active': panes.left }"
            >
              <span class="icon icon-pencil"></span>
            </button>
            <button class="btn btn-default"
                    @click="togglePane('right')"
                    :class="{ 'active': panes.right }"
            >
              <span class="icon icon-eye"></span>
            </button>
          </div>

          <div class="pull-right">
            <button class="btn btn-default btn-dropdown">
              <span class="icon icon-menu icon-text"></span>
              <!-- Menu -->
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
                      <div class="padded-more">
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
                      <div class="padded-more">
                        <about :packageInfo="packageInfo"></about>
                        <div style="text-align: right;">
                          <q-btn color="primary" @click="aboutModal = false">Close</q-btn>
                        </div>
                      </div>
                    </q-modal>
                  </q-item>
                </q-list>
              </q-popover>
            </button>
          </div>

        </div>
      </header>
    </transition>

    <div class="window-content">
      <div class="pane-group" style="overflow: hidden;">
        <transition appear
                    enter-active-class="animated fadeInLeft"
        >
          <div class="pane-sm sidebar"
               v-if="panes.sm"
          >
            <nav class="nav-group">
              <h5 class="nav-group-title">
                <span class="icon icon-doc-text-inv"></span>
                Tabs
              </h5>
              <transition-group appear
                                enter-active-class="animated fadeInLeft"
                                leave-active-class="animated fadeOutLeft"
              >
                <span class="nav-group-item cursor-pointer"
                      :class="{ 'active': activeTab === Number(index) }"
                      v-for="(tab, index) in tabs"
                      :key="`tab-${index}`"
                      @click="setActiveTab(Number(index))"
                >
                  <span class="icon icon-doc-text"></span>

                  <small class="pull-left"
                         style="width: 10px; margin-right: 2.5px;"
                  >
                    <span v-if="showTooltip && (Number(index) + 1 <= 10)">
                      {{ index + 1 }}
                    </span>
                  </small>

                  {{ tab.name }}

                  <tab-context @rename="renameTab(Number(index))"
                               @archive="archiveTab(Number(index))"
                               @close="removeTab(Number(index))"
                  ></tab-context>
                </span>
              </transition-group>

              <h5 class="nav-group-title">
                <span class="icon icon-archive"></span>
                Archive
              </h5>
              <transition-group appear
                                enter-active-class="animated fadeInLeft"
                                leave-active-class="animated fadeOutLeft"
              >
                <span class="nav-group-item cursor-pointer"
                      v-for="(note, index) in archived"
                      :key="`archive-${index}`"
                      @click="restoreArchivedTab(Number(index))"
                >
                  <span class="icon icon-doc-text"></span>
                  {{ note.name }}
                </span>
              </transition-group>
              <transition appear
                          enter-active-class="animated fadeInLeft"
                          leave-active-class="animated fadeOutLeft"
              >
                <span class="nav-group-item" v-show="archived.length === 0">
                  <span class="icon icon-info-circled"></span>
                  No archived notes
                </span>
              </transition>

              <h5 class="nav-group-title">
                <span class="icon icon-cloud"></span>
                Cloud
              </h5>
              <cloud-list @addTab="addTab($event); save()"
                          :cloud="cloud"
                          :packageInfo="packageInfo"
              ></cloud-list>
            </nav>
          </div>
        </transition>

        <transition appear
                    enter-active-class="animated fadeInUp"
        >
          <div class="pane padded-more"
               v-if="panes.left"
          >
            <div v-for="(tab, index) in tabs"
                 :key="index"
            >
              <edit-input :content="tab.content"
                          @update="setTabContent(index, $event)"
                          v-if="tabs[activeTab] && activeTab === Number(index)"
                          class="edit-input"
              ></edit-input>
            </div>
          </div>
        </transition>

        <transition appear
                    enter-active-class="animated fadeInUp"
        >
          <div class="pane padded-more"
               v-if="panes.right"
          >
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

        <transition appear
                    enter-active-class="animated fadeIn"
        >
          <div class="pane padded-more"
               v-if="!panes.left && !panes.right"
          >
            <div class="absolute-center" style="text-align: center;">
              <h4 style="color: lightgrey">Literally nothing to see here :(</h4>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <transition appear
                enter-active-class="animated fadeInUp"
    >
      <footer class="toolbar toolbar-footer animated fadeInUp"
              v-if="showOverlay"
      >
        <div class="toolbar-actions">
          <div class="pull-right">
            <button class="btn btn-default"
                    v-if="tabs[activeTab] && Object.keys(tabs[activeTab]).includes('slide')"
                    @click="toggleSlides()"
                    :class="{ 'btn-primary': tabs[activeTab].slide }"
            >
              <span class="icon icon-doc-landscape"
                    :class="{ 'text-white': tabs[activeTab].slide }"
              ></span>
            </button>

            <button class="btn btn-default"
                    @click="applyMarkdownStyle()"
            >
              <span class="icon icon-feather"></span>
            </button>
          </div>
        </div>
      </footer>
    </transition>

    <q-modal v-model="searchModal">
      <div class="padded-more">
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
import { remote } from 'electron'

import About from '../pages/About'
import CloudList from '../pages/CloudList'
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
import TabContext from '../components/TabContext'

export default {
  components: {
    About,
    Debug,
    CloudList,
    EditInput,
    Export,
    Search,
    Shortcuts,
    TabContext,
    MarkdownPreview
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
        sm: false,
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
      let isFullscreen = remote.getCurrentWindow().isFullScreen()
      remote.getCurrentWindow().setFullScreen(!isFullscreen)
    })

    Mousetrap.bind('ctrl+n', (e) => { this.addTab({}) })
    Mousetrap.bind('ctrl+w', (e) => { this.archiveTab(Number(this.activeTab)) })
    Mousetrap.bind('ctrl+q', (e) => { require('electron').remote.app.quit() })
    Mousetrap.bind('option+down', (e) => { this.showOverlay = !this.showOverlay })
    Mousetrap.bind('option+up', (e) => { this.togglePane('left') })
    Mousetrap.bind('option+left', (e) => { this.togglePane('sm') })
    Mousetrap.bind('option+right', (e) => { this.togglePane('right') })
    Mousetrap.bind('option+s', (e) => { this.$router.push('/settings') })

    Mousetrap.bind('ctrl+space', (e) => { this.searchModal = !this.searchModal })

    Mousetrap.bind('option', (e) => {
      this.showTooltip = true

      setTimeout(() => {
        this.showTooltip = false
      }, 5000)
    }, 'keydown')
    Mousetrap.bind('option', (e) => { this.showTooltip = false }, 'keyup')

    Mousetrap.bind('option+1', (e) => { this.setActiveTab(0) })
    Mousetrap.bind('option+2', (e) => { this.setActiveTab(1) })
    Mousetrap.bind('option+3', (e) => { this.setActiveTab(2) })
    Mousetrap.bind('option+4', (e) => { this.setActiveTab(3) })
    Mousetrap.bind('option+5', (e) => { this.setActiveTab(4) })
    Mousetrap.bind('option+6', (e) => { this.setActiveTab(5) })
    Mousetrap.bind('option+7', (e) => { this.setActiveTab(6) })
    Mousetrap.bind('option+8', (e) => { this.setActiveTab(7) })
    Mousetrap.bind('option+9', (e) => { this.setActiveTab(8) })
    Mousetrap.bind('option+0', (e) => { this.setActiveTab(9) })
  }
}
</script>

<style>
</style>
