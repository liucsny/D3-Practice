// https://bl.ocks.org/YouthBread/386ecfc130a4ce312d934b4a0b366e7a/22a8b6304296fd7edbb4e988126b77f38d3ad082

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

    const parseTime = d3.timeParse("%Y-%m-%d")
    const xAxisG = g.append('g').attr('transform', `translate(0, ${innerHeight})`)
    const yAxisG = g.append('g')

    xAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', innerWidth / 2)
          .attr('y', 0)
          .attr('fill', 'black')
          .text('Date')
          
    yAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', -innerHeight / 2)
          .attr('y', 0)
          .attr('transform', `rotate(-90)`)
          .style('text-anchor', 'middle')
          .text('Ride Count')

    const xScale = d3.scaleTime()
    const yScale = d3.scaleLinear()
    const rScale = d3.scaleLinear()
    const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10)



    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10)
        .tickPadding(10)
        .tickFormat(d3.timeFormat("%Y-%m-%d"))
        .tickSize(5)

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10)
        .tickPadding(5)
        .tickSize(5)

    let line = d3.line()

    d3.csv( '/static/南通市住宅项目.csv' ).then( function (d) {
        d.供应套数 = + d.供应套数
        d.供应面积 = + d.供应面积
        d.套均价 = + d.套均价
        d.存量 = + d.存量
        d.成交均价 = + d.成交均价
        d.成交套数 = + d.成交套数
        d.成交金额 = + d.成交金额
        d.成交面积 = + d.成交面积
        d.纬度 = +d.纬度
        d.经度 = +d.经度
        return d
      }).then(function (data) {
        // console.log(data)
        console.log(d3.nest()
        .key(function(d) {
          return d.日期.split(' ')[0]
        }).entries(data))

        data = d3.nest()
                .key(function(d) {
                  return d.日期.split(' ')[0]
                })
                .sortKeys(function(a,b) { 
                  return new Date(b) - new Date(a)
                })
  				.rollup(function (d) {
                    //   console.log(d)
                  return {
                    '成交套数-求和': d3.sum(d,function(d){
                        return d.成交套数
                    }),
                    '成交均价-平均': d3.mean(d,function(d){
                        return d.成交均价
                    }),
                    '成交面积-求和': d3.sum(d,function(d){
                        return d.成交面积
                    }),
                    '成交面积-平均': d3.mean(d,function(d){
                        return d.成交面积
                    })
                  }
                }) //计数求和平均
                .entries(data)

                // .rollup(function (d) {
                //   let sum = 0
                //   d.forEach(e => {
                //     sum = sum + e.成交面积
                //   })
                //   return sum
                // }) //计数求和
                //.rollup(function(leaves) { return {"length": leaves.length, "total_time": d3.sum(leaves, function(d) {return parseFloat(d.time);})} })

        xScale.domain( d3.extent(data, function(d){
            // console.log(parseTime(d.key))
            // console.log(d.key)
            return parseTime(d.key)
        })).range([0, innerWidth])
            .nice()
        
        yScale.domain([0, d3.max(data, function(d){
            return d.value['成交均价-平均']
        })])
          .range([innerHeight, 0])
          .nice()

        //d3.extent:用最大最小值生成的数组

        let line = d3.line()
                    .x(function(d) {
                        return xScale(parseTime(d.key))
                    })
                    .y(function(d) {
                        return yScale(d.value['成交均价-平均'])
                    })

        g.append('path')
           .datum(data)
	         .attr("fill", "none")
     		 .attr("stroke", d => colorScale(d.key))
      		 .attr("stroke-linejoin", "round")
      		 .attr("stroke-linecap", "round")
      		 .attr("stroke-width", 1)
             .attr("d", line)

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);
      })


      //=====================
      vm.$refs.notes.innerHTML = `
      <p>d3.nest()的使用方法总结。</p>
      <p>d3.nest()：将一个表格按照某个字段聚合。</p>
      <p>d3.nest().key(func)：用来指定聚合的字段，可以多次连缀使用，返回一个由Object组成的Array，每个Object有Key和values两个属性，key是聚合的字段，values是一个Array，是聚合出来的结果（也包括聚合字段本身）（也就是说这个操作进行了一次分类，没有改变数据Object本身）。</p>
      <p>d3.nest().key(func).rollup(func)：rollup函数是对聚合后的结果进行一次统计（计数/求和/平均 等等），每个聚合生成一个object（只含有key和values两个property），object.key啥聚合的字段数值，object.values是被聚合的结果，由rollup(func)中的回调函数决定。回调函数内可以针对每一个聚合出来的Array of Objects进行统计。</p>
      <p>d3.nest().key(func).rollup(func).enteries(data)：最终把需要处理的数据（Array of Objects）传入。</p>`
}