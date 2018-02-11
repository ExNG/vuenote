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
      this.renderMarkdown(data)
    }
  },

  methods: {
    renderMarkdown (data = null) {
      data = data ? String(data) : String(this.content)
      this.parsedContent = md.render(String(data))
    }
  },

  created () {
    this.renderMarkdown()
  }
}
</script>

<style>
  code {
    background-color: rgba(220,220,220,.5);
    border-radius: 2px;
    box-decoration-break: clone;
  }
</style>
