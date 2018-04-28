<template>
  <q-popover>
    <q-list separator link>
      <q-item v-close-overlay
              @click="exportToTxt()"
      >
        Text
      </q-item>
      <q-item v-close-overlay
              @click="exportToHtml()"
      >
        Html
      </q-item>
      <q-item v-close-overlay
              @click="exportToPicture()"
              :disabled="!previewVisible"
      >
        Picture

        <q-tooltip :disable="previewVisible">
          Open the preview
        </q-tooltip>
      </q-item>
      <q-item v-close-overlay>
        Cancel
      </q-item>
    </q-list>
  </q-popover>
</template>

<script>
import FileSaver from 'file-saver'
import Html2Canvas from 'html2canvas'
import Markdown from '../services/Markdown'

export default {
  props: ['content', 'name', 'activeTab', 'previewVisible'],

  data () {
    return {}
  },

  methods: {
    exportToTxt () {
      FileSaver.saveAs(
        new Blob(
          [this.content],
          {
            type: 'text/plain;charset=utf-8'
          }
        ),
        this.name + '.txt'
      )
    },

    exportToHtml () {
      FileSaver.saveAs(
        new Blob(
          [Markdown.generateHtmlPage(this.content, this.name)],
          {
            type: 'text/plain;charset=utf-8'
          }
        ),
        this.name + '.html'
      )
    },

    exportToPicture () {
      Html2Canvas(document.querySelector('#preview-' + this.activeTab))
        .then(canvas => {
          document.body.appendChild(canvas)
          canvas.toBlob(canvas => {
            FileSaver.saveAs(
              canvas,
              this.name + '.jpg'
            )
          }, 'image/jpeg', 1)
        })
    }
  }
}
</script>

<style>
#debug-modal .btn {
  min-width: 80%;
}
</style>
