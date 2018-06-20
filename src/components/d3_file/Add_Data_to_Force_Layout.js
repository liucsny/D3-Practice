// https://bl.ocks.org/veltman/d44f0b296139347dabbacea36ac9e27c

module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let diameter = 250,
  circleSize = d3.scaleLinear().range([100, 5000000]);

  let svg = d3.select(vm.$refs.chartArea)
        .append('svg')
        .attr("width", diameter * 2)
        .attr("height", diameter * 2)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + " " + diameter / 2 + ")");

  function randomData(numNodes) {
    return d3.range(numNodes).map(function(d) {
      return {
        id: d,
        name: d ? "Leaf" : "Root",
        size: circleSize(Math.random()),
        parent: d ? 0 : undefined
      }
    })
  }

  let data = randomData(20)

//   let stratify = d3.stratify()
//                 .id(d => d.id)
//                 .parentId(d => d.parent)

//   let pack = d3.pack().size([diameter - 4, diameter - 4])

//   let root = stratify(data)
//             .sum(d => d.size)
//             .sort((a, b) => b.value - a.value)

  vm.$refs.notes.innerHTML = `
  <p>d3.range(num) 生成一个从 0到num-1 的数组，如：d3.range(5) => [0, 1, 2, 3, 4]</p>
  `
}