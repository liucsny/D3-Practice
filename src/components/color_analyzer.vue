<template>
  <div>
    <div id="chart"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      chart: {
        width: 600,
        height: 600
      },
      data: [10,20,30,40,50,60,70]
    }
  },
  methods: {
    create_chart(){
      let margin = {top: 20, right: 20, bottom: 30, left: 60}
      let innerWidth = this.chart.width - margin.left - margin.right;
      let innerHeight = this.chart.height - margin.top - margin.bottom;
      
      this.canvas = d3.select('#chart')
                  .append('svg')
                  .attr('width', this.chart.width)
                  .attr('height', this.chart.height)
                  // .style('background-color', 'royalblue')
                  .append('g')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // console.log(this.canvas)
      let saturationScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
      let brightnessScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

      let xAxes = d3.axisBottom();

      
      // plot.call(xAxes(saturationScale));
      this.canvas.append("g")
                  .call(d3.axisLeft(brightnessScale)
                          .tickSize(-innerWidth))
                  .attr('class', 'axis')
      
      this.canvas.append("g")
                  .call(d3.axisBottom(saturationScale)
                          .tickSize(-innerHeight))
                  .attr('transform', 'translate(0,'+ innerHeight +')')
                  .attr('class', 'axis')

      this.canvas.selectAll('.axis line,path ').style('stroke', '#ddd')

      let plot = this.canvas.selectAll('.dot')
                  .data(this.data)
                  .enter()
                  .append('circle')
                  .attr('class', 'dot')
                  .attr('cx', function(d) { return saturationScale(d); })
                  .attr('cy', function(d) { return brightnessScale(d); })
                  .attr('r', 5)
    }
  },
  mounted(){ //必须要在 mounted() 后添加chart
    this.create_chart();
  }
}
</script>

<style>
</style>
