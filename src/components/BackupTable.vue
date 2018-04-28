<template>
  <div>
    <label>Backups</label>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>
            <button class="btn btn-default pull-right"
                    @click="showBackups = !showBackups"
            >
              <span class="icon icon-down-open" v-show="!showBackups"></span>
              <span class="icon icon-up-open" v-show="showBackups"></span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(backup, index) in backups"
            :key="index"
            v-if="backup.name !== 'dev' && showBackups"
        >
          <td>{{ backup.name }}</td>
          <td>
            <button class="btn btn-negative"
                    @click="restoreBackup(backup.name)"
            >
              Restore
            </button>
            <button class="btn btn-default"
                    @click="deleteBackup(backup.name)"
            >
              <span class="icon icon-trash"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Backup from '../services/Backup'

export default {
  data () {
    return {
      backups: [],
      showBackups: false
    }
  },

  methods: {
    getBackups () {
      this.backups = Backup.list()
    },

    getContent (name) {
      return Backup.getContent(name)
    },

    restoreBackup (name) {
      Backup.restore(name)
    },

    deleteBackup (name) {
      Backup.delete(name)
      this.getBackups()
    }
  },

  created () {
    this.getBackups()
  }
}
</script>

<style>
</style>
