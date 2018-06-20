// https://bl.ocks.org/mbostock/b2fee5dae98555cf78c9e4c5074b87c3
// https://github.com/xswei/d3-array/blob/master/README.md#histogram

module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom
  
  const svg = d3.select(vm.$refs.chartArea)
                .append('svg')
                .attr('height', height)
                .attr('width', width)
    
  const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  let parseDate = d3.timeParse("%m/%d/%Y %H:%M:%S %p")
    // formatCount = d3.format(",.0f")

  let x = d3.scaleTime()
        .domain([new Date(2015, 0, 1), new Date(2016, 0, 1)])
        .rangeRound([0, innerWidth])

  let y = d3.scaleLinear()
        .range([innerHeight, 0])

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(x));
  
  d3.csv('/static/homicides.csv', function(d){
    d.date = parseDate(d.date);
    return d;
  }).then(function(data) {
    

    let histogram = d3.histogram()
                    .value(function(d) { return d.date; })
                    .domain(x.domain())
                    .thresholds(x.ticks(d3.timeWeek))

    // console.log(d3.timeWeek)
    // console.log(x.ticks(d3.timeWeek))

    let bins = histogram(data)

    y.domain([0, d3.max(bins, function(d) { return d.length })])

    console.log(bins)

    var bar = g.selectAll(".bar")
                .data(bins)
                .enter().append("g")
                .attr("class", "bar")
                .attr("transform", function(d) {
                  return "translate(" + x(d.x0) + "," + y(d.length) + ")"
                });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function(d) { return innerHeight - y(d.length); })
        .attr('fill', 'steelBlue')

    // bar.append("text")
    //     .attr("dy", ".75em")
    //     .attr("y", 6)
    //     .attr("x", function(d) { return (x(d.x1) - x(d.x0)) / 2; })
    //     .attr("text-anchor", "middle")
        // .text(function(d) { return formatCount(d.length); });

    // console.log(bins)
  })

}  