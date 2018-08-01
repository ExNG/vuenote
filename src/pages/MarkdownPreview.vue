<template>
  <div>
    <div v-html="parsedContent"
         v-if="!tab.slide"
         id="preview-container"
    ></div>
    <slide v-else
           :html="parsedContent"
    ></slide>
  </div>
</template>

<script>
import Markdown from '../services/Markdown'
import Slide from '../components/Slide'

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
#preview-container * {
  max-width: 100%;
}
</style>
