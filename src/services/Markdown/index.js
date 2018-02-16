import MarkdownIt from 'markdown-it'
import markdownItCheckbox from 'markdown-it-checkbox'

// Config documentation: https://github.com/markdown-it/markdown-it#init-with-presets-and-options
var md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: false,
  langPrefix: 'language-',
  linkify: true,
  typographer: false,
  quotes: '“”‘’',
  highlight: function (/* str, lang */) { return '' }
})
  .use(markdownItCheckbox, {
    divWrap: true,
    divClass: 'checkbox',
    idPrefix: 'markdownpreview-checkbox-'
  })

export default {
  generateHtml (data) {
    return md.render(String(data))
  },

  generateHtmlPage (data, name) {
    let nl = '\n'
    return '<html>' + nl +
      '<head>' + nl +
      '<title>' + String(name) + '</title>' + nl +
      '</head>' + nl +
      '<body>' + nl +
      this.generateHtml(data) + nl +
      '</body>' + nl +
      '</html>'
  }
}
