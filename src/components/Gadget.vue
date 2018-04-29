<template>
  <div id="gadget">
    <h1 v-if="type === 'rainbow'"
         id="rainbow"
    >
      {{ data.data }}
    </h1>
    <div v-else>
      {{ data.data }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],

  data () {
    return {
      type: null
    }
  },

  created () {
    console.log(this.data)

    let type = this.data.type

    switch (type) {
      case 'rainbow':
        this.type = 'rainbow'
        break
      default:
        this.type = null
    }
  }
}
</script>

<style>
#gadget {
  background-color: rgba(1, 1, 1, 0.02);
}

#rainbow {
  background: linear-gradient(to right, orange , yellow, green, cyan, blue, violet);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
