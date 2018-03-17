<template>
  <label>Backups
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th><!-- Button --></th>
        </tr>
      </thead>
      <tbody v-for="(backup, index) in backups"
             :key="index"
      >
        <tr>
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
          <!-- <td>
            <button class="btn btn-default"
                    v-show="showBackup !== backup.name"
                    @click="showBackup = backup.name"
            >
              <span class="icon icon-down-open"></span>
            </button>

            <button class="btn btn-default"
                    v-show="showBackup === backup.name"
                    @click="showBackup = null"
            >
              <span class="icon icon-up-open"></span>
            </button>
          </td> -->
        </tr>
      </tbody>
    </table>
  </label>
</template>

<script>
import Backup from '../services/Backup'

export default {
  // name: 'ComponentName',
  data () {
    return {
      backups: [],
      showBackup: null
    }
  },

  methods: {
    getContent (name) {
      return Backup.getContent(name)
    },

    restoreBackup (name) {
      Backup.restore(name)
    },

    deleteBackup (name) {
      Backup.delete(name)
    }
  },

  created () {
    this.backups = Backup.list()
  }
}
</script>

<style>
</style>
