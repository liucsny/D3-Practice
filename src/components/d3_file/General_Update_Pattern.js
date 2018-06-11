// https://bl.ocks.org/mbostock/3808218

module.exports = function (vm) {
  let margin = {top: 40, right: 60, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

  let svg = d3.select(vm.$refs.chartArea)
                  .append('svg')
                  .attr('height', height)
                  .attr('width', width)

  let g = svg.append("g").attr("transform", "translate(32," + (height / 2) + ")")

  function update(data) {
    let text = g.selectAll("text").data(data)
    // .data(data,function (d) {
    //   return d
    // })

    // UPDATE
    // Update old elements as needed.
    text.attr('fill', '#4D64C5').attr('font-family', 'monospace').attr('font-size', '22px')

    text.exit().remove()

    // ENTER
    // Create new elements as needed.
    //
    // ENTER + UPDATE
    // After merging the entered elements with the update selection,
    // apply operations to both.

    text.enter().append("text")
      .attr("fill", "#C5634D")
      .attr('font-family', 'monospace').attr('font-size', '22px')
      .attr("x", function(d, i) { return i * 18 })
    .merge(text)
      .transition()
      .duration(1000)
      .text(function(d, i) { return d })
  }

  update(alphabet)

  d3.interval(function() {
    update(d3.shuffle(alphabet)
        .slice(0, Math.floor(Math.random() * 26))
        .sort());
  }, 2000);
}