// https://beta.observablehq.com/@mbostock/d3-brushable-scatterplot

module.exports = function (vm) {
  let margin = {top: 20, right: 100, bottom: 60, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  const svg = d3.select(vm.$refs.chartArea)
                .append('svg')
                .attr('height', height)
                .attr('width', width)

  const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  let parseTime = d3.timeParse("%Y-%m-%d")
  
//   async function getData() {
// //     let data = await d3.csv('/static/脉策经营收入.csv')
// //     console.log(data)
//   }
  d3.csv('/static/杭州项目客户明细.csv',function (d) {
    // d['到帐额（万元）'] = +d['到帐额（万元）']
    // d['合同额（万元）'] = +d['合同额（万元）']
    // d['已开票未到账额'] = +d['已开票未到账额']
    // d['开票额（万元）'] = +d['开票额（万元）']
    // d['未执行完合同额'] = +d['未执行完合同额']
    // delete d['纬度']
    // delete d['经度']

    d.合同总价 = + d.合同总价
    d.合同面积 = + d.合同面积
    d.成交单价 = + d.成交单价
    d.纬度 = +d.纬度
    d.经度 = +d.经度

    // d['汇总时间'] = parseTime(d['汇总时间'].split(' ')[0])
    // console.log(d)
    return d
  }).then(function(data){
    // console.log(data)

    let xName = '合同总价'
    let yName = '合同面积'
    let rName = '成交单价'

    let x = d3.scaleLinear()
                .domain(d3.extent(data, d => d[xName])).nice()
                .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
                .domain(d3.extent(data, d => d[yName])).nice()
                .range([height - margin.bottom, margin.top])
                
    let size = d3.scaleLinear()
                .domain(d3.extent(data, d => d[rName])).nice()
                .range([1, 20])
    
    let dot = g.append("g")
                .attr("class", "circle")
                .selectAll("g")
                .data(data, data => {
                  delete data.columns
                  return data
                })
                .enter()
                .append("circle")
                .attr("transform", d => `translate(${x(d[xName])},${y(d[yName])})`)
                .attr("fill", "steelblue")
                .attr('opacity', .1)
                .attr("stroke", 'none')
                .attr("stroke-width", 'none')
                .attr("r", d => {
                  return size(d[rName])
                })

    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.select(".domain").remove())  //还有这种写法？
      .call(
        g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", -4)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text(xName)
      )

    g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())  //还有这种写法？
      .call(
        g => g.append("text")
        .attr("x", 50)
        .attr("y", -10)
        .attr("transform", `rotate(90)`)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text(yName)
      )
    
    
    // let xAxis = g.append('g')
    //             .attr("transform", `translate(0,${height - margin.bottom})`)
    //             .call(d3.axisBottom(x))
    //             .call(g => g.select(".domain").remove())
    //             .call(g => g.append("text")
    //                 .attr("x", width - margin.right)
    //                 .attr("y", -4)
    //                 .attr("fill", "#000")
    //                 .attr("font-weight", "bold")
    //                 .attr("text-anchor", "end")
    //                 .text(data.x))
                    
  })

//   console.log(getData())
//   let data = await require('/static/脉策经营收入.csv')
  
//   x = d3.scaleLinear()
//         .range([margin.left, width - margin.right])

//   console.log(data)

}