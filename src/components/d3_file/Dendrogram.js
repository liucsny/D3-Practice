// https://bl.ocks.org/mbostock/ff91c1558bc570b08539547ccc90050b/97d082bc199b9c0ae0c73b7afe3924a9b3daea5a

module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 3000
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  const svg = d3.select(vm.$refs.chartArea)
              .append('svg')
              .attr('height', height)
              .attr('width', width)

  const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//   let text = 'flare.vis.operator.layout.RadialTreeLayout'
//   console.log(text.substring(0, text.lastIndexOf(".")))
//   console.log(text.substring(text.lastIndexOf(".")+1))

  let cluster = d3.cluster()
                    .size([innerHeight, innerWidth - 100]) //这里height和widh是反过来的
                    // .nodeSize([12,23])

  let stratify = d3.stratify()
                    .parentId(function(d) {
                      return d.id.substring(0, d.id.lastIndexOf("."))
                    })
                    .id(function(d){
                      return d.id
                    })
                    // 这里默认 id 为 d.id 这里的id函数可以省去

  d3.csv("/static/flare.csv",function(d){
    d.value = +d.value
    return d
  }).then(function(data) {
    let root = stratify(data)
                // .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });
    
    // console.log(root)
    cluster(root)
    // console.log(root)

    let link = g.selectAll(".link")
                .data(root.descendants().slice(1))
                .enter().append("path")
                .attr("class", "link")
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', .2)
                .attr("d", function(d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.parent.y + 100) + "," + d.x
                    + " " + (d.parent.y + 100) + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
                })

    let node = g.selectAll(".node")
            .data(root.descendants())
            // 传入 .data()的一定要是个 Data Array
            // root.descendants() 返回root节点所有子节点的 Data Array
            .enter().append("g")
            .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    // console.log(root.descendants())
    // 传入 .data()的一定要是个 Data Array
    // root.descendants() 返回root节点所有子节点的 Data Array

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", 3)
        .attr("x", function(d) { return d.children ? -8 : 8; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .style("font-size", 10)
        .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); })

  })

  vm.$refs.notes.innerHTML = `
  <p> d3.hierarchy 和 d3.stratify()的区别：hierarchy用于直接处理有层级关系的JSON数据；stratify用于处理常规的表格数据，根据一定的设定转化为层级数据。</p>
  <p> let stratifyFunction = d3.stratify() 根据后缀的配置对数据进行层级化，调用stratifyFunction(data)会生成一个root object</p>
  <p> cluster(root) 是对原root进行直接改变，按照设置给root对象添加Dendrogram（系统树图）的属性（x，y）。</p>
  <p> node.ancestors() 返回该node所有的父节点，以节点的 Data Array 返回出来；node.descendants() 返回该node所有的子节点，以节点的 Data Array 返回出来；</p>
`
}