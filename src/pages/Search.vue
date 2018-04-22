<template>
  <div style="text-align: center;">
    <input type="text"
           placeholder="Search"
           v-model="search"
           id="searchbox"
           class="form-control"
           tabindex="1000"
    >

    <br>
    <br>

    <table>
      <tbody>
        <!-- TABS -->
        <tr>
          <td class="border-below">
            <small>
              <span class="icon icon-doc-text-inv"></span>
              Open Tabs
            </small>
          </td>
        </tr>
        <tr v-for="(result, index) in tabs"
            :key="index"
            v-show="applySearch(result)"
        >
          <td @click="setActiveTab(index)"
              @keydown.enter="setActiveTab(index)"
              :tabindex="1000 + index"
          >
            {{ result.name }}
          </td>
        </tr>

        <!-- ARCHIVED TABS -->
        <!-- TODO -->
        <tr>
          <td class="border-below">
            <small>
              <span class="icon icon-archive"></span>
              Archive
            </small>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['tabs', 'modal'],

  data () {
    return {
      search: ''
    }
  },

  watch: {
    modal () {
      if (!this.modal) {
        this.search = ''
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
