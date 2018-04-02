export default {
  tab: {
    name: '',
    content: '',
    slide: false
  },

  /**
   * Clone object.
   *
   * @param {Object} toClone
   * @return {Object}
   */
  clone (toClone) {
    return JSON.parse(JSON.stringify(toClone))
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

    return Object.assign(this.clone(this.tab), newTab)
  }
}
