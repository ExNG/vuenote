<template>
  <div>
    <div class="text-center">
      <div class="btn-group">
        <button class="btn btn-default"
                @click="switchSlide(-1)"
        >
          <span class="icon icon-left"></span>
        </button>

        <button class="btn btn-default" disabled>
          {{ activeSlide + 1 }} / {{ parsedSlides.length }}
        </button>

        <button class="btn btn-default"
                @click="switchSlide(1)"
        >
          <span class="icon icon-right"></span>
        </button>
      </div>
    </div>

    <div v-for="(slide, index) in parsedSlides"
         :key="index"
         v-html="slide"
         v-show="parsedSlides[activeSlide] && activeSlide === index"
         class="animated fadeInUp"
    >
    </div>
  </div>
</template>

<script>
export default {
  props: ['html'],

  data () {
    return {
      parsedSlides: [],
      activeSlide: 0
    }
  },

  watch: {
    html (data) {
      this.splitToSlides(data)
    }
  },

  methods: {
    splitToSlides (html = null) {
      html = html ? String(html) : String(this.html)
      let hrRegex = /<hr[ ]*[/]*>/g
      this.parsedSlides = html.split(hrRegex)
    },

    switchSlide (operator) {
      let result = this.activeSlide + operator

      if (result < 0) {
        return
      } else if (result >= this.parsedSlides.length) {
        return
      }

      this.activeSlide = result
    }
  },

  created () {
    this.splitToSlides()
  }
}
</script>

<style>
</style>
