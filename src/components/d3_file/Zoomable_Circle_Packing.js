// https://bl.ocks.org/mbostock/7607535

module.exports = function (vm) {
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 1000
  let diameter = d3.min([innerWidth,innerHeight])
  let margin = 20;
  // let diameter = +svg.attr("width");

  const svg = d3.select(vm.$refs.chartArea)
              .append('svg')
              .attr('height', height)
              .attr('width', width);
      
  const g = svg.append("g").attr("transform", "translate(" + (diameter / 2 + margin) + "," + (diameter / 2 + margin) + ")");
          
  // g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let color = d3.scaleLinear()
                .domain([-1, 5])
                .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                .interpolate(d3.interpolateHcl);

  let stratify = d3.stratify()
                .parentId(function(d) {
                  return d.id.substring(0, d.id.lastIndexOf("."))
                })
                .id(function(d){
                  return d.id
                })

  let pack = d3.pack()
              .size([diameter, diameter])
              .padding(2)

  d3.csv("/static/flare.csv",function(d){
    d.value = +d.value
    return d
  }).then(function(data) {
    let root = stratify(data).sum(function(d){
                                // console.log(d)
                                return d.value;
                              }).sort(function(a, b) {
                                return b.value - a.value;
                              });
    // console.log(root)

    let focus = root;
    pack(root)
    let nodes = root.descendants();
    let view;

    let circle = g.selectAll("circle")
                  .data(nodes)
                  .enter()
                  .append("circle")
                  // .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                  .style("fill", function(d) {
                    if (d.children) {
                      return color(d.depth);
                    }else{
                      return null;
                    }
                  })
                  .on("click", function(d) {
                    if (focus !== d) {
                      zoom(d);
                      // d3.event.stopPropagation();
                    }
                  });

    let node = g.selectAll("circle");

    svg.style("background", color(-1))
            .on("click", function() { zoom(root); });
  
    zoomTo([root.x, root.y, root.r * 2]);

    function zoom(d) {
      let focus0 = focus; 
      focus = d;

      let transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function(d) {
            let i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) { zoomTo(i(t)); };
          });

      transition.selectAll("text")
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
    
    function zoomTo(v) {
      let k = diameter / v[2]; view = v;
      node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
      circle.attr("r", function(d) { return d.r * k; });
    }

  })
}