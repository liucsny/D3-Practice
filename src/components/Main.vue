<template>
  <section class="mw8 center">
    <div class="flex flex-wrap mt4">
      <div class="w-100 w-25-ns pa3" v-for="(item, index) of d3_list" :key="index">
        <appListItem :linkto="item.link" :title="item.name" :imgUrl="item.img"  :tags="item.tags"/>
      </div>
    </div>
  </section>
</template>

<script>
import appListItem from './ListItem.vue'

export default {
  name: 'HelloWorld',
  data () {
    return {
      d3_list: [
        { 
          name:'Bar Chart',
          link: '/d3/Bar_Chart',
          img: require('../../src/assets/thumbnail/Bar_Chart.png'),
          tags: ['d3.scaleBand().rangeRound()', 'd3.scaleLinear().rangeRound()']
        },
        { 
          name:'Grouped Bar Chart',
          link: '/d3/Grouped_Bar_Chart',
          img: require('../../src/assets/thumbnail/Grouped_Bar_Chart.png'),
          tags: ['scale.paddingInner(0.1)']
        },
        { 
          name:'Dataset Nest',
          link: '/d3/Dataset_Nest',
          img: require('../../src/assets/thumbnail/Dataset_Nest.png'),
          tags: ['d3.nest()', 'nest.key(func)', 'nest.rollup(func)', 'nest.enteries(data)']
        },
        { 
          name:'Scatterplot',
          link: '/d3/Scatterplot',
          img: require('../../src/assets/thumbnail/Brushable_Scatterplot.png')
        },
        { 
          name:'Brush',
          link: '/d3/Brush',
          img: require('../../src/assets/thumbnail/Brush.png')
        },
        { 
          name:'Connected Particles (Canvas)',
          link: '/d3/Connected_Particles',
          img: require('../../src/assets/thumbnail/Connected_Particles.png')
        },
        { 
          name:'Scatter Plot with Zoom',
          link: '/d3/Scatter_Plot_Zoom',
          img: require('../../src/assets/thumbnail/Scatter_Plot_Zoom.png')
        },
        { 
          name:'Dropdown Selector Plot Chart',
          link: '/d3/Dropdown_Selector',
          img: require('../../src/assets/thumbnail/Dropdown_Selector.png'),
          tags: ['selection.merge(other)']
        },
        { 
          name:'General Update Pattern',
          link: '/d3/General_Update_Pattern',
          img: require('../../src/assets/thumbnail/General_Update_Pattern.png')
        },
        { 
          name:'Scatterplot Matrix Brushing',
          link: '/d3/Scatterplot_Matrix_Brushing',
          img: require('../../src/assets/thumbnail/Scatterplot_Matrix_Brushing.png')
        },
        { 
          name:'Nations Bubbles',
          link: '/d3/Nations_Bubbles',
          img: require('../../src/assets/thumbnail/Nations_Bubbles.png'),
          tags: ['d3.bisector(comparator)']
        },
        { 
          name:'World Cup 1',
          link: '/d3/World_Cup_1',
          img: require('../../src/assets/thumbnail/World_Cup_1.png'),
          tags: ['d3.forceSimulation()', 'd3.on("tick",()=>{})']
        },
        { 
          name:'YouTube Ratings',
          link: '/d3/YouTube_Ratings',
          img: require('../../src/assets/thumbnail/YouTube_Ratings.png'),
          // tags: ['d3.bisector(comparator)']
        },
        // {
        //   name:'Add Data to Force Layout',
        //   link: '/d3/Add_Data_to_Force_Layout',
        //   img: require('../../src/assets/thumbnail/default.png'),
        //   // tags: ['d3.bisector(comparator)']
        // },
        { 
          name:'Radial Column Chart',
          link: '/d3/Radial_Column_Chart',
          img: require('../../src/assets/thumbnail/Radial_Column_Chart.png'),
          // tags: ['d3.bisector(comparator)']
        },
        { 
          name:'World Cup All',
          link: '/d3/World_Cup_2_1',
          img: require('../../src/assets/thumbnail/World_Cup_2.png'),
          // tags: ['d3.forceSimulation()', 'd3.on("tick",()=>{})']
        },
        { 
          name:'Dot Plot Histogram',
          link: '/d3/Dot_Plot_Histogram',
          img: require('../../src/assets/thumbnail/Dot_Plot_Histogram.png'),
          // tags: ['d3.forceSimulation()', 'd3.on("tick",()=>{})']
        },
        { 
          name:'Histogram',
          link: '/d3/Histogram',
          img: require('../../src/assets/thumbnail/Histogram.png'),
          tags: ['d3.histogram()']
        },
        { 
          name:'World Cup 2',
          link: '/d3/World_Cup_2',
          img: require('../../src/assets/thumbnail/World_Cup_2.png'),
          // tags: ['d3.forceSimulation()', 'd3.on("tick",()=>{})']
        },
        { 
          name:'Dendrogram',
          link: '/d3/Dendrogram',
          img: require('../../src/assets/thumbnail/Dendrogram.png'),
          tags: ['d3.stratify()', 'd3.cluster()']
        },
        { 
          name:'Color Analysis',
          link: '/coloranalysis',
          img: require('../../src/assets/thumbnail/Color_Analysis.png'),
          // tags: ['d3.stratify()', 'd3.cluster()']
        },
        { 
          name:'D3 + Vue',
          link: '/d3_vue',
          img: require('../../src/assets/thumbnail/default.png'),
          // tags: ['d3.stratify()', 'd3.cluster()']
        },
      ]
    }
  },
  components: {appListItem}
}
</script>

<style scoped>
</style>
