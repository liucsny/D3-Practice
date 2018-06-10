// https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7/f57b18818c59adaec54b6fabcfc9967057b398a6

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

  function randomData(samples) {
    let data = []
    let random = d3.randomNormal()

    for (i = 0; i < samples; i++) {
      data.push({
        x: random(),
        y: random()
      })
    }
    return data
  }

  let data = randomData(600)

  let x = d3.scaleLinear()          
            .range([0, innerWidth])
            .nice()

  let y = d3.scaleLinear()
            .range([innerHeight, 0])

  x.domain(d3.extent(data, function (d) { return d.x })).nice()
  y.domain(d3.extent(data, function (d) { return d.y })).nice()


  let xAxis = d3.axisBottom(x).ticks(12)
  let yAxis = d3.axisLeft(y).ticks(12 * height / width)
  let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  let idleTimeout
  let idleDelay = 350

  let brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("end", function(){
              let s = d3.event.selection

              if (!s) {
                if (!idleTimeout){
                  return idleTimeout = setTimeout(function(){
                    idleTimeout = null;
                  }, idleDelay);
                } //不是很懂这个原理
                x.domain(d3.extent(data, function (d) { return d.x; })).nice()
                y.domain(d3.extent(data, function (d) { return d.y; })).nice()
              } else {
                x.domain([s[0][0], s[1][0]].map(x.invert, x))
                y.domain([s[1][1], s[0][1]].map(y.invert, y))
                // scatter.select(".brush").call(brush.move, null) //也不是很懂这个原理
                console.log("success")
                brush.move(scatter.select(".brush"), null)
                // brush.clear()
              }
            // zoom
              let t = svg.transition().duration(750);

              svg.select("#axis--x").transition(t).call(xAxis);
              svg.select("#axis--y").transition(t).call(yAxis);

              scatter.selectAll("circle").transition(t)
                    .attr("cx", function (d) { return x(d.x); })
                    .attr("cy", function (d) { return y(d.y); });
            
            //   scatter.select(".brush").call(brush.move, null)

            })

        // let brush = d3.brush()
        //     .extent([[0, 0], [width, height]])
        //     .on("end", function(){

        //       return idleTimeout = setTimeout(function(){
        //         idleTimeout = null;
        //       }, idleDelay);

        //       let t = svg.transition().duration(750);

        //       svg.select("#axis--x").transition(t).call(xAxis);
        //       svg.select("#axis--y").transition(t).call(yAxis);

        //       scatter.selectAll("circle").transition(t)
        //             .attr("cx", function (d) { return x(d.x); })
        //             .attr("cy", function (d) { return y(d.y); });
        //     })


  g.append("g")
     .attr("class", "x axis")
     .attr('id', "axis--x")
     .attr("transform", "translate(0," + innerHeight + ")")
     .call(xAxis)

  g.append("text")
   .style("text-anchor", "end")
   .attr("x", innerWidth)
   .attr("y", innerHeight - 8)
   .text("X Label")

// y axis
  g.append("g")
   .attr("class", "y axis")
   .attr('id', "axis--y")
   .call(yAxis)

  g.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 6)
   .attr("dy", "1em")
   .style("text-anchor", "end")
   .text("Y Label")

   let clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect") //这两个 "svg:" 好像加不加都一样 
            .attr("width", innerWidth )
            .attr("height", innerHeight )
            .attr("x", margin.left) 
            .attr("y", margin.top)
    // 遮罩clip的用法


   let scatter = svg.append("g")
             .attr("id", "scatterplot")
             .attr("clip-path", "url(#clip)")

    scatter.append('g')
                .attr("id", "scatterplot")
                .selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 4)
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); })
                .attr("opacity", 0.5)
                .style("fill", "#4292c6")
                
    scatter.append("g").attr("class", "brush").call(brush)


}