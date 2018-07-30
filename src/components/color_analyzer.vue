<template>
  <div>
    <div id="chart">
      <div class="flex mb4 mt5">
        <div class="color_box ma2" v-for="(i, index) in 8" :key="index">
          <div class="w-100 h4" :style="'background-color:#' + data[i-1]"></div>
          <div class="pv2 ph3">
            <div class="w-100 flex input-box">
              <p>#</p>
              <input class="w-100" type="text" @change="update_chart" v-model="data[i-1]">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      chart: {
        width: 1024,
        height: 600
      },
      data: ['4F65A0','445483','3B4976','324067','2F3C5E','293453','212C4A','1A1D2E']
    }
  },
  computed:{
    sorted_data(){
      let hex_to_hsv = this.hex_to_hsv;
      return this.data.slice(0).sort(function(a, b){
                return hex_to_hsv(b).v - hex_to_hsv(a).v
              })
    }
  },
  methods: {
    hex_to_rgb(val){
      let hex = (val+'').replace(/#/, '');
      let rgb_array = [];

      if(hex.length == 3){
        hex = hex.split('').map(function(d){
                    return d + d;
                  }).join('')
      }

      for (var i = 0; i < 6; i+=2) {
			   rgb_array.push(parseInt(hex.substr(i,2),16));
			  //  fail = fail || rgb[rgb.length - 1].toString() === 'NaN';
      }
      
      return {
        r: rgb_array[0],
        g: rgb_array[1],
        b: rgb_array[2]
      }
    },
    rgb_to_hsv(rgb){
      let r = rgb.r;
      let g = rgb.g;
      let b = rgb.b;
      
      let max = Math.max(r, g, b), min = Math.min(r, g, b),
          d = max - min,
          h,
          s = (max === 0 ? 0 : d / max),
          v = max / 255;

      switch (max) {
          case min: h = 0; break;
          case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
          case g: h = (b - r) + d * 2; h /= 6 * d; break;
          case b: h = (r - g) + d * 4; h /= 6 * d; break;
      }

      return {
          h: h,
          s: s,
          v: v
      };
    },
    hex_to_hsv(val){
      return this.rgb_to_hsv(this.hex_to_rgb(val))
    },
    create_chart(){
      let sorted_data = this.sorted_data
      let margin = {top: 20, right: 20, bottom: 30, left: 20}
      let innerWidth = this.chart.width - margin.left - margin.right;
      let innerHeight = this.chart.height - margin.top - margin.bottom;


      this.canvas = d3.select('#chart')
                  .append('svg')
                  .attr('width', this.chart.width)
                  .attr('height', this.chart.height)
                  // .style('background-color', 'royalblue')
                  .append('g')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let plotWidth = 600;
      let colorRectWidth = 200;
      let plot = this.canvas.append('g')
                    .attr('class', 'plot')
                    .attr("transform", "translate(" + colorRectWidth + ", 0)")

      // console.log(this.canvas)
      let saturationScale = d3.scaleLinear().domain([0, 1]).range([0, plotWidth]);
      let brightnessScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);//.range([innerHeight, 0]);

      let xAxes = d3.axisBottom();

      
      // plot.call(xAxes(saturationScale));
      plot.append("g")
                  .call(d3.axisLeft(brightnessScale)
                          .tickSize(-plotWidth))
                  .attr('class', 'axis')
                  .append('text')
                  .attr('transform', 'translate(0,'+ 6 +')rotate(-90)')
                  .attr('y', 4)
                  .attr('dy', '1.2em')
                  .attr('text-anchor', 'end')
                  .style('font-size', '12px')
                  .text('Brightness')
                  .attr('fill', 'black')
      
      plot.append("g")
                  .call(d3.axisBottom(saturationScale)
                          .tickSize(-innerHeight))
                  .attr('transform', 'translate(0,'+ innerHeight +')')
                  .attr('class', 'axis')
                  .append('text')
                  .attr('transform', 'translate(' + (plotWidth - 6) + ',0)')
                  .attr('y', 4)
                  .attr('dy', '-1.2em')
                  .attr('text-anchor', 'end')
                  .style('font-size', '12px')
                  .text('Saturation')
                  .attr('fill', 'black')


      plot.selectAll('.axis line,path ').style('stroke', '#ddd')

      plot.append()


      let hex_to_hsv = this.hex_to_hsv;

      let dots = plot.selectAll('.dot')
                  .data(this.data)
                  .enter()
                  .append('circle')
                  .attr('class', 'dot')
                  .attr('cx', function(d) { return saturationScale(hex_to_hsv(d).s); })
                  .attr('cy', function(d) { return brightnessScale(hex_to_hsv(d).v); })
                  .attr('r', 10)
                  .attr('fill', function(d){
                    return '#' + d
                  })




      let gradient = this.canvas.append("svg:defs")
                                .append("svg:linearGradient")
                                .attr("id", "gradient")
                                .attr("x1", "50%")
                                .attr("y1", "0%")
                                .attr("x2", "50%")
                                .attr("y2", "100%")
                                .attr("spreadMethod", "pad");

      gradient.append("svg:stop")
              .attr("offset", "0%")
              .attr("stop-color", "#fff")
              .attr("stop-opacity", 1);

      gradient.append("svg:stop")
              .attr("offset", "100%")
              .attr("stop-color", "#000")
              .attr("stop-opacity", 1);

      let brightnessRect = this.canvas.append('rect')
                                      .attr('class','brightnessRect')
                                      .attr('x', colorRectWidth + plotWidth + 20)
                                      .attr('width', 100)
                                      .attr('height', innerHeight)
                                      .attr('fill', 'url(#gradient)')

      let brightnessPlot = this.canvas.append('g')
                                      .attr('class', 'brightnessPlot' )

      let brightnessDots = brightnessPlot.selectAll('.brightnessDots')
                                      .append('g')
                                      .data(this.data)
                                      .enter()
                                      .append('circle')
                                      .attr('class', 'brightnessDots')
                                      .attr('cx', colorRectWidth + plotWidth + 20 + 50)
                                      .attr('cy', function(d) { return brightnessScale(hex_to_hsv(d).v); })
                                      .attr('r', 5)
                                      .attr('fill', '#fff')
                                      .attr('stroke', '#aaa')

      let colorRectsPlot = this.canvas.append('g')
                                      .attr('class', 'colorRectsPlot' )

      let colorRectsHeight = innerHeight/this.data.length;
      let colorRects = colorRectsPlot.selectAll('.colorRects')
                                  .append('g')
                                  .data(sorted_data)
                                  .enter()
                                  .append('rect')
                                  .attr('class','colorRects')
                                  .attr('width', 100)
                                  .attr('height', colorRectsHeight)
                                  .attr('x', 60)
                                  .attr('y', function(d ,i){
                                    return i*colorRectsHeight;
                                  })
                                  .attr('fill', function(d){
                                    return '#' + d
                                  })

    },
    update_chart(){
      console.log(this.sorted_data)
      console.log(this.data)
      // console.log(this.hex_to_rgb('012'))
      // this.hex_to_hsb('012')
      let sorted_data = this.sorted_data

      let margin = {top: 20, right: 20, bottom: 30, left: 40}
      let innerWidth = this.chart.width - margin.left - margin.right;
      let innerHeight = this.chart.height - margin.top - margin.bottom;
      let plotWidth = 600;
      let colorRectWidth = 200;

      let plot = d3.select('.plot')

      let saturationScale = d3.scaleLinear().domain([0, 1]).range([0, plotWidth]);
      let brightnessScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);


      let hex_to_hsv = this.hex_to_hsv;
      let dots = plot.selectAll('.dot')
                    .data(this.data)

      dots.exit().remove();

      let dots_update = dots.enter()
                            .append('circle')
                            .attr('class', 'dot')
                            .merge(dots)
                            .attr('cx', function(d) { return saturationScale(hex_to_hsv(d).s); })
                            .attr('cy', function(d) {
                              return brightnessScale(hex_to_hsv(d).v);
                            })
                            .attr('r', 10)
                            .attr('fill', function(d){
                              return '#' + d
                            });

      let brightnessPlot = d3.select('.brightnessPlot')
      // console.log(brightnessPlot)

      let brightnessDots = brightnessPlot.selectAll('.brightnessDots')
                                          .data(this.data)


      brightnessDots.exit().remove();

      let brightnessDots_update = brightnessDots.enter()
                                                .append('circle')
                                                .attr('class', 'brightnessDots')
                                                .merge(brightnessDots)
                                                .attr('cx', colorRectWidth + plotWidth + 20 + 50)
                                                .attr('cy', function(d) {
                                                  return brightnessScale(hex_to_hsv(d).v);
                                                })

      let colorRectsHeight = innerHeight/this.data.length;
      let colorRectsPlot = d3.select('.colorRectsPlot')

      let colorRects = colorRectsPlot.selectAll('.colorRects')
                                          .data(sorted_data)

      colorRects.exit().remove();

      let colorRects_update = colorRects.enter()
                                        .append('rect')
                                        .attr('class','colorRects')
                                        .attr('width', 100)
                                        .attr('height', colorRectsHeight)
                                        .merge(colorRects)
                                        .attr('height', colorRectsHeight)
                                        .attr('y', function(d ,i){
                                          return i*colorRectsHeight;
                                        })
                                        .attr('fill', function(d){
                                          return '#' + d
                                        })

      // console.log(colorRectsDots)
      
    }
  },
  mounted(){ //必须要在 mounted() 后添加chart
    this.create_chart();
  }
}
</script>

<style>
#chart{
  line-height: 0;
  color: #374047;
}

#chart input{
  border: none;
  padding-left: 0.125rem;
  color: #374047;
  /* height: 1rem; */
}
#chart input:focus{
  outline: none;
}

/* .input-box{
  border-bottom: 2px solid #ddd;
}

.input-box:focus-within{
  border-bottom: 2px solid #006bb7;
} */

.color_box{
  border: 1px solid #ddd;
  border-radius: 0.125rem;
  box-shadow:0 2px 8px 0 rgba(218, 218, 223, 0.5 );
}
</style>
