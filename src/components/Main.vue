<template>
  <div class="window">
    <header class="toolbar toolbar-header">
      <!-- <h1 class="title">Header with actions</h1> -->

      <div class="toolbar-actions">
        <div class="btn-group">
          <button class="btn btn-default"
                  v-for="(tab, index) in tabs"
                  @click="setActiveTab(Number(index))"
                  :class="{ 'active': activeTab === index }"
          >
            <span class="icon icon-doc-text-inv"></span>
            {{ tab.name }}

            <q-context-menu ref="context">
              <q-list separator link>
                <q-item @click="renameTab(Number(index)), $refs.context.close()">
                  Rename
                </q-item>
                <q-item @click="removeTab(Number(index)), $refs['context' + index].close()">
                  Close
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
                disabled
        >
          <span class="icon icon-floppy icon-text"></span>
          <!-- WONT SAVE, FOR TESTING -->
          Save
        </button>

        <div class="btn-group">
          <button class="btn btn-default"
                  @click="panes = 'left'"
                  :class="{ 'active': panes === 'left' }"
          >
            <span class="icon icon-pencil"></span>
          </button>
          <button class="btn btn-default"
                  @click="panes = 'all'"
                  :class="{ 'active': panes === 'all' }"
          >
            <span class="icon icon-window"></span>
          </button>
          <button class="btn btn-default"
                  @click="panes = 'right'"
                  :class="{ 'active': panes === 'right' }"
          >
            <span class="icon icon-eye"></span>
          </button>
        </div>

        <button class="btn btn-default btn-dropdown pull-right">
          <span class="icon icon-menu icon-text"></span>
          <!-- Menu -->
          <q-popover ref="popover">
            <q-list separator link>
              <q-item @click="$refs.aboutModal.open(), $refs.popover.close()">
                About
                <q-modal ref="aboutModal">
                  <div class="padded-more">
                    <h4>About</h4>
                    <about></about>
                    <q-btn color="primary" @click="$refs.aboutModal.close()">Close</q-btn>
                  </div>
                </q-modal>
              </q-item>
            </q-list>
          </q-popover>
        </button>
      </div>
    </header>

    <div class="window-content">
      <div class="pane-group">
        <div class="pane padded-more"
             v-show="panes === 'all' || panes === 'left'"
        >
          <div v-for="(tab, index) in tabs">
            <edit-input :content="tab.content"
                        @update="setTabContent(index, $event)"
                        v-show="activeTab === Number(index)"
                        style="margin-left: -3px; padding-left: 3px; min-height: calc(100vh - 75px);"
            ></edit-input>
          </div>
        </div>
        <div class="pane padded-more"
             v-show="panes === 'all' || panes === 'right'"
        >
          <div v-for="(tab, index) in tabs">
            <markdown-preview :content="tab.content"
                              v-show="activeTab === Number(index)"
            ></markdown-preview>
          </div>
        </div>
      </div>
    </div>

    <test></test>
  </div>
</template>

<script>
import {
  QPopover,
  QContextMenu,
  QList,
  QItem,
  QModal,
  QBtn,
  Dialog
} from 'quasar'
import EditInput from '../common/EditInput'
import About from '../common/About'
import Test from '../common/Test'
import MarkdownPreview from '../common/MarkdownPreview'

export default {
  components: {
    EditInput,
    About,
    Test,
    QPopover,
    QContextMenu,
    QList,
    QItem,
    QModal,
    QBtn,
    Dialog,
    MarkdownPreview
  },

  data () {
    return {
      activeTab: 0,
      panes: 'all',

      tabs: [],

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
      this.tabs.splice(Number(index), 1)
    },

    renameTab (index) {
      let here = this
      Dialog.create({
        title: 'Rename Tab',
        // message: '',
        form: {
          title: {
            type: 'text',
            label: 'Textbox',
            model: here.tabs[index].name,
            min: 3
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Apply',
            handler (data) {
              here.tabs[index].name = data.title
            }
          }
        ]
      })
    },

    save () {
      console.log('saved', JSON.stringify(this.tabs))
    },

    setTabContent (tabIndex, content) {
      this.tabs[tabIndex].content = content
    }
  },

  created () {
    // later check if there are existing saves
    let loadNotes = false

    if (loadNotes) {
      this.tabs = []
    }
    else {
      let content = [
        '# Welcome',
        '',
        '---',
        '',
        'Vuenite supports full Markdown syntax,',
        '',
        '## Typography',
        '',
        'Name | Usage | Alternative usage',
        '--- | --- | ----',
        '*Italic* | `*Text*` | `_Text_`',
        '**Strong** | `**Text**` | `__Text__`',
        '~~Strikethrough~~ | `~~Text~~` |',
        '> Blockquote | `> Text` |',
        '',
        '## Lists',
        '',
        'Name | Usage',
        '--- | ---',
        'Simple List | `- Text` or `* Text` or `+ Text`',
        'Simple List Child | `   - Text`',
        'Numbered List | `1. Text`',
        '',
        '## Links',
        '',
        'Links can be automatically detected, but you should use the markdown way if you want to be sure.',
        '',
        '`[Text](http://www.link-to.url)`',
        '',
        '## Images',
        '',
        '`![Alt Text](http://link.to/image)`',
        '',
        '## Tables',
        '',
        'Normal | Centered | Right aligned',
        '--- | :---: | ---:',
        'Text | Text | Text',
        '',
        '---',
        '',
        'This is just a short introdution to Markdown, take a look at [this Github article](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for more in depth information',
        ''
      ]

      content = content.join('\n')

      this.addTab('Welcome',
        content
      )
    }
  }
}
</script>

<style>
</style>
