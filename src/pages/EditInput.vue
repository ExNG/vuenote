<template>
  <div>
    <div contenteditable="true"
         class="editor mousetrap"
         id="editor"
         @input="update"
         @keydown.tab.prevent
         @keydown="keydownRegistration($event)"
         @keyup="keyupRegistration($event)"
         style="white-space: pre-wrap; font-family: monospace;"
    ></div>

    <q-modal v-model="tableCreator">
      <div class="padded-more">
        <table-creator v-on:tablecreate="paste($event)"
                       v-on:closemodal="tableCreator = false"
        >
        </table-creator>
      </div>
    </q-modal>
  </div>
</template>

<script>
import TableCreator from '../components/TableCreator'

export default {
  components: {
    TableCreator
  },

  data () {
    return {
      activeKeys: {},
      tableCreator: false
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
        this.$el.querySelector('#editor').innerHTML = null

        // Split text into lines
        let content = this.content.split('\n')

        // For every line create a div
        let divs = []
        for (let line of content) {
          // If the line is empty its necessary to put a line feed
          if (line === '') {
            line = '\n'
          }

          let type = 'div'

          // TODO: Optimize regex

          if (/^# /.test(line)) { // #
            type = 'h1'
          } else if (/^## /.test(line)) { // ##
            type = 'h2'
          } else if (/^### /.test(line)) { // ###
            type = 'h3'
          } else if (/^#### /.test(line)) { // ####
            type = 'h4'
          } else if (/^!\[[a-zA-Z1-9 ]+\]\([a-zA-Z0-9:/.\-~?=#_%]+\)/.test(line)) { // image
            type = 'img'
          }

          let element = null
          if (type !== 'img') {
            element = document.createElement(type)
          } else {
            element = document.createElement('div')
          }

          // Display image if url detected
          if (type === 'img') {
            let image = document.createElement('img')
            let imageSrc = line.match(/http[a-zA-Z0-9:/.\-~?=#_%]+/)[0]
            image.src = imageSrc
            element.appendChild(image)
          }

          // Append text to div
          element.appendChild(document.createTextNode(line))
          divs.push(element)
        }

        // Append the div to the contenteditable div
        for (let div of divs) {
          this.$el.querySelector('#editor').appendChild(div)
        }
      })
    },

    update (event) {
      // Send the content of the contenteditable div as plain text without div elements
      this.$emit('update', event.target.innerText + '\n')
      // NOTE: To debug comment the line above and comment out the line below
      // console.log(event.target.innerText)
    },

    keydownRegistration (event) {
      let code = event.keyCode

      this.activeKeys[String(code)] = true

      if (this.activeKeys['9']) { // Tab
        this.paste('    ')
      } else if (this.activeKeys['17'] && this.activeKeys['84']) { // Ctrl + T
        this.tableCreator = true
      }
    },

    keyupRegistration (event) {
      let code = event.keyCode

      this.activeKeys[String(code)] = false
    },

    paste (html) {
      // console.log('window.getSelection', window.getSelection)

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

      this.$emit('update', this.$el.querySelector('#editor').innerText + '\n')
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
  min-height: 24px;
}

.editor * {
  max-width: 100%;
}
</style>
