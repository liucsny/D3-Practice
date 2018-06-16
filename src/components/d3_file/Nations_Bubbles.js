// http://bl.ocks.org/alandunning/864b6f486f78bdfaee0a/102a39b0d6a49150879ab899116f555b29863799

module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 80}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let svg = d3.select(vm.$refs.chartArea)
              .append('svg')
              .attr('height', height)
              .attr('width', width)

  let g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`)

  let xScale = d3.scaleLog()
                // .domain([100, xExtent[1]])
                .range([0, innerWidth])

  let yScale = d3.scaleLinear()
                // .domain([0, (yExtent[1] + 5)])
                .range([innerHeight, 0])

  let rScale = d3.scaleSqrt()
                // .domain(rExtent)
                .range([0,90])

  let colorScale = d3.scaleOrdinal()
                // .domain(colorDomain)
                .range(d3.schemePaired)

  let x = d3.axisBottom()
				.scale(xScale)
				.ticks(10, ".0f");

  let y = d3.axisLeft()
				.scale(yScale);
        
                let xAxis = g.append("g")
				.call(x)
                .attr("transform", "translate(0, " + innerHeight + ")")
                
  let yAxis = g.append("g")
            .call(y)

  let xText = g.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", innerWidth)
            .attr("y", innerHeight - 6)
            .text("income per capita, inflation-adjusted (dollars)")
            
  let yText = g.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("life expectancy (years)")

  let label = g.append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end")
            .attr("y", height - 24)
            .attr("x", width)
            .text(1800)

  d3.json("/static/nations.json", function (d) {
    // console.log(d)
    return d
  })
  .then(function (data) {
    console.log(data)

  })


}