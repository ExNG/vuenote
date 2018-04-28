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
import Editor from '../services/Editor'
import TableCreator from '../components/TableCreator'

export default {
  components: {
    TableCreator
  },

  props: ['content'],

  data () {
    return {
      activeKeys: {},
      tableCreator: false
    }
  },

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

        let divs = Editor.getElements(this.content)

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

      setTimeout(() => {
        this.activeKeys[String(code)] = false
      }, 1000)

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
