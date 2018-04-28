export default {

  /**
   * Parse editor content and create
   *   matching elements if possible
   *
   * @param {String} content
   * @return {Array}
   */
  getElements (content) {
    // Split content into array by row
    content = content.split('\n')

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
      } else if (/!\[[^\]]+\]\([^\\]+\)/.test(line)) { // image
        divs.push(this.img(line))
        continue
      }

      let element = document.createElement(type)

      // Append text to div
      element.appendChild(document.createTextNode(line))
      divs.push(element)
    }

    return divs
  },

  /**
   * Turn line with image code to image preview and code
   *
   * @param {String} line
   * @return {Element}
   */
  img (line) {
    // Base div containing image and corresponding text
    let element = document.createElement('div')

    // create image element and set attributes
    let image = document.createElement('img')
    image.style.cssText = 'display: block;'
    image.src = line.match(/http[^)]+/)[0]

    // Append img to base div
    element.appendChild(image)

    // Append text to base div
    element.appendChild(document.createTextNode(line))

    return element
  }
}
