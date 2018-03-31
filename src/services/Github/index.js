import axios from 'axios'

export default {
  apiUrl: 'https://api.github.com',

  /**
   * Get Github Gist
   *
   * @param {String} gistUrl
   *
   * @return {Promise}
   */
  getGist (gistId) {
    return axios.get(this.apiUrl + '/gists/' + gistId)
  }
}
