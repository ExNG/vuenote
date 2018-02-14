import {
  Dialog
} from 'quasar'
import FileSaver from 'file-saver'
import Html2Canvas from 'html2canvas'
import Markdown from '../Markdown'

export default {
  dialog (content, name, activeTab) {
    Dialog.create({
      title: 'Export',
      message: 'Select file format',
      form: {
        option: {
          type: 'radio',
          model: 'txt',
          inline: true,
          items: [
            {label: 'Text', value: 'txt'},
            {label: 'Html', value: 'html'},
            {label: 'Picture', value: 'picture'}
          ]
        }
      },
      buttons: [
        'Cancel',
        {
          label: 'Ok',
          handler (data) {
            switch (data.option) {
              case 'txt':
                FileSaver.saveAs(
                  new Blob(
                    [content],
                    {
                      type: 'text/plain;charset=utf-8'
                    }
                  ),
                  name + '.txt'
                )
                break
              case 'html':
                let html = Markdown.generateHtmlPage(content, name)

                FileSaver.saveAs(
                  new Blob(
                    [html],
                    {
                      type: 'text/plain;charset=utf-8'
                    }
                  ),
                  name + '.html'
                )
                break
              case 'picture':
                // TODO: Fix white image bug
                // UPDATE: Noticed that sometime pictures are take with half of content
                Html2Canvas(document.querySelector('#preview-' + activeTab))
                  .then(canvas => {
                    document.body.appendChild(canvas)
                    canvas.toBlob(canvas => {
                      FileSaver.saveAs(
                        canvas,
                        name + '.jpg'
                      )
                    }, 'image/jpeg', 1)
                  })
                break
            }
          }
        }
      ]
    })
  }
}
