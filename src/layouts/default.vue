<template>
  <div class="window">
    <header class="toolbar toolbar-header animated fadeInDown">
      <div class="toolbar-actions">
        <div class="btn-group">
          <button class="btn btn-default"
                  v-for="(tab, index) in tabs"
                  :key="index"
                  @click="setActiveTab(Number(index))"
                  :class="{ 'active': activeTab === index }"
          >
            <span class="icon icon-doc-text-inv"></span>
            {{ tab.name }}

            <q-context-menu>
              <q-list link separator>
                <q-item v-close-overlay @click.native="renameTab(Number(index))">
                  <q-item-main label="Rename" />
                </q-item>

                <q-item v-close-overlay @click.native="archiveTab(Number(index))">
                  <q-item-main label="Archive" />
                </q-item>

                <q-item v-close-overlay @click.native="removeTab(Number(index))">
                  <q-item-main label="Close" />
                </q-item>
              </q-list>
            </q-context-menu>
          </button>
        </div>

        <button class="btn btn-primary"
                v-show="tabs.length === 0"
                @click="addTab()"
        >
          <span class="icon icon-plus icon-text" style="color: white;"></span>
          New Tab
        </button>

        <button class="btn btn-default"
                v-show="tabs.length >= 1"
                @click="addTab()"
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
                  <export :content="tabs[activeTab].content"
                          :name="tabs[activeTab].name"
                          :active-tab="activeTab"
                  ></export>
                </q-item>

                <q-item v-close-overlay @click.native="togglePane('settings')">
                  Settings
                </q-item>

                <q-item>
                  Debug
                  <debug></debug>
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

    <div class="window-content">
      <div class="pane-group" style="overflow: hidden;">
        <div class="pane-sm sidebar animated slideInLeft"
             v-if="panes.sm"
        >
          <nav class="nav-group">
            <h5 class="nav-group-title">Archive</h5>
            <span class="nav-group-item"
                  v-for="(note, index) in archived"
                  :key="index"
                  @click="restoreArchivedTab(index)"
            >
              <span class="icon icon-doc-text"></span>
              {{ note.name }}
            </span>
            <span class="nav-group-item" v-show="archived.length === 0">
              <span class="icon icon-info-circled"></span>
              No archived notes
            </span>
          </nav>
        </div>
        <div class="pane padded-more animated fadeInUp"
             v-if="panes.left"
        >
          <div v-for="(tab, index) in tabs"
               :key="index"
          >
            <edit-input :content="tab.content"
                        @update="setTabContent(index, $event)"
                        v-if="activeTab === Number(index)"
                        class="edit-input"
            ></edit-input>
          </div>
        </div>
        <div class="pane padded-more animated fadeInUp"
             v-if="panes.right"
        >
          <div v-for="(tab, index) in tabs"
               :key="index"
          >
            <markdown-preview :content="tab.content"
                              :id="'preview-' + index"
                              v-if="activeTab === Number(index)"
            ></markdown-preview>
          </div>
        </div>
        <div class="pane padded-more animated fadeIn"
             v-if="!panes.left && !panes.right"
        >
          <div class="absolute-center" style="text-align: center;">
            <h4 style="color: lightgrey">Literally nothing to see here :(</h4>
          </div>
        </div>

        <div class="pane padded-more animated fadeInRight"
             v-if="panes.settings"
        >
          <settings @toggle-settings-pane="togglePane('settings')"
                    :packageInfo="packageInfo"
          ></settings>
        </div>
      </div>
    </div>

    <footer class="toolbar toolbar-footer animated fadeInUp">
      <div class="toolbar-actions">
        <div class="pull-right">
          <button class="btn btn-default pull-right"
                  @click="applyMarkdownStyle()"
          >
            <span class="icon icon-feather"></span>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import About from '../pages/About'
import Debug from '../pages/Debug'
import EditInput from '../pages/EditInput'
import Export from '../pages/Export'
import ExportDialog from '../services/Export'
import Markdown from '../services/Markdown'
import MarkdownPreview from '../pages/MarkdownPreview'
import Settings from '../pages/Settings'
import StartupHandler from '../services/StartupHandler'
import Storage from '../services/Storage'

export default {
  components: {
    About,
    Debug,
    EditInput,
    Export,
    Settings,
    MarkdownPreview
  },

  data () {
    return {
      packageInfo: require('../../package.json'),

      aboutModal: false,

      activeTab: 0,
      panes: {
        sm: false,
        left: true,
        right: true,
        settings: false
      },

      tabs: [],
      archived: [],

      newTab: {
        name: 'New Tab',
        content: ''
      }
    }
  },

  methods: {
    setActiveTab (tabIndex) {
      this.activeTab = Number(tabIndex)
    },

    addTab (name = null, content = null) {
      let data = JSON.parse(JSON.stringify(this.newTab))
      data.name = name ? String(name) : String('Unamed Tab')
      data.content = content ? String(content) : String(Math.random())
      this.setActiveTab(Number(this.tabs.push(data)) - 1)
    },

    removeTab (index) {
      this.activeTab = Number(index - 1)
      this.tabs.splice(Number(index), 1)
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
        })
    },

    archiveTab (index) {
      index = Number(index)
      this.archived.push(this.tabs[index])
      Storage.save('archived', this.archived)
      this.activeTab = index - 1
      this.tabs.splice(index, 1)
    },

    togglePane (paneName) {
      let settings = Storage.load('settings')

      this.panes[paneName] = !this.panes[paneName]
      settings.panes = this.panes

      Storage.save('settings', settings)
    },

    restoreArchivedTab (index) {
      index = Number(index)
      this.tabs.push(this.archived[index])
      this.activeTab = this.tabs.length - 1
      this.archived.splice(index, 1)
      Storage.save('archived', this.archived)
    },

    exportDoc () {
      ExportDialog.exportDialog(this.tabs[this.activeTab].content, this.tabs[this.activeTab].name, this.activeTab)
    },

    save () {
      Storage.save('tabs', this.tabs)
    },

    setTabContent (tabIndex, content) {
      this.tabs[tabIndex].content = content
    },

    applyMarkdownStyle () {
      let content = this.tabs[this.activeTab].content
      content = Markdown.applyStyle(content)
      this.tabs[this.activeTab].content = String(content)

      this.$emit('content-updated')
    }
  },

  created () {
    StartupHandler()

    this.tabs = Storage.load('tabs')

    this.archived = Storage.load('archived')

    this.panes = Storage.load('settings').panes
  }
}
</script>

<style>
.edit-input {
  margin-left: -3px;
  padding-left: 3px;
  min-height: calc(100vh - 110px);
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 5px;
}
</style>
