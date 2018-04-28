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
        image.style.cssText = 'display: block;'
        let imageSrc = line.match(/http[^)]+/)[0]
        image.src = imageSrc
        element.appendChild(image)
      }

      // Append text to div
      element.appendChild(document.createTextNode(line))
      divs.push(element)
    }

    return divs
  }
}
