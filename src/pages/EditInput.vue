<template>
  <div contenteditable="true"
       class="editor"
       @input="update"
       @keydown.tab.prevent
       @keydown="keydownRegistration($event)"
       @keyup="keyupRegistration($event)"
       style="white-space: pre-wrap; font-family: monospace;"
  ></div>
</template>

<script>
export default {
  data () {
    return {
      activeKeys: {}
    }
  },

  props: ['content'],

  mounted () {
    this.setText()
  },

  methods: {
    setText () {
      this.$nextTick(() => {
        this.$el.innerText = this.content + '\n'
      })
    },

    update (event) {
      this.$emit('update', event.target.innerText + '\n')
    },

    keydownRegistration (event) {
      let code = event.keyCode

      this.activeKeys[String(code)] = true

      if (this.activeKeys['9']) { // Tab
        this.paste('    ')
      }
    },

    keyupRegistration (event) {
      let code = event.keyCode

      this.activeKeys[String(code)] = false
    },

    paste (html) {
      console.log('window.getSelection', window.getSelection)

      if (window.getSelection) {
        let sel = window.getSelection()

        if (sel.getRangeAt && sel.rangeCount) {
          let range = sel.getRangeAt(0)
          range.deleteContents()

          let el = document.createElement('div')
          el.innerHTML = html

          let frag = document.createDocumentFragment()
          let lastNode = frag.appendChild(el.firstChild)

          range.insertNode(frag)

          if (lastNode) {
            range = range.cloneRange()
            range.setStartAfter(lastNode)
            range.collapse(true)

            sel.removeAllRanges()
            sel.addRange(range)
          }
        }
      } else if (document.selection && document.selection.type !== 'Control') {
        document.selection.createRange().pasteHTML(html)
      }
    }
  },

  created () {
    this.$parent.$on('content-updated', this.setText)
  }
}
</script>

<style>
.editor {
  outline: none;
  font-size: 15px;
  color: black;
  /* text-shadow: -1px 0 rgb(200, 200, 200), 0 1px rgb(200, 200, 200), 1px 0 rgb(200, 200, 200), 0 -1px rgb(200, 200, 200); */
}
</style>
