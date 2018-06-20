// https://bl.ocks.org/gcalmettes/95e3553da26ec90fd0a2890a678f3f69

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

  const x = d3.scaleLinear()
            .rangeRound([0, innerWidth])
            .domain([2, 11])
    
  const tooltip = d3.select(vm.$refs.chartArea)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)



const nbins = 20

  d3.csv('/static/roster.csv', function(d){
    d['Value'] = +d['Value']
    return d
  }).then(function(allData) {
    // console.log(allData)

    let data = d3.shuffle(allData)
      .slice(0, 35)

    const histogram = d3.histogram()
                        .value(function(d) { return d.Value })
                        .thresholds(x.ticks(nbins))

    // console.log(x.ticks(nbins))

    const bins = histogram(data)
    console.log(bins)

    let binContainer = svg.selectAll(".gBin")
                        .data(bins)

    binContainer.exit().remove()

    let binContainerEnter = binContainer.enter()
      .append("g")
        .attr("class", "gBin")
        .attr("transform", d => `translate(${x(d.x0)}, ${innerHeight})`)


    binContainerEnter.selectAll("circle")
        .data( function(d) {
          return d.map((p, i) => {
            return {
              idx: i,
              name: p.Name,
              value: p.Value,
              radius: (x(d.x1)-x(d.x0))/2
            }
        })
      }
      )
      .enter()
      .append("circle")
        .attr("class", "enter")
        .attr("cx", 0) //g element already at correct x pos
        .attr("cy", function(d) {
            return - d.idx * 2 * d.radius - d.radius }) //堆积效果的关键在这里
        .attr("r", 0)
        .attr('fill', 'royalBlue')
        // .on("mouseover", tooltipOn)
        // .on("mouseout", tooltipOff)
        .transition()
          .duration(500)
          .attr("r", function(d) {
          return (d.length==0) ? 0 : d.radius; })
    // console.log(histogram)
  })

  vm.$refs.notes.innerHTML = `
  <p>关键点1：</p>
  <pre>
  let binContainer = svg.selectAll(".gBin")
                        <span class='red'>.data(bins)</span>

  let binContainerEnter = binContainer.enter()
    .append("g")
      .attr("class", "gBin")
        .attr("transform", d => 'translate($ {x(d.x0)}, $ {height})')
  
  binContainerEnter.selectAll("circle")<span class='red'>
      .data( function(d) {
        return d.map((p, i) => {
          return {
            idx: i,
            name: p.Name,
            value: p.Value,
            radius: (x(d.x1)-x(d.x0))/2
          }
      })
    }
    )</span>
    .enter()</pre>
  <p>.data()使用了两次，第一次将bins传进去，第二次将bins中的内容打散成数组。</p>
  </br>
  <p>关键点2：</p>
  <pre>
  .data(d => d.map((p, i) => {
    return {idx: i,
            name: p.Name,
            value: p.Value,
            radius: (x(d.x1)-x(d.x0))/2
          }
  }))
  .enter()
  .append("circle")
  .attr("class", "enter")
  .attr("cx", 0)
  .attr("cy", function(d) {
    return - d.idx * 2 * d.radius - d.radius }) //堆积效果的关键在这里
  .attr("r", 0)
  </pre>
  `

}