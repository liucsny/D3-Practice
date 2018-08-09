<template>
  <div>
    <div id='chart'>
       <div class="flex mb4 mt5">
        <div class="color_box ma2" v-for="(i, index) in 8" :key="index">
          <div class="w-100 h4" :style='{"background-color":color_dots[i-1].color}'></div>
          <div class="pv2 ph3">
            <div class="w-100 flex input-box">
              <input class="w-100" type="text" @change="update_plot_by_hex();update_rects();update_ruler()" @focus="$event.target.select()" v-model="color_dots[i-1].color">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import colorsys from 'colorsys';

export default {
  data() {
    return {
      chart:{
        canvas: null,
        width: 1024,
        height: 700,
        innerWidth: null,
        innerHeight: null,
        margin: {top: 20, right: 20, bottom: 30, left: 40},
        scales: {},
        rects:{
          body: null,
          width: 120,
          height: null,
          marginBottom: 6
        },
        plot: {
          body: null,
          dots: null,
          width: 600,
          height: 600,
        },
        ruler: {
          gradient: null,
          body: null,
          dots: null,
          width: 120
        }
      },
      color_dots: [
        {
          pos:{
            h: null,
            s: null,
            x: null,
            y: null
          },
          color:'#4F65A0'
        },
        {
          pos:{
            h: null,
            s: null,
            x: null,
            y: null
          },
          color:'#445483'
        },
        {
          pos:{
            h: null,
            s: null,
            x: null,
            y: null
          },
          color:'#3B4976'
        },
        {
          pos:{
            h: null,
            s: null,
            x: null,
            y: null
          },
          color:'#324067'
        },
        {
          pos:{
            h: null,
            s: null,
            x: null,
            y: null
          },
          color:'#2F3C5E'
        },
        {
          pos:{
            h: null,
            s: null,
            x: null,
            y: null
          },
          color:'#293453'
        },
        {
          pos:{
            h: null,
            s: null,
            x: null,
            y: null
          },
          color:'#212C4A'
        },
        {
          pos:{
            h: null,
            s: null,
            x: null,
            y: null
          },
          color:'#1A1D2E'
        }]
    }
  },
  computed: {
    sorted_color_dots() {
      let that = this;
      return this.color_dots.slice(0).sort(function(a, b){
              return colorsys.hex_to_hsv(that.normalize_hex(b.color)).v - colorsys.hex_to_hsv(that.normalize_hex(a.color)).v;
            })
    }
  },
  methods: {
    normalize_hex(hex) {
      let num;

      if(hex[0]=='#'){
        num = hex.substr(1);
      }else{
        num = hex
      }

      if(num.length == 3){
        num = num.split('').map(function(d){
                    return d + d;
                  }).join('')
      }else if( num.length > 6 ){
        num = num.substring(0,6);
      }else if( num.length < 6 ){
        num = (num + 'ffffff').substring(0,6);
      }

      return '#' + num;
    },
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

      this.chart.canvas = d3.select('#chart')
                  .append('svg')
                  .attr('width', chart.width)
                  .attr('height', chart.height)
                  .append('g')
                  .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");
      
      // Draw Plot Frame ========
      chart.plot.body = this.chart.canvas.append('g')
                              .attr('class', 'plot')
                              .attr("transform", "translate(" + (chart.rects.width + 40) + ", 0)");

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

      let color_dots = this.color_dots;
      let sorted_color_dots = this.sorted_color_dots;

      this.color_dots.forEach(function(d){
        d.pos.x = chart.scales.saturationScale(colorsys.hex_to_hsv(d.color).s);
        d.pos.y = chart.scales.brightnessScale(colorsys.hex_to_hsv(d.color).v);
        d.pos.h = colorsys.hex_to_hsv(d.color).h;
        d.pos.s = colorsys.hex_to_hsv(d.color).s;
      })

      // ==============
      
      // Draw Dots ====
      let deltaX, deltaY;
      chart.plot.dots = chart.plot.body.selectAll('.dot')
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
                                    .on('drag', function(d){
                                    let current = d3.select(this);

                                    let s = that.limite(chart.scales.saturationScale.invert(d.pos.x), 100, 0);
                                    let v = that.limite(chart.scales.brightnessScale.invert(d.pos.y), 100, 0);
                                  
                                    d.pos.x = that.limite(d3.event.x + deltaX, chart.scales.saturationScale(100),chart.scales.saturationScale(0));
                                    d.pos.y = that.limite(d3.event.y + deltaY, chart.scales.brightnessScale(0),chart.scales.brightnessScale(100));
                                    d.color = colorsys.hsv_to_hex(d.pos.h, s, v);
                                    
                                    current.attr('cx', d.pos.x)
                                            .attr('cy', d.pos.y)
                                            .attr('fill', d.color);

                                    that.update_rects();
                                    that.update_ruler();
                                  }))
      // ===============

      // Draw Rects ====
      this.chart.rects.height = this.chart.plot.height/this.color_dots.length;
      let rects_height = this.chart.rects.height;

      chart.rects.body = this.chart.canvas.append('g')
                                          .attr('class', 'rectsGroup')
                                          .selectAll('.rect')
                                          .data(sorted_color_dots)
                                          .enter()
                                          .append('rect')
                                          .attr('class', 'rect')
                                          .attr('width', this.chart.rects.width)
                                          .attr('height', this.chart.rects.height)
                                          .attr('x', 0)
                                          .attr('y', function(d ,i){
                                            return i * rects_height;
                                          })
                                          .attr('fill', function(d){
                                            return d.color
                                          })


      // Draw Ruler ======

      this.chart.ruler.gradient = this.chart.canvas.append("svg:defs")
                                                  .append("svg:linearGradient")
                                                  .attr("id", "gradient")
                                                  .attr("x1", "50%")
                                                  .attr("y1", "0%")
                                                  .attr("x2", "50%")
                                                  .attr("y2", "100%")
                                                  .attr("spreadMethod", "pad");

      this.chart.ruler.gradient.append("svg:stop")
                                .attr("offset", "0%")
                                .attr("stop-color", "#fff")
                                .attr("stop-opacity", 1);

      this.chart.ruler.gradient.append("svg:stop")
                                .attr("offset", "100%")
                                .attr("stop-color", "#000")
                                .attr("stop-opacity", 1);

      this.chart.ruler.body = this.chart.canvas.append('g')
                                                .attr('class','brightness_rect_group')
                                                .attr('transform','translate(' + (this.chart.rects.width + this.chart.plot.width + 60) + ')')
                                                

      // Draw Ruler Dots======

      this.chart.ruler.body.append('rect')
                          .attr('class','brightness_rect')
                          .attr('width', this.chart.ruler.width)
                          .attr('height', this.chart.plot.height)
                          .attr('fill', 'url(#gradient)')

      this.chart.ruler.dots = this.chart.ruler.body.selectAll('.brightness_dots')   
                                                    .data(this.color_dots)
                                                    .enter()
                                                    .append('circle')
                                                    .attr('class', 'brightness_dots')
                                                    .attr('r', 5)
                                                    .attr('cx', this.chart.ruler.width/2)
                                                    .attr('cy', function(d){
                                                      return that.chart.scales.brightnessScale(colorsys.hex_to_hsv(that.normalize_hex(d.color)).v);
                                                    })
                                                    .attr('fill', '#fff')
                                                    .attr('stroke', '#aaa')
                                                    .style('cursor', 'move')
                                                    .call(d3.drag().on('start',function(){

                                                    }).on('drag',function(d){
                                                      let current = d3.select(this);

                                                      let v = that.limite(chart.scales.brightnessScale.invert(d.pos.y), 100, 0);
                                                      d.pos.y = that.limite(d3.event.y, chart.scales.brightnessScale(0),chart.scales.brightnessScale(100));
                                                      
                                                      d.color = colorsys.hsv_to_hex(d.pos.h, d.pos.s, v);

                                                      current.attr('cy', d.pos.y);

                                                      that.update_rects();
                                                      that.update_plot();
                                                    }))
      // ============
    },
    update_plot_by_hex() {
      let normalize_hex = this.normalize_hex
      let chart = this.chart;

      this.color_dots.forEach(function(d){
        d.pos.x = chart.scales.saturationScale(colorsys.hex_to_hsv(normalize_hex(d.color)).s);
        d.pos.y = chart.scales.brightnessScale(colorsys.hex_to_hsv(normalize_hex(d.color)).v);
        d.pos.h = colorsys.hex_to_hsv(normalize_hex(d.color)).h;
        d.pos.s = colorsys.hex_to_hsv(normalize_hex(d.color)).s;
      })


      let dots = this.chart.plot.dots.data(this.color_dots);
      dots.exit().remove();

      // console.log(dots)

      this.chart.plot.dots = this.chart.plot.dots.enter()
                                                .append('circle')
                                                .attr('class', 'dot')
                                                .merge(dots)
                                                .attr('cx', function(d) { return d.pos.x; })
                                                .attr('cy', function(d) { return d.pos.y })
                                                .attr('r', 10)
                                                .attr('fill', function(d){
                                                  return d.color
                                                });
    },
    update_plot() {
      let normalize_hex = this.normalize_hex
      let chart = this.chart;

      // this.color_dots.forEach(function(d){
      //   d.pos.x = chart.scales.saturationScale(colorsys.hex_to_hsv(normalize_hex(d.color)).s);
      //   d.pos.y = chart.scales.brightnessScale(colorsys.hex_to_hsv(normalize_hex(d.color)).v);
      //   d.pos.h = colorsys.hex_to_hsv(normalize_hex(d.color)).h;
      //   d.pos.s = colorsys.hex_to_hsv(normalize_hex(d.color)).s;
      // })


      let dots = this.chart.plot.dots.data(this.color_dots);
      dots.exit().remove();

      // console.log(dots)

      this.chart.plot.dots = this.chart.plot.dots.enter()
                                                .append('circle')
                                                .attr('class', 'dot')
                                                .merge(dots)
                                                .attr('cx', function(d) { return d.pos.x; })
                                                .attr('cy', function(d) { return d.pos.y })
                                                .attr('r', 10)
                                                .attr('fill', function(d){
                                                  return d.color
                                                });


      // console.log(this.chart.plot.dots)

    },
    update_rects(){
      // console.log('update_rects')

      let normalize_hex = this.normalize_hex;
      let chart = this.chart;

      let rects = this.chart.rects.body.data(this.sorted_color_dots);
      // console.log(this.chart.rects.body)
      // console.log(rects)
      rects.exit().remove();

      let rects_height = this.chart.rects.height;
      this.chart.rects.body = this.chart.rects.body.enter()
                                                    .append('rect')
                                                    .attr('class', 'rect')
                                                    .merge(rects)
                                                    .attr('width', this.chart.rects.width)
                                                    .attr('height', this.chart.rects.height)
                                                    .attr('x', 0)
                                                    .attr('y', function(d ,i){
                                                      return i * rects_height;
                                                    })
                                                    .attr('fill', function(d){
                                                      return d.color
                                                    })

    },
    update_ruler() {
      let that = this;
      let normalize_hex = this.normalize_hex;

      let brightness_dots = this.chart.ruler.dots.data(this.color_dots);
      // let brightness_dots = d3.selectAll('brightness_dots').data(this.data);
      // console.log(this.chart.ruler.dots)
      // console.log(brightness_dots)
      brightness_dots.exit().remove();

      this.chart.ruler.dots = this.chart.ruler.dots.enter()
                                                    .append('circle')
                                                    .attr('class', 'brightness_dots')
                                                    .merge(brightness_dots)
                                                    .attr('r', 5)
                                                    .attr('cx', this.chart.ruler.width/2)
                                                    .attr('cy', function(d){
                                                      return that.chart.scales.brightnessScale(colorsys.hex_to_hsv(that.normalize_hex(d.color)).v);
                                                    })
                                                    .attr('fill', '#fff')
                                                    .attr('stroke', '#aaa')
                                                    

    }
  },
  mounted(){
    this.setup_chart()
  }
}
</script>

<style scoped>
 #chart{
  line-height: 0;
  color: #374047;
}

#chart input{
  border: none;
  padding-left: 0.125rem;
  color: #374047;
}
#chart input:focus{
  outline: none;
}
.color_box{
  border: 1px solid #ddd;
  border-radius: 0.125rem;
  box-shadow:0 2px 8px 0 rgba(218, 218, 223, 0.5 );
} 
</style>
