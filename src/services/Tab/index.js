export default {
  tab: {
    name: '',
    content: '',
    slide: false
  },

  /**
   * Create new tab
   *
   * @param {Object} tab
   * @return {Bool}
   */
  add ({name = '', content = '', slide = false}) {
    let newTab = {
      name: name,
      content: content,
      slide: slide
    }

    return Object.assign(this.tab, newTab)
  }
}
