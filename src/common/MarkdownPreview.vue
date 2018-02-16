<template>
  <div v-html="parsedContent"></div>
</template>

<script>
import Markdown from '../services/Markdown'

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
      this.parsedContent = Markdown.generateHtml(data)
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

  input[id^="markdownpreview-checkbox-"] {
    margin-left: 0px !important;
    pointer-events: none;
  }
</style>
