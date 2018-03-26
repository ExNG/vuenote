<template>
  <!-- <div contenteditable="true"
       class="editor mousetrap"
       @input="update"
       @keydown.tab.prevent
       @keydown="keydownRegistration($event)"
       @keyup="keyupRegistration($event)"
       style="white-space: pre-wrap; font-family: monospace;"
  ></div> -->
  <a class="editor mousetrap"
       @focus="focused = true"
       @blur="focused = false"
       :class="{ 'bg-red': focused }"
  >
    <div v-for="(editorContent, index) in contentSplited"
         :key="index"
         v-html="editorContent"
    >
    </div>
  </a>
</template>

<script>
export default {
  data () {
    return {
      activeKeys: {},
      focused: false,
      contentSplited: []
    }
  },

  model: {
    prop: 'inputContent',
    event: 'bar'
  },

  props: ['content'],

  mounted () {
    this.setText()
  },

  methods: {
    setText () {
      this.contentSplited = []
      this.$nextTick(() => {
        this.contentSplited = this.content.split('\n')
      })
    },

    update (event) {
      this.$emit('update', event.target.innerText + '\n')
    }
  },

  created () {
    this.$parent.$on('content-updated', this.setText)
  }
}
</script>

<style>
.editor {
  white-space: pre;
  word-wrap: break-word;
  font-family: monospace;
  outline: none;
  font-size: 15px;
  color: black;
  padding-bottom: 50vh;
  /* text-shadow: -1px 0 rgb(200, 200, 200), 0 1px rgb(200, 200, 200), 1px 0 rgb(200, 200, 200), 0 -1px rgb(200, 200, 200); */
}
</style>
