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
      <tbody id="search-tabs-container">
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
  </div>
</template>

<script>
export default {
  props: ['tabs', 'modal', 'archive'],

  data () {
    return {
      search: ''
    }
  },

  watch: {
    modal () {
      if (!this.modal) {
        this.search = ''
      } else {
        // Why is this working but not $nextTick ?!
        setTimeout(() => {
          document.querySelector('#searchbox').focus()
        }, 0)
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
    }
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
