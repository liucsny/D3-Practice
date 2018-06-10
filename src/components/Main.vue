<template>
  <section class="mw7 center avenir">
    <h2 class="fw2 f2 ph3 ph0-l">Learning D3</h2>
    <appListItem v-for="(item, index) of d3_list" :key="index" :linkto="item.link" :title="item.name"/>
  </section>
</template>

<script>
import appListItem from './ListItem.vue'

export default {
  name: 'HelloWorld',
  data () {
    return {
      d3_list: [
        { name:'Bar Chart', link: '/d3/Bar_Chart', img: '' },
        { name:'Grouped Bar Chart', link: '/d3/Grouped_Bar_Chart', img: '' },
        { name:'Dataset_Nest', link: '/d3/Dataset_Nest', img: '' },
        { name:'Brushable_Scatterplot', link: '/d3/Brushable_Scatterplot', img: '' },
        { name:'Brush', link: '/d3/Brush', img: '' }
      ]
    }
  },
  components: {appListItem}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
