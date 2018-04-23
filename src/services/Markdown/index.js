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
    return ['<html>',
      '<head>',
      '<title>' + String(name) + '</title>',
      '<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ExNG/antimatter/73e5bbc4/dist/antimatter.css">',
      '</head>',
      '<body>',
      '<div class="window">',
      '<div class="window-content">',
      '<div class="padded-more">',
      this.generateHtml(data),
      '</div>',
      '</div>',
      '</div>',
      '</body>',
      '</html>'].join('\n')
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
        if (err) throw err
        data = file.contents
      })

    return data
  }
}
