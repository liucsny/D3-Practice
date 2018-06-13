// https://bl.ocks.org/mbostock/4063663
// https://bl.ocks.org/Fil/6d9de24b31cb870fed2e6178a120b17d

module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

//   let svg = d3.select(vm.$refs.chartArea)
//                .append('svg')
//               .attr('height', height)
//               .attr('width', width)

  let cellWidth = 960
  let cellSize = 230
  let padding = 20

  let x = d3.scaleLinear()
              .range([padding / 2, cellSize - padding / 2])
  
  let y = d3.scaleLinear()
              .range([cellSize - padding / 2, padding / 2])

  let xAxis = d3.axisBottom().scale(x).ticks(6)
  let yAxis = d3.axisLeft().scale(y).ticks(6)

  let color = d3.scaleOrdinal().range(d3.schemePaired)
  
  d3.csv("/static/flowers.csv", function (d) {
    return d
  }).then(function (data) {
    // console.log(data)

    let domainByTrait = {}//特征
      
    let traits = d3.keys(data[0]).filter(function(d) { return d !== "species"; })
    // console.log(traits)

    let n = traits.length

    traits.forEach(function(trait) {
      domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; })//extent函数可以计算数据表纵向的范围
    })

    xAxis.tickSize(-cellSize * n)
    yAxis.tickSize(-cellSize * n)


    let brushCell


    // Clear the previously-active brush, if any.
    let brush = d3.brush()
                .extent([[0, 0], [cellSize, cellSize]])
                .on("start", function (p) {
                    console.log(d3.event.selection)
                    console.log(d3.brushSelection(this))
                    console.log(this)
                    console.log(d3.brushSelection(svg))
                    console.log(svg)
                    console.log(d3.brushSelection(cell))
                    console.log(cell)
                    // if(extent){
                    //   document.getElementById('hidden').remove()
                    // }

                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.id = 'hidden'
                    if(style.styleSheet){
                      style.styleSheet.cssText=`circle.hidden {
                        fill: #ccc !important;
                      }`;
                    }else{
                      style.appendChild(document.createTextNode(`circle.hidden {
                        fill: #ccc !important;
                      }`));
                    }
                    document.getElementsByTagName('head')[0].appendChild(style)

                    if (brushCell !== this) {
                      d3.select(brushCell).call(brush.move, null)
                      brushCell = this;
                        // console.log(this)
                      x.domain(domainByTrait[p.x]);
                      y.domain(domainByTrait[p.y]);
                    }
                  })
                .on("brush", function (p) {
                    let e = d3.brushSelection(this)

                    svg.selectAll("circle").classed("hidden", function(d) {
                      if(!e){
                        return false
                      } else {
                        return ( e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0] || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1] )
                      }
                    });
                  })
                .on("end",  function brushend() {
                    let e = d3.brushSelection(this)

                    if (e === null) {
                        svg.selectAll(".hidden").classed("hidden", false)
                        document.getElementById('hidden').remove()
                    }
                    // console.log(document.getElementById('hidden'))
                    // document.getElementById('hidden').remove()
                  })

    let svg = d3.select(vm.$refs.chartArea)
            .append('svg')
            .attr('height', cellSize * n + padding)
            .attr('width', cellSize * n + padding)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")")

    svg.selectAll(".x.axis")
            .data(traits)
          .enter().append("g")
            .attr("class", "x axis")
            .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * cellSize + "," + cellSize * n + ")"; })
            .each(function(d) { 
                x.domain(domainByTrait[d])
                d3.select(this).call(xAxis).selectAll('.domain ,.tick line').attr('stroke', '#ddd')  //d3.select(this)第一次看见这种用法
            })
            // svg.call(xAxis)
      
    svg.selectAll(".y.axis")
            .data(traits)
          .enter().append("g")
            .attr("class", "y axis")
            .attr("transform", function(d, i) { return "translate(0," + i * cellSize + ")"; })
            .each(function(d) {
              y.domain(domainByTrait[d])
              d3.select(this).call(yAxis).selectAll('.domain ,.tick line').attr('stroke', '#ddd')
            })
      
    let cell = svg.selectAll(".cell")
            .data(cross(traits, traits))
          .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * cellSize + "," + d.j * cellSize + ")"; })
            .each(function(p) {   //针对selection的每个元素执行一次回调函数  d3.select(this)选取该元素  回调参数p为该元素对应的数据
              let cell = d3.select(this);

              x.domain(domainByTrait[p.x]);
              y.domain(domainByTrait[p.y]);
            
              cell.append("rect")
                  .attr("class", "frame")
                  .attr("x", padding / 2)
                  .attr("y", padding / 2)
                  .attr("width", cellSize - padding)
                  .attr("height", cellSize - padding)
                  .attr("fill", "none")
                  .attr("stroke", '#999')
            
              cell.selectAll("circle")
                    .data(data)
                  .enter().append("circle")
                    .attr("cx", function(d) { return x(d[p.x]); })
                    .attr("cy", function(d) { return y(d[p.y]); })
                    .attr("r", 4)
                    .style("fill", function(d) { return color(d.species); });
              })

        cell.call(brush)
        // console.log(cell)
            
              // Clear the previously-active brush, if any.

    // console.log(cross(traits, traits))
  })

  function cross(a, b) {
    let c = []
    let n = a.length
    let m = b.length, i, j

    for (i = -1; ++i < n;) {
      for (j = -1; ++j < m;) {
        c.push({
          x: a[i],
          i: i,
          y: b[j],
          j: j
        })
      }
    }

    return c;
  }


  vm.$refs.notes.innerHTML = `
      <p>清空d3.brush的方法：d3.select(brushCell).call(brush.move, null);</p>
      <p>判断是否重置brush的方法：<br/><pre>.on("end",  function brushend() {
    let e = d3.brushSelection(this)
    if (e === null) {
      svg.selectAll(".hidden").classed("hidden", false)
      document.getElementById('hidden').remove()
    }
  })</pre></p>
      <p>if (e === null)为判断是否重置brush的方法。</p>
      <p>使用 .each() 对同一个数据进行不同方式的可视化，然后筛选，可以达到多个图对应高亮交互对效果。</p>
      <p>d3.event.selection 和 d3.brushSelection(this) 初步来看，返回的是同一个Array。</p>`
}