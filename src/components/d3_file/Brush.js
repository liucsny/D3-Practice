// http://blockbuilder.org/Fil/2d43867ba1f36a05459c7113c7f6f98a
// https://bl.ocks.org/mbostock/87746f16b83cb9d5371394a001cbd772

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
              
  let randomX = d3.randomUniform(0, 1)
  let randomY = d3.randomNormal(0.5, 0.12)
    
  let data = d3.range(800).map(function() { return [randomX(), randomY()] })

  let x = d3.scaleLinear().range([margin.left, innerWidth])
  let y = d3.scaleLinear().range([0, height])

  let brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("start brush end", function (d) {
            // console.log(d)
            let extent = d3.event.selection //返回框选的范围：[[左上角-x，左上角-y],[右下角-x，右下角-y]]
            if(extent){
              extent = extent.map(function (d) {
                return [x.invert(d[0]), y.invert(d[1])]
              })
              
              circle.attr('stroke',function (d) {
                // console.log(d)
                if((d[0] > extent[0][0] && d[0] < extent[1][0])&&(d[1] > extent[0][1] && d[1] < extent[1][1])){
                  return 'red'
                }
              })
            }

            // console.log(extent)
            // console.log(extent.map(x.invert))
            // console.log()
            // if (s == null) {
            //   handle.attr("display", "none");
            //   circle.classed("active", false);
            // } else {
            //   var sx = s.map(x.invert);
            //   circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });
            //   handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
            // }
        })
  
  
  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate( 0," + innerHeight + ")")
    .call(d3.axisBottom(x));

  let circle = svg.append("g")
            .attr("class", "circle")
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("transform", function(d) {
              return "translate(" + x(d[0]) + "," + y(d[1]) + ")"
            })
            .attr("r", 3.5)
            .attr('fill-opacity', 0.2)
            .attr('transition', 'fill-opacity 250ms linear')
            
    let gBrush = svg.append("g")
                .attr("class", "brush")
                .call(brush)

//   console.log(data)
}