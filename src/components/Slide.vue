<template>
  <div>
    <div class="text-center">
      <q-btn-group>
        <q-btn
          :disabled="activeSlide === 0"
          icon="chevron_left"
          @click="switchSlide(-1)"
        />
        <q-btn
          disabled
          :label="`${activeSlide + 1} / ${parsedSlides.length}`"
        />
        <q-btn
          :disabled="activeSlide === parsedSlides.length - 1"
          icon="chevron_right"
          @click="switchSlide(1)"
        />
      </q-btn-group>
    </div>

    <div v-for="(slide, index) in parsedSlides"
         :key="index"
         v-html="slide"
         v-show="parsedSlides[activeSlide] && activeSlide === index"
         class="animated fadeInUp slide-content"
    ></div>
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
    },

    parsedSlides (data) {
      if (data.length < this.activeSlide + 1) {
        this.activeSlide = data.length - 1
      }
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
        this.activeSlide = 0
      } else if (result >= this.parsedSlides.length) {
        this.activeSlide = this.parsedSlides.length - 1
      } else {
        this.activeSlide = result
      }
    }
  },

  created () {
    this.splitToSlides()
  }
}
</script>

<style>
.slide-content * {
  max-width: 100%;
}
</style>
