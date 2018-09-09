// http://bl.ocks.org/renecnielsen/505377bcb05e96332b0336d8857a83fb
module.exports = function (vm) {
  let WIDTH = window.innerWidth / 2;
  let HEIGHT = window.innerHeight / 2;

  d3.select(vm.$refs.chartArea).style('height', '3000px')

  // vm.$refs.chartArea.appendChild()

  let svg = d3.select(vm.$refs.chartArea)
              .append("svg")
              .style('position', 'fixed')
              .attr('width', WIDTH)
              .attr('height', HEIGHT)
              .append('g')
              .attr('transform', 'translate(' + (WIDTH / 2) + ',' + (HEIGHT / 2) + ')')
              // .attr('background-color', 'steelblue')

  let hourRect = svg.append('g').append('rect')
              .attr('x', -3)
              .attr('y', -87)
              .attr('width', 6)
              .attr('height', 90)
              .attr('fill', '#333')
            
  let minuteRect = svg.append('g').append('rect')
              .attr('x', -2)
              .attr('y', -118)
              .attr('width', 4)
              .attr('height', 120)
              .attr('fill', '#333')

  let body = d3.select('body').node()
  let hourHandRotation = d3.scaleLinear()
                            .domain([0, SCROLL_LENGTH])
                            .range([0, 360])
}