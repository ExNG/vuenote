<template>
  <div id="editor-root" class="shadow-1 q-pa-md">
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

  props: ['content', 'index'],

  data () {
    return {
      activeKeys: {},
      tableCreator: false
    }
  },

  methods: {
    /**
     * Return editor div of this component.
     *
     * @return {Element}
     */
    getInput () {
      return this.$el.querySelector('#editor')
    },

    /**
     * Set text in editor.
     *
     * @param {Bool} mounted = false
     */
    setText (mounted = false) {
      this.$nextTick(() => {
        // Reset content of the editor
        this.getInput().innerHTML = null

        let divs = Editor.getElements(this.content)

        // Append the div to the contenteditable div
        if (mounted) {
          let i = 0.0
          for (let div of divs) {
            div.setAttribute('class', 'animated fadeIn')
            div.style.cssText += `-webkit-animation-delay: ${i}s;`

            this.getInput().appendChild(div)

            i += 0.007
          }
        } else {
          for (let div of divs) {
            this.getInput().appendChild(div)
          }
        }
      })
    },

    /**
     * Inform parent about change.
     *
     * @param {Object} event
     */
    update (event) {
      // Send the content of the contenteditable div as plain text without div elements
      this.$emit('update', event.target.innerText + '\n')
    },

    /**
     * Register keydown event and fire action if a match appears.
     *
     * @param {Object} event
     */
    keydownRegistration (event) {
      let code = event.keyCode

      this.activeKeys[String(code)] = true

      setTimeout(() => {
        this.activeKeys[String(code)] = false
      }, 10000)

      if (this.activeKeys['9']) { // Tab
        this.paste('    ')
      } else if (this.activeKeys['17'] && this.activeKeys['84']) { // Ctrl + T
        this.tableCreator = true
      }
    },

    /**
     * Register a keyup event.
     *
     * @param {Object} event
     */
    keyupRegistration (event) {
      let code = event.keyCode

      this.activeKeys[String(code)] = false
    },

    /**
     * Paste a string like its from clipboard.
     *
     * @param {String} html
     */
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

      this.$emit('update', this.getInput().innerText + '\n')
    }
  },

  created () {
    this.setText(true)

    this.$parent.$on('content-updated', this.setText)

    // Listen for paste events
    this.$parent.$on('content-paste', (data) => {
      // Check if this tab is the target
      if (data.index === this.index) {
        // yes, paste string
        this.paste(String(data.data))
      }
    })
  }
}
</script>

<style lang="scss">
/* TODO: Only apply padding at bottom if text reaches point where its
necessary to avoid scrollbar on the right */
#editor-root {
  white-space: pre;
  word-wrap: break-word;
  font-family: monospace;
  outline: none;
  font-size: 15px;
  color: black;
  margin-bottom: 25vh;
  /* text-shadow: -1px 0 rgb(200, 200, 200), 0 1px rgb(200, 200, 200), 1px 0 rgb(200, 200, 200), 0 -1px rgb(200, 200, 200); */

  overflow-x: hidden;

  &:focus, &:active {
    border: none;
    outline: none;
  }

  * {
    cursor: text;
    max-width: 100%;
    white-space: pre-wrap;
  }

  div {
    width: 100%;
    min-height: 24px;
  }

  img {
    max-height: 50vh;
  }
}
</style>
