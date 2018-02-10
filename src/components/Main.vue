<template>
  <div>
    <header class="toolbar toolbar-header">
      <h1 class="title">Header with actions</h1>

      <div class="toolbar-actions">
        <div class="btn-group">
          <button class="btn btn-default"
                  v-for="(tab, index) in tabs"
                  @click="setActiveTab(Number(index))"
          >
            <span class="icon icon-doc-text-inv"></span>
            {{ tab.name }} - {{ Number(index) }}
          </button>
        </div>

        <button class="btn btn-primary"
                v-show="tabs.length === 0"
                @click="addTab()"
        >
          <span class="icon icon-plus icon-text"></span>
          New Tab
        </button>

        <button class="btn btn-default"
                v-show="tabs.length >= 1"
                @click="addTab()"
        >
          <span class="icon icon-plus-circled"></span>
        </button>

        <button class="btn btn-default">
          <span class="icon icon-home icon-text"></span>
          Filters
        </button>

        <button class="btn btn-default btn-dropdown pull-right">
          <span class="icon icon-megaphone"></span>
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
import EditInput from '../common/EditInput'

export default {
  components: {
    EditInput
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
