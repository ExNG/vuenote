<template>
  <div>
    <label>Github Gist</label>

    <div class="pull-right">
      <button class="btn btn-default"
              @click="addGist()"
      >
        <span class="icon icon-plus"></span>
      </button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>
            <button class="btn btn-default pull-right"
                    @click="showGists = !showGists"
            >
              <span class="icon icon-down-open" v-show="!showGists"></span>
              <span class="icon icon-up-open" v-show="showGists"></span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(gist, index) in gists"
            :key="index"
            v-if="showGists"
        >
          <td>{{ gist }}</td>
          <td style="text-align: right;">
            <button class="btn btn-negative"
                    @click="removeGist(gist)"
            >
              <span class="icon icon-cancel" style="color: white;"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Github from '../services/Github'
import Notification from '../services/Notification'
import Storage from '../services/Storage'

export default {
  data () {
    return {
      gists: [],
      showGists: false
    }
  },

  methods: {
    getGists () {
      this.gists = Storage.load('cloud').githubGists
    },

    removeGist (id) {
      this.gists = this.gists.filter((gist) => gist !== id)

      this.saveGists()
    },

    saveGists () {
      let cloud = Storage.load('cloud')
      cloud.githubGists = this.gists
      Storage.save('cloud', cloud)
    },

    addGist () {
      this.$q.dialog({
        title: 'Enter Gist Id',
        message: 'By adding a Github Gist, tabs inside this Gist will appear on the left.',
        color: 'primary',
        ok: true,
        cancel: true,
        preventClose: false,

        prompt: {
          model: '',
          type: 'text'
        }
      })
        .then(data => {
          if (data && data !== '') {
            this.getGist(data)
          }
        }).catch(() => {
        })
    },

    getGist (gistId) {
      Github.getGist(gistId)
        .then((response) => {
          let data = response.data

          if (!data || typeof data !== 'object') {
            Notification({title: 'Error', description: 'Something did not work.', type: 'warning'})
          } else {
            if (!this.gists.includes(String(gistId))) {
              this.gists.push(String(gistId))
            }

            this.saveGists()
          }
        }).catch((err) => {
          if (err.response.status === 404) {
            Notification({title: 'Error', description: err.response.data.message + '.', type: 'warning'})
          } else {
            Notification({title: 'Error', description: 'Something did not work.', type: 'warning'})
          }
        })
    }
  },

  created () {
    this.getGists()
  }
}
</script>

<style>
</style>
