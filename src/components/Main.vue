<template>
  <section class="mw7 center">
    <h2 class="fw4 f2 ph3 ph0-l">Learning D3</h2>
    <appListItem v-for="(item, index) of d3_list" :key="index" :linkto="item.link" :title="item.name" :imgUrl="item.img"/>
  </section>
</template>

<script>
import appListItem from './ListItem.vue'

export default {
  name: 'HelloWorld',
  data () {
    return {
      d3_list: [
        { name:'Bar Chart', link: '/d3/Bar_Chart', img: require('../../src/assets/thumbnail/Bar_Chart.png') },
        { name:'Grouped Bar Chart', link: '/d3/Grouped_Bar_Chart', img: require('../../src/assets/thumbnail/Grouped_Bar_Chart.png') },
        { name:'Dataset Nest', link: '/d3/Dataset_Nest', img: require('../../src/assets/thumbnail/Dataset_Nest.png') },
        { name:'Brushable Scatterplot', link: '/d3/Brushable_Scatterplot', img: require('../../src/assets/thumbnail/Brushable_Scatterplot.png') },
        { name:'Brush', link: '/d3/Brush', img: require('../../src/assets/thumbnail/Brush.png') },
        { name:'Connected Particles (Canvas)', link: '/d3/Connected_Particles', img: require('../../src/assets/thumbnail/Connected_Particles.png') },
        { name:'Scatter Plot with Zoom', link: '/d3/Scatter_Plot_Zoom', img: require('../../src/assets/thumbnail/Scatter_Plot_Zoom.png') },
        { name:'Dropdown Selector Plot Chart', link: '/d3/Dropdown_Selector', img: require('../../src/assets/thumbnail/Dropdown_Selector.png') },
        { name:'General Update Pattern', link: '/d3/General_Update_Pattern', img: require('../../src/assets/thumbnail/General_Update_Pattern.png') },
        { name:'Scatterplot Matrix Brushing', link: '/d3/Scatterplot_Matrix_Brushing', img: require('../../src/assets/thumbnail/default.png') }
      ]
    }
  },
  components: {appListItem}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
