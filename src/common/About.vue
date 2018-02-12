<template>
  <div>
    <div style="width: 100%; text-align: center;">
      <div class="btn-group">
        <button class="btn btn-default"
                @click="activeTab = 'about'"
                :class="{ 'active': activeTab === 'about' }"
        >
          About
        </button>
        <button class="btn btn-default"
                @click="activeTab = 'dependencies'"
                :class="{ 'active': activeTab === 'dependencies' }"
        >
          Dependencies
        </button>
      </div>
    </div>

    <hr>

    <div style="width: 100%; text-align: center; max-width: 500px;">
      <div v-show="activeTab === 'about'">
        <h4>Vuenite <small>(Alpha)</small></h4>
        <p>Vuenite is a lightweight note app, it aims at simplifying the way of taking notes.</p>

        <br>

        <table>
          <tr>
            <td><span class="icon icon-github"></span></td>
            <td>Source:</td>
            <td><a>github.com/ExNG/vuenite</a></td>
          </tr>
          <tr>
            <td><span class="icon icon-attention"></span></td>
            <td>License:</td>
            <td>MIT</td>
          </tr>
          <tr>
            <td><span class="icon icon-book"></span></td>
            <td>Author:</td>
            <td>Johann Behr <a>johannbehr@exng.de</a></td>
          </tr>
        </table>
      </div>
      <div v-show="activeTab === 'dependencies'">
        <p>Vuenite only works because of these libraries</p>

        <br>

        <div style="max-height: 50vh; overflow-y: scroll">
          <table>
            <tr><td>Quasar Framework</td></tr>
            <tr><td>VueJS</td></tr>
            <tr><td>Electron</td></tr>
            <tr><td>Photonkit</td></tr>
            <tr><td>MarkdownIt</td></tr>
          </table>
        </div>
      </div>
    </div>

    <hr>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeTab: 'about'
    }
  }
}
</script>

<style>
</style>
