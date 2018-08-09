import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import D3 from '@/components/D3'
import Color_Analysis from '@/components/Color_Analysis'
import D3_Vue from '@/components/D3_Vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/d3/:id',
      name: 'D3',
      component: D3
    },
    {
      path: '/coloranalysis',
      name: 'Color_Analysis',
      component: Color_Analysis
    },
    {
      path: '/d3_vue',
      name: 'D3_Vue',
      component: D3_Vue
    }
  ]
})
