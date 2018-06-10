import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import D3 from '@/components/D3'

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
    }
  ]
})
