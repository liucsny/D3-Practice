module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let svg = d3.select(vm.$refs.chartArea)
              .append('svg')
              .attr('height', height)
              .attr('width', width)

  let x = d3.scaleBand().rangeRound([0, innerWidth]).padding(0.3)
  let y = d3.scaleLinear().rangeRound([innerHeight, 0])
  
  let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv( '/static/杭州项目客户明细.csv', function (d) {
    d.合同总价 = + d.合同总价
    d.合同面积 = + d.合同面积
    d.纬度 = +d.纬度
    d.经度 = +d.经度
    // console.log(d.合同总价)
    return d
  }).then(function (data) {

    data = data.slice(100,160)

    x.domain(data.map(function(d) { return d.名称 }))
    y.domain([0, d3.max(data, function(d) { return d.合同总价 })])

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.名称); })
      .attr("y", function(d) { return y(d.合同总价); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return innerHeight - y(d.合同总价); })
      .attr("fill", "steelblue")

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("合同总价")
      .attr("fill", "black")

    // console.log(data)
  })
}