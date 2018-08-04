import MarkdownIt from 'markdown-it'
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
    return [
      '<html>',
      '<head>',
      '<title>' + String(name) + '</title>',
      '<link rel="stylesheet" type="text/css" href="https://unpkg.com/quasar-framework@latest/dist/umd/quasar.mat.min.css">',
      '</head>',
      '<body>',
      '<div class="q-pa-md">',
      this.generateHtml(data),
      '</div>',
      '</body>',
      '</html>'
    ].join('\n')
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
      .data('settings', {commonmark: true, emphasis: '*', strong: '*'})
      .process(data, (err, file) => {
        if (err) throw err
        data = file.contents
      })

    return data
  }
}
