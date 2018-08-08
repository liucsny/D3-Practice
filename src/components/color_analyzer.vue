<template>
  <div>
    <div id='chart'></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

import colorsys from 'colorsys'

export default {
  data() {
    return {
      chart:{
        canvas: null,
        width: 1024,
        height: 700,
        innerWidth: null,
        innerHeight: null,
        margin: {top: 20, right: 20, bottom: 30, left: 20},
        scales: {},
        rects:{
          body: null,
          width: 200
        },
        plot: {
          body: null,
          dots: null,
          width: 600,
          height: 600,
        },
        ruler: {}
      },
      color_dots: [
        {
          pos:{
            h: null,
            x: null,
            y: null
          },
          color:'#4F65A0'
        },
        {
          pos:{
            h: null,
            x: null,
            y: null
          },
          color:'#445483'
        },
        {
          pos:{
            h: null,
            x: null,
            y: null
          },
          color:'#3B4976'
        },
        {
          pos:{
            h: null,
            x: null,
            y: null
          },
          color:'#324067'
        },
        {
          pos:{
            h: null,
            x: null,
            y: null
          },
          color:'#2F3C5E'
        },
        {
          pos:{
            h: null,
            x: null,
            y: null
          },
          color:'#293453'
        },
        {
          pos:{
            h: null,
            x: null,
            y: null
          },
          color:'#212C4A'
        },
        {
          pos:{
            h: null,
            x: null,
            y: null
          },
          color:'#1A1D2E'
        }]
    }
  },
  methods: {
    limite(val, max, min){
      if( val > max){
        return max
      }else if( val < min){
        return min
      }else{
        return val
      }
    },
    setup_chart(){
      let that = this;
      let chart = this.chart;
      let canvas = this.chart.canvas;

      chart.innerWidth = chart.width - chart.margin.left - chart.margin.right;
      chart.innerHeight = chart.height - chart.margin.top - chart.margin.bottom;

      chart.scales.saturationScale = d3.scaleLinear().domain([0, 100]).range([0, chart.plot.width]);
      chart.scales.brightnessScale = d3.scaleLinear().domain([0, 100]).range([chart.plot.height, 0]);

      canvas = d3.select('#chart')
                  .append('svg')
                  .attr('width', chart.width)
                  .attr('height', chart.height)
                  .append('g')
                  .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");
      
      // Draw Plot Frame ========
      chart.plot.body = canvas.append('g')
                              .attr('class', 'plot')
                              .attr("transform", "translate(" + chart.rects.width + ", 0)");

      chart.plot.body.append('g')
                      .call(d3.axisLeft(chart.scales.brightnessScale)
                      .tickSize(-chart.plot.width))
                      .attr('class', 'axis')
                      .append('text')
                      .attr('transform', 'translate(0,'+ 6 +')rotate(-90)')
                      .attr('y', 4)
                      .attr('dy', '1.2em')
                      .attr('text-anchor', 'end')
                      .style('font-size', '12px')
                      .text('Brightness')
                      .attr('fill', 'black')


      chart.plot.body.append("g")
                      .call(d3.axisBottom(chart.scales.saturationScale)
                              .tickSize( -chart.plot.height))
                      .attr('transform', 'translate(0,'+ chart.plot.height +')')
                      .attr('class', 'axis')
                      .append('text')
                      .attr('transform', 'translate(' + (chart.plot.width - 6) + ',0)')
                      .attr('y', 4)
                      .attr('dy', '-1.2em')
                      .attr('text-anchor', 'end')
                      .style('font-size', '12px')
                      .text('Saturation')
                      .attr('fill', 'black')

        chart.plot.body.selectAll('.axis line,path ').style('stroke', '#ddd')
        // =============

        // Convert Hex Color to Position

        let color_dots = this.color_dots

        this.color_dots.forEach(function(d){
          d.pos.x = chart.scales.saturationScale(colorsys.hex_to_hsv(d.color).s);
          d.pos.y = chart.scales.brightnessScale(colorsys.hex_to_hsv(d.color).v);
          d.pos.h = colorsys.hex_to_hsv(d.color).h;
        })

        

        // ==============
        
        // Draw Dots ====
        let deltaX, deltaY;
        chart.dots = chart.plot.body.selectAll('.dot')
                                    .data(color_dots)
                                    .enter()
                                    .append('circle')
                                    .attr('class', 'dot')
                                    .attr('cx', function(d) { return d.pos.x })
                                    .attr('cy', function(d) { return d.pos.y })
                                    .attr('r', 10)
                                    .style('cursor', 'move')
                                    .attr('fill', function(d){
                                      return d.color
                                    })
                                    .call(d3.drag().on('start', function(){
                                      let current = d3.select(this);
                                      deltaX = current.attr("cx") - d3.event.x;
                                      deltaY = current.attr("cy") - d3.event.y;
                                    })
                                      .on('drag', function(d,i){
                                      let current = d3.select(this);

                                      let s = that.limite(chart.scales.saturationScale.invert(d.pos.x), 100, 0);
                                      let v = that.limite(chart.scales.brightnessScale.invert(d.pos.y), 100, 0);
                                    
                                      d.pos.x = that.limite(d3.event.x + deltaX, chart.scales.saturationScale(100),chart.scales.saturationScale(0));
                                      d.pos.y = that.limite(d3.event.y + deltaY, chart.scales.brightnessScale(0),chart.scales.brightnessScale(100));
                                      d.color = colorsys.hsv_to_hex(d.pos.h, s, v);

                                      current.attr('cx', d.pos.x)
                                              .attr('cy', d.pos.y)
                                              .attr('fill', d.color)

                                      // console.log(color)
                                      // console.log(s,'  ',v)
                                      // console.log(x,'  ',y)
                                      // console.log(colorsys)
                                    }))





    }
  },
  mounted(){
    this.setup_chart()
  }
}
</script>

<style>

</style>
