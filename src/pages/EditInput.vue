<template>
  <div contenteditable="true"
       class="editor mousetrap"
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
      // NOTE: Since contenteditable isnt in its final form it might be that
      //       after an electron update the following code might break.
      this.$nextTick(() => {
        // Reset content of the editor
        this.$el.innerHTML = null

        // Split text into lines
        let content = this.content.split('\n')

        // For every line create a div
        let divs = []
        for (let line of content) {
          let element = document.createElement('div')

          // If the line is empty its necessary to put a line feed
          if (line === '') {
            line = '\n'
          }

          // Append text to div
          element.appendChild(document.createTextNode(line))
          divs.push(element)
        }

        // Append the div to the contenteditable div
        for (let div of divs) {
          this.$el.appendChild(div)
        }
      })
    },

    update (event) {
      // Send the content of the contenteditable div as plain text without div elements
      this.$emit('update', event.target.innerText + '\n')
    },

    keydownRegistration (event) {
      let code = event.keyCode

      this.activeKeys[String(code)] = true

      if (this.activeKeys['9']) { // Tab
        this.paste('    ')
      } else if (this.activeKeys['17'] && this.activeKeys['191']) { // Ctrl + #
        this.paste('<h1>Heading</h1>')
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
  white-space: pre;
  word-wrap: break-word;
  font-family: monospace;
  outline: none;
  font-size: 15px;
  color: black;
  padding-bottom: 50vh;
  /* text-shadow: -1px 0 rgb(200, 200, 200), 0 1px rgb(200, 200, 200), 1px 0 rgb(200, 200, 200), 0 -1px rgb(200, 200, 200); */

}

.editor div {
  width: 100%;
  height: 24px;
}
</style>
