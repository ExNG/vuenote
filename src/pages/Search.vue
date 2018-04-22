<template>
  <div style="text-align: center;">
    <input type="text"
           placeholder="Search"
           v-model="search"
           id="searchbox"
           class="form-control"
    >

    <ul>
      <li v-for="(result, index) in results"
          :key="index"
      >
        {{ result.name }}
      </li>
    </ul>

    <br>
    <hr>
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

  computed: {
    results () {
      let low = (string) => {
        return string.toLowerCase()
      }

      if (!this.search) {
        return []
      } else {
        return this.tabs.filter((tab) => {
          return low(tab.name).indexOf(low(this.search)) > -1 || low(tab.content).indexOf(low(this.search)) > -1
        })
      }
    }
  }
}
</script>

<style>
#searchbox {
  width: 50vw;
}
</style>
