<template>
  <div contenteditable="true" @input="update" style="white-space: pre-wrap; font-family: monospace;"></div>

</template>

<script>
export default {
  data () {
    return {}
  },

  props: ['content'],

  mounted () {
    this.setText()
  },

  methods: {
    setText () {
      this.$nextTick(() => {
        this.$el.innerText = this.content
      })
    },

    update (event) {
      this.$emit('update', event.target.innerText)
    }
  },

  created () {
    this.$parent.$on('content-updated', this.setText)
  }
}
</script>

<style>
</style>
