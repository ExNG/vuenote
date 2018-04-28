<template>
  <q-context-menu>
    <q-list link separator>
      <q-item v-close-overlay @click.native="renameTab()">
        <q-item-main label="Rename" />
      </q-item>

      <q-item v-close-overlay @click.native="archiveTab()">
        <q-item-main label="Archive"
                     sublabel="Ctrl + W"
        />
      </q-item>

      <q-item v-close-overlay @click.native="removeTab()">
        <q-item-main label="Close" />
      </q-item>
    </q-list>
  </q-context-menu>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  methods: {
    renameTab () {
      this.$emit('rename')
    },

    archiveTab () {
      this.$emit('archive')
    },

    removeTab () {
      this.$emit('close')
    }
  }
}
</script>

<style>
</style>
