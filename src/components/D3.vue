<template>
  <div>
    <div class="mw8 center">
      <div class="w-100 pa2 mt2 tc" ref="chartArea"></div>
      <h2 class="fw4">{{this.$route.params.id +'.js'}}</h2>
      <p ref="notes" class="lh-copy f6 black-60"></p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      render: require('./d3_file/'+ this.$route.params.id +'.js')
    }
  },
  mounted () {
    this.render(this)
  },
  // beforeDestroy () {
  //   this.screenShot()
  // },
  methods: {
    screenShot () {
      html2canvas(this.$el).then(function(canvas) {
        canvas.id='screenShot'
        document.body.appendChild(canvas)
      })
    }
  }
}
</script>
