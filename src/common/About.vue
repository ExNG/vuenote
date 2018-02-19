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
      <div class="animated fadeIn" v-show="activeTab === 'about'">
        <h4>{{ packageInfo.productName }} <small>(v. {{ packageInfo.version }})</small></h4>
        <p>{{ packageInfo.description }}</p>

        <br>

        <table>
          <tr>
            <td><span class="icon icon-github"></span></td>
            <td>Source:</td>
            <td>
              <a @click="openURL(packageInfo.homepage)">
                {{ packageInfo.homepage }}
              </a>
            </td>
          </tr>
          <tr>
            <td><span class="icon icon-attention"></span></td>
            <td>License:</td>
            <td>{{ packageInfo.license }}</td>
          </tr>
          <tr>
            <td><span class="icon icon-book"></span></td>
            <td>Author:</td>
            <td>{{ packageInfo.author }}</td>
          </tr>
        </table>
      </div>
      <div class="animated fadeIn" v-show="activeTab === 'dependencies'">
        <p>{{ packageInfo.productName }} only works because of these libraries</p>

        <br>

        <div style="max-height: 50vh; overflow-y: scroll">
          <table>
            <tr v-for="(version, packageName) in packageInfo.dependencies">
              <td>{{ packageName }}</td>
            </tr>
            <tr>
              <td>electron</td>
            </tr>
            <tr>
              <td>webpack</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <hr>
  </div>
</template>

<script>
import { shell } from 'electron'

export default {
  props: ['packageInfo'],

  data () {
    return {
      activeTab: 'about'
    }
  },

  methods: {
    openURL (url) {
      shell.openExternal(url)
    }
  }
}
</script>

<style>
</style>
