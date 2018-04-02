export default {
  tab: {
    name: '',
    content: ''
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

    return Object.assign(this.tab, newTab)
  }
}
