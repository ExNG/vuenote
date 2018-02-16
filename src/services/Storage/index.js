import { Toast, Dialog } from 'quasar'

export default {
  structure: {
    settings: {},
    tabs: [
      {
        name: 'Welcome',
        content: [
          '# Welcome',
          '',
          '---',
          '',
          'Vuenite supports full Markdown syntax,',
          '',
          '## Typography',
          '',
          'Name | Usage | Alternative usage',
          '--- | --- | ----',
          '*Italic* | `*Text*` | `_Text_`',
          '**Strong** | `**Text**` | `__Text__`',
          '~~Strikethrough~~ | `~~Text~~` |',
          '> Blockquote | `> Text` |',
          '',
          '## Lists',
          '',
          'Name | Usage',
          '--- | ---',
          'Simple List | `- Text` or `* Text` or `+ Text`',
          'Simple List Child | `   - Text`',
          'Numbered List | `1. Text`',
          '',
          '## Links',
          '',
          'Links can be automatically detected, but you should use the ' +
            'markdown way if you want to be sure.',
          '',
          '`[Text](http://www.link-to.url)`',
          '',
          '## Images',
          '',
          '`![Alt Text](http://link.to/image)`',
          '',
          '## Tables',
          '',
          'Normal | Centered | Right aligned',
          '--- | :---: | ---:',
          'Text | Text | Text',
          '',
          '## Checkboxes',
          '',
          'Element | Code',
          '--- | ---',
          '[X] Text | `[X] Text` or `[x] Text`',
          '[ ] Text | `[ ] Text`',
          '',
          '',
          '---',
          '',
          'This is just a short introdution to Markdown, take a look at ' +
            '[this Github article](https://github.com/adam-p/markdown-here/wiki' +
            '/Markdown-Cheatsheet) for more in depth information',
          ''
        ].join('\n')
      }
    ],
    debug: {}
  },

  init () {
    try {
      for (let name in this.structure) {
        let value = this.structure[name]
        this.save(name, value)
      }

      return true
    }
    catch (e) {
      return false
    }
  },

  load (name) {
    return JSON.parse(localStorage.getItem(name))
  },

  save (name, value) {
    try {
      localStorage.setItem(name, JSON.stringify(value))
      return true
    }
    catch (e) {
      Toast.create.negative({
        html: 'Could not save your notes!',
        icon: 'error',
        timeout: (60 * 1000),
        button: {
          label: 'More',
          handler () {
            Dialog.create({
              title: 'Error while saving notes',
              message: 'The problem is most likely that you ran out of space.',
              buttons: [
                'Close'
              ]
            })
          },
          color: 'white'
        }
      })

      return false
    }
  },

  unset (name) {
    if (this.load(name)) {
      localStorage.removeItem(name)
      return true
    }
    else {
      return false
    }
  }
}
