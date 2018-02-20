import MarkdownIt from 'markdown-it'
import markdownItCheckbox from 'markdown-it-checkbox'
import remark from 'remark'

// Basic markdown configuration
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
  /**
   * Return html string made from markdown string
   *
   * @param {String} data
   *
   * @return {String}
   */
  generateHtml (data) {
    return md.render(String(data))
  },

  /**
   * Return html page string made from markdown string
   *
   * @param {String} data
   * @param {String} name
   *
   * @return {String}
   */
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
  },

  /**
   * Format input markdown string
   *
   * @param {String} data
   *
   * @return {String}
   */
  applyStyle (data) {
    remark()
      .process(data, function (err, file) {
        console.error(err || file)
        data = file.contents
      })
    return data
  }
}
