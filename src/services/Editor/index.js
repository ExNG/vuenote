export default {
  _elementBackgroundStyle: 'background-color: rgba(0, 0, 0, 0.025);',
  _boldRegex: /[ ]?\*\*[^*]+\*\*[ ]?/g,
  _italicRegex: /[ ]?\*[^*]+\*[ ]?/g,

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
      divs.push(this.getElement(line))
    }

    return divs
  },

  /**
   * Transform whole line to new element, for styleNode()
   *
   * @param {String} innerText
   * @param {String} type
   * @return {Element}
   */
  _newNode (innerText, type) {
    let container = document.createElement('div')
    let newNode = document.createElement(String(type))
    newNode.innerText = innerText

    container.appendChild(newNode)

    return container
  },

  /**
   * Detect if a line contains bold or italic
   * parts and proced to turn it into html.
   *
   * @param {Element} node
   * @return {Element}
   */
  styleNode (node) {
    // Check for bold part
    if (this._boldRegex.test(node.innerText)) {
      return this._newNode(node.innerText, 'b')

    // Check for italic part
    } else if (this._italicRegex.test(node.innerText)) {
      return this._newNode(node.innerText, 'i')

    // Nothing found, juts text
    } else {
      return node
    }
  },

  /**
   * Convert one line of markdown into HTML.
   * Can only be used with oneliners, like headings.
   *
   * @param {String} line
   * @return {Element} = div
   */
  getElement (line) {
    // Append newLine, removed from line split in EditInput
    line += '\n'

    // TODO: Optimize regex

    if (/^# /.test(line)) { // #
      return this.heading(line, 'h1')
    } else if (/^## /.test(line)) { // ##
      return this.heading(line, 'h2')
    } else if (/^### /.test(line)) { // ###
      return this.heading(line, 'h3')
    } else if (/^#### /.test(line)) { // ####
      return this.heading(line, 'h4')
    } else if (/^##### /.test(line)) { // #####
      return this.heading(line, 'h5')
    } else if (/^###### /.test(line)) { // ######
      return this.heading(line, 'h6')
    } else if (/!\[[^\]]+\]\([^\\]+\)/.test(line)) { // image
      return this.img(line)
    } else if (/^\* \* \*/.test(line)) { // hr
      return this.hr(line)
    } else if (/^[- ]{2,}/.test(line)) { // list
      return this.list(line)
    }

    // Nothing before matched sp just display the line as text
    let element = document.createElement('div')

    // Append text to div
    element.appendChild(document.createTextNode(line))
    element = this.styleNode(element)
    return element
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
    image.contenteditable = 'false'

    // Append img to base div
    element.appendChild(image)

    // Append text to base div
    element.appendChild(document.createTextNode(line))

    element.style.cssText += this._elementBackgroundStyle

    return element
  },

  /**
   * Convert markdown heading to HTML heading
   *
   * @param {String} line
   * @param {String} type = 'h1'
   * @return {Element}
   */
  heading (line, type = 'h1') {
    let element = document.createElement(type)

    element.appendChild(document.createTextNode(line))
    element.style.cssText += this._elementBackgroundStyle

    return element
  },

  /**
   * Create line with hr and text.
   *
   * @param {String} line
   * @return {Element}
   */
  hr (line) {
    // Base div
    let element = document.createElement('div')

    // create hr
    let hr = document.createElement('div')
    hr.appendChild(document.createElement('hr'))
    hr.setAttribute('contenteditable', false)
    hr.style.cssText = 'min-height: 1px;'

    // Append hr to base div
    element.appendChild(hr)
    element.style.cssText += this._elementBackgroundStyle

    // Append text to base div
    element.appendChild(document.createTextNode(line))

    return element
  },

  /**
   * Create line with list.
   *
   * @param {String} line
   * @return {Element}
   */
  list (line) {
    // Base div
    let element = document.createElement('div')

    // create li element without ul
    // TODO: implement ul with nested ul elements
    let li = document.createElement('li')
    li.innerText = line

    // TODO: implement this right
    li = document.createElement('div')
    li.innerText = line

    // Append li to base div
    element.appendChild(li)

    return element
  }
}
