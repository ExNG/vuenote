import Storage from '../services/Storage'

var settings = Storage.load('settings')

if (settings.darkmode) {
  require(`antimatterkit/dist/antimatter_dark.css`)
} else {
  require(`antimatterkit/dist/antimatter.css`)
}

export default () => {
}
