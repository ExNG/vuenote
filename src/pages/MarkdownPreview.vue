<template>
  <div v-html="parsedContent"></div>
</template>

<script>
import Markdown from '../services/Markdown'
import { shell } from 'electron'

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
        for (let element of document.body.querySelectorAll('a')) {
          if (element.href && element.href !== null && element.href !== '') {
            let href = element.href
            element.removeAttribute('href')
            element.onclick = () => {
              shell.openExternal(href)
            }
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
</style>
