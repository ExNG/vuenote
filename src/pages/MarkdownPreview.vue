<template>
  <div>
    <div v-html="parsedContent"
         v-if="!tab.slide"
    ></div>
    <slide v-else
           :html="parsedContent"
    ></slide>
  </div>
</template>

<script>
import Markdown from '../services/Markdown'
import Slide from '../components/Slide'
import { shell } from 'electron'

export default {
  props: ['tab'],

  components: {
    Slide
  },

  data () {
    return {
      parsedContent: ''
    }
  },

  watch: {
    tab: {
      deep: true,
      handler (data) {
        this.renderMarkdown(data.content)
      }
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
      data = data ? String(data) : String(this.tab.content)
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
