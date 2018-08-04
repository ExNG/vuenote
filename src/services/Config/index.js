
export default {
  /**
   * Save data to data folder.
   *
   * @param {String} name
   * @param {String} value
   */
  set (name, value) {
    localStorage.setItem(name, value)
  },

  /**
   * Remove item from data.
   *
   * @param {String} name
   */
  unset (name) {
    localStorage.removeItem(name)
  },

  /**
   * Return data saved in data folder.
   *
   * @param {String} name
   * @return {String|Null}
   */
  get (name) {
    return localStorage.getItem(name)
  }
}
