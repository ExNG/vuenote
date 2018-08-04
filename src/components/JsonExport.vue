<template>
  <div>
    <label>Export</label>

    <q-btn
      rounded dense
      label="Export JSON"
      color="primary"
      class="float-right"
      @click="getExport()"
    />

    <q-input
      type="text"
      placeholder="{}"
      v-model="jsonExport"
    />

    <!-- <q-toggle
      label="Include All"
      v-model="all"
    />

    <table>
      <thead>
        <tr>
          <td>Field</td>
          <td>
            Include
          </td>
          <td>
            <button class="btn btn-default float-right"
                    @click="showTabs = !showTabs"
            >
              <span class="icon icon-down-open" v-show="!showTabs"></span>
              <span class="icon icon-up-open" v-show="showTabs"></span>
            </button>
          </td>
        </tr>
      </thead>
      <tbody v-show="showTabs">
        <tr v-for="(tab, index) in tabs"
            :key="index"
        >
          <td>{{ tab.name }}</td>
          <td colspan="2">
            <div class="checkbox">
              <label>
                <input type="checkbox"
                       v-model="included[index]"
                       :disabled="all"
                > Include
              </label>
            </div>
          </td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<script>
import Storage from '../services/Storage'

export default {
  data () {
    return {
      jsonExport: '',
      showTabs: false,

      all: true,
      tabs: [],
      included: {}
    }
  },

  methods: {
    getExport () {
      if (this.all) {
        this.jsonExport = Storage.getExportJSON()
      } else {
        let tabs = []

        for (let tabIndex in this.included) {
          if (this.included[tabIndex] === true) {
            tabs.push(this.tabs[tabIndex])
          }
        }

        this.jsonExport = JSON.stringify({
          tabs
        })
      }
    }
  },

  created () {
    this.tabs = Storage.load('tabs')

    for (let tabIndex in this.tabs) {
      this.included[tabIndex] = true
    }
  }
}
</script>

<style>
</style>
