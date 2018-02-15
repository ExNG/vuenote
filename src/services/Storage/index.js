export default {
  load (name) {
    return JSON.parse(localStorage.getItem(name))
  },

  save (name, value) {
    localStorage.setItem(name, JSON.stringify(value))
    return true
  }
}
