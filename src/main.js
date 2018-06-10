// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../node_modules/tachyons/css/tachyons.min.css'
import * as d3 from 'd3'
import html2canvas from 'html2canvas'

window.html2canvas = html2canvas
window.d3 = d3

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
