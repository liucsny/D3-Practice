module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let innerRadius = 140
  let outerRadius = Math.min(innerWidth, innerHeight) / 3

  let svg = d3.select(vm.$refs.chartArea)
              .append('svg')
              .attr('height', height)
              .attr('width', width)

  let g = svg.append('g').attr('transform',`translate(${innerWidth/2},${innerHeight/2})`)

  let xScaleOffset = Math.PI * 75/180;
  let x = d3.scaleBand()
            .range([0.05*Math.PI, 1.95*Math.PI])
            .align(1)

  let y = d3.scaleLinear()
            .range([innerRadius, outerRadius])

  d3.csv("/static/simple_stat.csv", function(d, i, columns) {
    
    d.accidents = (+d.left_lane) + (+d.right_lane)
    delete(d.left_lane)
    delete(d.right_lane)
    
    return d
  }).then(function(data){

    // console.log(data.map(function(d) { return d.km }))
    x.domain(data.map(function(d) { return d.km }))
    y.domain([0, d3.max(data, function(d) { return d.accidents })])
    let meanAccidents = d3.mean(data, function(d) { return d.accidents })

    g.append('g')
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("fill", "#91bfdb")
        .attr('d',d3.arc()
                    .innerRadius(function(d) { return y(0); })
                    .outerRadius(function(d) { return y(d.accidents); })
                    .startAngle(function(d) { return x(d.km); })
                    .endAngle(function(d) { return x(d.km) + x.bandwidth(); })
                    .padAngle(0.01)
                    .padRadius(innerRadius)
        )

    let label = g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) { return "rotate(" + ((x(d.km) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

    label.append("line")
          .attr("x2", function(d) { return (((d.km % 5) == 0) | (d.km == '1')) ? -7 : -4 })
          .attr("stroke", "#aaa")

    label.append("text")
          .attr("transform", function(d) { return (x(d.km) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
          .text(function(d) {
              var xlabel = (((d.km % 5) == 0) | (d.km == '1')) ? d.km : '';
              return xlabel })
          .style('color', '#aaa')
          .attr('font-size','10px')
  })


  vm.$refs.notes.innerHTML = `
  <p>d3.csv(Path, function(data, index, columns) {})</p>
  <p>x.domain(data.map(function(d) { return d.km }))</p>
  `
}