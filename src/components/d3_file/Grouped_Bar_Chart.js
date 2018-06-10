// http://bl.ocks.org/mashehu/de923d763a53d523596ba81c6d1f3233/da4a271a5a895cb90da3bb9dce415f20c158b7d4
// https://bl.ocks.org/mbostock/3887051/805adad40306cedf1a513c252ddd95e7c981885a
// 一维表格进行统计，汇总成为二维表格，再进行制图

module.exports = function (vm) {
  let margin = {top: 20, right: 60, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let svg = d3.select(vm.$refs.chartArea)
              .append('svg')
              .attr('height', height)
              .attr('width', width)

//   let x = d3.scaleBand().rangeRound([0, innerWidth]).padding(0.3)
  let xOutter = d3.scaleBand().rangeRound([0, innerWidth]).paddingInner(0.1)
  let xInner = d3.scaleBand().padding(0.05)

  let y1 = d3.scaleLinear().rangeRound([innerHeight, 0])
  let y2 = d3.scaleLinear().rangeRound([innerHeight, 0])

  let color = d3.scaleOrdinal().range(d3.schemeCategory10)

  let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  d3.csv( '/static/杭州项目客户明细.csv', function (d) {
    d.合同总价 = + d.合同总价
    d.合同面积 = + d.合同面积
    d.成交单价 = + d.成交单价
    d.纬度 = +d.纬度
    d.经度 = +d.经度

    return d
  }).then(function (data) {
    // data = data.slice(100,120)
    data = d3.nest()
            .key(function(d){
              return d.产品类型
            })
            .rollup(function(d){
              return {
                '合同总价-平均': d3.mean(d, function(d){
                  return d.合同总价
                }),
                '合同面积-求和': d3.sum(d, function(d){
                  return d.合同面积
                }),
                '成交单价-平均': d3.mean(d, function(d){
                  return d.成交单价
                })
              }
            }).entries(data)

      // console.log(d3.keys(data[0].value))
      console.log(data)
    // let keys = ['合同总价', '成交单价']
    let keys = d3.keys(data[0].value)

    xOutter.domain(data.map(function(d) { return d.key; }))
    xInner.domain(keys).rangeRound([0, xOutter.bandwidth()])

    // // 什么鬼
    y1.domain([0, 
      d3.max(data, function(d) {
        return d3.max(['合同总价-平均','成交单价-平均'], function(key) { 
          return d.value[key]
        })
      })
    ]).nice()

    y2.domain([0, 
      d3.max(data, function(d) { 
        return d.value['合同面积-求和']
      })
    ]).nice()

    g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) {
    //     // console.log(d)
        return "translate(" + xOutter(d.key) + ",0)"
      })
    .selectAll("rect")
    .data(function(d) {
      // console.log(d)
      return d3.entries(d.value)
    })
    .enter().append("rect")
      .attr("x", function(d) {
        return xInner(d.key)
      })
      .attr("y", function(d) {
        if(['合同总价-平均','成交单价-平均'].includes(d.key)){
          // console.log(d)
          return y1(d.value)          
        } else {
          return y2(d.value)
        }
      })
      .attr("width", xInner.bandwidth())
      .attr("height", function(d) { 
        if(['合同总价-平均','成交单价-平均'].includes(d.key)){
          return innerHeight - y1(d.value) 
        } else {
          return innerHeight - y2(d.value)
        }
      })
      .attr("fill", function(d) { return color(d.key) })

    g.append("g")
      .call(d3.axisLeft(y1))
    
    g.append("g")
      .attr("transform", "translate(" + innerWidth + ", 0)")
      .call(d3.axisRight(y2))
      
    g.append("g")
      .attr("transform", "translate(0," + innerHeight + ")")
      .call(d3.axisBottom(xOutter))

    // svg.append("g")
    // .call(
    //   d3.brush()
    //       .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
    //       .on("start brush end", brushed))
      
    // function brushed() {
    //   let value = [];
    //   if (d3.event.selection) {
    //     const [[x0, y0], [x1, y1]] = d3.event.selection;
    //     value = data.filter(d => x0 <= x(d.x) && x(d.x) < x1 && y0 <= y(d.y) && y(d.y) < y1);
    //   }
    //   svg.property("value", value).dispatch("input");
    // }



    //   .call(d3.axisBottom(x0))

    // console.log(d3.max(keys, function(key) { return d[key] }))
    // console.log(d3.max(data, function(d) { 
    //     console.log(d)
    //     console.log(keys)        
    //     return d3.max(keys, function(key) { 
    //         // console.log(key)
    //         return d[key]
    //     }) 
    // }))


  })
}