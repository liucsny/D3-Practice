// http://bl.ocks.org/alandunning/864b6f486f78bdfaee0a/102a39b0d6a49150879ab899116f555b29863799
// http://bl.ocks.org/danaoira/7e2ffa935c8da4f97681f376f34ae5a5/469f3cc05a0719a970984d9573017dd7e81b1f55


module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 80}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let getMinMax = function(array, attr) {
    var min = 99999999;
    var max = 0;
    array.forEach(function(d) {
      d[attr].forEach(function(i) {
        if (i[1] < min) {
          min = i[1];
        }
        if (i[1] > max) {
          max = i[1];
        }
      });
    });
    return [min, max];
  };

  // let colorDomain = d3.nest().key(function(d) { return d.region }).object(newData);

  let svg = d3.select(vm.$refs.chartArea)
              .append('svg')
              .attr('height', height)
              .attr('width', width)

  let g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`)

  let xScale = d3.scaleLog()
                .range([0, innerWidth])

  let yScale = d3.scaleLinear()
                .range([innerHeight, 0])

  let rScale = d3.scaleSqrt()
                .range([1,90])

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

  // 数据：[年份, 值]  
  // 这两个函数本质上都是对json数据进行处理，转化为输入一个“年份”和“数值的类型”，返回一个国家序列的数值
  // 不同代码中由于数据类型不同，这一部分的函数内部结构很可能不一样，但是函数的输入输出应该是相同的
  // 示例代码里的函数写得不严谨

  let bisect = d3.bisector(function(d) { return d[0]; })

  function interpolateData(nations,year) {
    return nations.map(function(d) {
        return {
            name: d.name,
            region: d.region,
            income: interpolateValues(d.income, year),
            population: interpolateValues(d.population, year),
            lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
        };
    });
  }

  function interpolateValues(values, year) {
    var i = bisect.left(values, year, 0, values.length - 1),
        a = values[i];
    if (i > 0) {
        var b = values[i - 1],
            t = (year - a[0]) / (b[0] - a[0]);
        return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
  }
  //=========================================================

  let label = svg.append("text")
                .attr("class", "year label")
                .attr("text-anchor", "end")
                .attr("y", height - 60)
                .attr("x", width)
                .text(1800)
                .style('font', '500 196px "Helvetica Neue"')
                .attr('fill', '#ddd')

  d3.json("/static/nations.json", function (d) {
    // console.log(d)
    return d
  })
  .then(function (data) {
    // console.log(data)

    let xAttr = 'income'
    let yAttr = 'lifeExpectancy'
    let rAttr = 'population'
    let colorAttr = 'region'
    let key = 'name'

    let xExtent = getMinMax(data, "income");
    let yExtent = getMinMax(data, "lifeExpectancy");
    let rExtent = getMinMax(data, "population");
    let colorDomain = d3.nest().key(function(d) { return d.region }).object(data)

    xScale.domain([100, xExtent[1]])
    yScale.domain([0, (yExtent[1] + 5)])
    rScale.domain(rExtent)
    colorScale.domain(colorDomain)

  	let dot = g.append("g")
    		.attr("class", "dots")
    	  .selectAll(".dot")
    		.data(interpolateData(data ,1800))
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return xScale(d[xAttr])
        })
        .attr("cy", function(d) {
          return yScale(d[yAttr])
        })
        .attr("r", function(d) {
          return rScale(d[rAttr])
        })
        .attr("fill", function(d) {
          return colorScale(d[colorAttr])
        })
        .attr("stroke", "black")
        .attr("stroke-width", ".5px")
        .attr("class", function (d) { return "dot " + d.name; })
        .sort(function(a, b) {
          return rScale(b[rAttr]) - rScale(a[rAttr])
        })
  
    let box = label.node().getBBox()
    // getBBox()已经是svg的api，不是d3的api// Start a transition that interpolates the data based on year.
  
    // svg.transition()
    //   .duration(15000)
    //   .ease("linear")
    //   .tween("year", function() {
    //   	let year = d3.interpolateNumber(1800, 2009);
    //   	return function(t) {
    //       displayYear(year(t))
    //     }
    //   })
      // .each("end", function() {
      //   let yearScale = d3.scaleLinear()
      //           .domain([1800, 2009])
      //           .range([box.x + 10, box.x + box.width - 10])
      //           .clamp(true)

      //       // // Cancel the current transition, if any.
      //       // svg.transition().duration(0);

      //   overlay.on("mouseover", function() {
      //             label.classed("active", true)
      //           })
      //           .on("mouseout", function() {
      //             label.classed("active", false)
      //           })
      //           .on("mousemove touchmove", function () {
      //             let year = yearScale.invert(d3.mouse(this)[0])
      //             // d3.mouse(container)解释：Returns the x and y coordinates of the current event relative to the specified container
      //             // d3.mouse(container)返回一个数组，对应x和y的值，这里只考虑x的值，所以用d3.mouse(this)[0]

      //             label.text(Math.round(year));

      //             dot.data(interpolateData(data,year))
      //               .attr("cx", function(d) {
      //                 return xScale(d[xAttr])
      //               })
      //               .attr("cy", function(d) {
      //                 return yScale(d[yAttr])
      //               })
      //               .attr("r", function(d) {
      //                 return rScale(d[rAttr])
      //               })
      //               .attr("fill", function(d) {
      //                 return colorScale(d[colorAttr])
      //               })
      //               .sort(function(a, b) {
      //                 return rScale(b[rAttr]) - rScale(a[rAttr])
      //               })

      //           })
      //   })



    let overlay = svg.append("rect")
                        .attr("class", "overlay")
                        .attr("x", box.x)
                        .attr("y", box.y)
                        .attr("width", box.width)
                        .attr("height", box.height)
                        .attr("fill", 'none')
                        .style("cursor", "ew-resize")
                        .style("pointer-events", "all")
                        .on("mouseover", function() {
                          
                          let yearScale = d3.scaleLinear()
                              .domain([1800, 2009])
                              .range([box.x + 10, box.x + box.width - 10])
                              .clamp(true)

                          // // Cancel the current transition, if any.
                          // svg.transition().duration(0);
                  
                          overlay.on("mouseover", function() {
                                label.classed("active", true)
                              })
                              .on("mouseout", function() {
                                label.classed("active", false)
                              })
                              .on("mousemove touchmove", function () {
                                let year = yearScale.invert(d3.mouse(this)[0])
                                // d3.mouse(container)解释：Returns the x and y coordinates of the current event relative to the specified container
                                // d3.mouse(container)返回一个数组，对应x和y的值，这里只考虑x的值，所以用d3.mouse(this)[0]

                                label.text(Math.round(year));

                                dot.data(interpolateData(data,year))
                                  .attr("cx", function(d) {
                                    return xScale(d[xAttr])
                                  })
                                  .attr("cy", function(d) {
                                    return yScale(d[yAttr])
                                  })
                                  .attr("r", function(d) {
                                    return rScale(d[rAttr])
                                  })
                                  .attr("fill", function(d) {
                                    return colorScale(d[colorAttr])
                                  })
                                  .sort(function(a, b) {
                                    return rScale(b[rAttr]) - rScale(a[rAttr])
                                  })
                              })

                      })
        
        // console.log(box)
  })

  vm.$refs.notes.innerHTML = `
  <p>总体而言没有很多特别难的api使用，但是非常综合。</p>
  <p>逻辑流程：
    <p class='ml3'>1）处理数据：构建一个函数，该函数为输入某个年份得到该年份各国的x，y，r，color的数据Object（也就是用year对数据进行降维拆分）</p>
    <p class='ml3'>2）绘制数据：用1800年为起点，绘制该年份的plot可视化图。</p>
    <p class='ml3'>3）更新数据：以mouse事件为trigger，更新年份year的输入，通过（1）构建的函数得到相应年份的数据，并绘制。</p>
  </p>
  <p>问题：</p>
  <p class='ml3'>处理数据的函数使用了 <span class='blue'>d3.bisectLeft()</span> 函数，这个没有仔细研究。</p>
  <p class='ml3'>原例中使用了transition.tween(name[, value])动画进行平滑，这里没有使用研究。</p>
  <p class='ml3'>这里没有使用selection.merge(other)进行动画更新，需要研究一下何时使用merge，何时不使用。</p>
  `
}