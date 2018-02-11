<template>
  <div v-html="parsedContent"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'

// Config documentation: https://github.com/markdown-it/markdown-it#init-with-presets-and-options
var md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: false,
  langPrefix: 'language-',
  linkify: true,
  typographer: false,
  quotes: '“”‘’',
  highlight: function (/* str, lang */) { return '' }
})

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
    },

    parsedContent () {
      this.$nextTick(() => {
        for (let linkIndex in document.links) {
          if (String(linkIndex) !== 'length') {
            document.links[linkIndex].target = '_blank'
            document.links[linkIndex].rel = 'noopener noreferrer'
          }
        }
      })
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
