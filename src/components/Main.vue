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

        <button class="btn btn-default">
          <span class="icon icon-home"></span>
          Filters
        </button>

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

    <div v-for="(tab, index) in tabs">
      <div v-show="activeTab === Number(index)">
        <edit-input :content="tabs[index].content" @update="tabs[index].content = $event"></edit-input>
      </div>
    </div>
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

export default {
  components: {
    EditInput,
    About,
    QPopover,
    QContextMenu,
    QList,
    QItem,
    QModal,
    QBtn,
    Dialog
  },

  data () {
    return {
      activeTab: 0,

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

    addTab () {
      let data = JSON.parse(JSON.stringify(this.newTab))
      data.content = Math.random()
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
    }
  },

  created () {
    // let data = JSON.parse(JSON.stringify(this.newTab))
    // data.content = Math.random()
    // this.tabs.push(data)
    //
    // let otherData = this.newTab
    // otherData.content = Math.random()
    // this.tabs.push(otherData)
  }
}
</script>

<style>
</style>
