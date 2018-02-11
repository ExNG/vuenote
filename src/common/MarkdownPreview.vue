<template>
  <div v-html="parsedContent"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'
var md = new MarkdownIt()

export default {
  props: ['content'],

  data () {
    return {
      parsedContent: ''
    }
  },

  watch: {
    content (data) {
      this.parsedContent = md.render(String(this.content))
    }
  }
}
</script>

<style>
</style>
