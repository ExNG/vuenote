export default {
  tab: {
    name: '',
    content: ''
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
  add ({name = '', content = ''}) {
    let newTab = {
      name: name,
      content: content
    }

    return Object.assign(this.clone(this.tab), newTab)
  }
}
