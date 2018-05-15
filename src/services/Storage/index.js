import { remote } from 'electron'

import Config from '../Config'
import Notification from '../Notification'
import Essential from '../Essential'

export default {
  /**
   * Register of all available DB items and their default values
   */
  structure: {
    appData: {
      version: null
    },
    settings: {
      replace: false,
      replaceList: {
        '(=>)': '→',
        '(<=)': '←'
      },
      panes: {
        left: true,
        right: false
      },
      search: {
        tabs: true,
        archived: true
      },
      darkmode: false
    },
    cloud: {
      githubGists: []
    },
    tabs: [],
    archived: [],
    debug: {}
  },

  _welcomeTab: Essential.add({
    name: 'Welcome',
    content: [
      '# Welcome',
      '',
      '* * *',
      '',
      'Vuenote supports full Markdown syntax',
      '',
      '## Typography',
      '',
      '| Name              | Usage      |',
      '| ----------------- | ---------- |',
      '| _Italic_          | `*Text*`   |',
      '| **Strong**        | `**Text**` |',
      '| ~~Strikethrough~~ | `~~Text~~` |',
      '| > Blockquote      | `> Text`   |',
      '',
      '## Lists',
      '',
      '-   List Item',
      '    -   Child Item',
      '',
      '## Links',
      '',
      '[Vuenote Website](https://exng.github.io/vuenote)',
      '',
      '## Images',
      '',
      '![Vuenote Logo](https://github.com/ExNG/vuenote/blob/master/docs/vuenote.png?raw=true)',
      '',
      '## Tables',
      '',
      '| Normal | Centered | Right aligned |',
      '| ------ | :------: | ------------: |',
      '| Text   |   Text   |          Text |',
      '',
      'This is just a short introdution to Markdown, take a look at [this Github article](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for more in depth information',
      ''
    ].join('\n')
  }),
  _archivedTabExample: Essential.add({
    name: 'The cake is a lie!',
    content: [
      '# The cake is a lie!'
    ].join('\n')
  }),

  /**
   * Initiate the DB
   *
   * @return {Bool}
   */
  init () {
    try {
      // set all items with their default value
      for (let name in this.structure) {
        let value = this.structure[name]

        if (name === 'tabs') {
          value.push(this._welcomeTab)
        } else if (name === 'archived') {
          value.push(this._archivedTabExample)
        }

        this.save(name, value)
      }

      // success
      return true
    } catch (e) {
      // error
      return false
    }
  },

  /**
   * Get item from DB or from structure if not set yet
   *
   * @param {String} name
   *
   * @return {String}
   */
  load (name) {
    let value = Config.get(name)

    // check if item is already set
    if (!value) {
      // no return default value if set
      let newValue = this.structure[name]

      // save item with default value
      this.save(name, newValue)

      return newValue
    } else {
      // item is set, return its value
      return JSON.parse(Config.get(name))
    }
  },

  /**
   * Save value of item
   *
   * @param {String} name
   * @param {String} value
   *
   * @return {Bool}
   */
  save (name, value) {
    try {
      // save and return true
      Config.set(name, JSON.stringify(value))
      return true
    } catch (e) {
      // something went wrong while saving
      Notification({
        title: 'Error while saving notes!',
        description: 'The problem is most likely that you ran out of space.',
        type: 'negative'
      })
      return false
    }
  },

  /**
   * Remove item from DB
   *
   * @param {String} value
   *
   * @return {Bool}
   */
  unset (name) {
    // check if item exists
    if (this.load(name)) {
      // yes, remove it
      Config.unset(name)
      return true
    } else {
      // item does not exist in DB
      return false
    }
  },

  /**
   * Export structure as JSON
   *
   * @return {String}
   */
  getExportJSON () {
    let data = {}

    try {
      // add all items to data
      for (let name in this.structure) {
        data[name] = this.load(name)
      }

      // turn into JSOn and return it
      return JSON.stringify(data)
    } catch (e) {
      // error
      return null
    }
  },

  /**
   * Import structure from JSON
   *
   * @param {String} jsonData
   *
   * @return {Bool}
   */
  importJSON (jsonData) {
    let data = {}

    try {
      data = JSON.parse(jsonData)

      for (let name in data) {
        let value = data[name]

        this.save(name, value)
      }

      remote.getCurrentWindow().reload()
      return true
    } catch (e) {
      console.log('Error importing JSON')
      return false
    }
  }
}
