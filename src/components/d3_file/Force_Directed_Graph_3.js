// import h2 from '../lib/h2';

module.exports = function (vm) {

// export default function(vm){
  // const h2 = require('../lib/h2');
  // console.log('hello world')
  const margin = {top: 20, right: 20, bottom: 30, left: 60}
  const width = vm.$refs.chartArea.offsetWidth * 0.95
  const height = 800
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const svg = d3.select(vm.$refs.chartArea)
                .append('svg')
                .attr('height', height)
                .attr('width', width)

  const add = d3.select(vm.$refs.chartArea).append('button').text('add')
  const rm = d3.select(vm.$refs.chartArea).append('button').text('remove')

  let a = {id: "a"},
      b = {id: "b"},
      c = {id: "c"},
      nodes = [a, b, c],
      links = [];

  // const canvas = svg.append("g").attr("transform", "translate(" + (margin.left + innerWidth/2) + "," + (margin.top + + innerHeight/2) + ")");

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const simulation = d3.forceSimulation();

  simulation.force("charge", d3.forceManyBody().strength(-100))
                // .force("link", d3.forceLink(links).distance(200))
                .force("x", d3.forceX())
                .force("y", d3.forceY())
                .alphaTarget(1);



  let g = svg.append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  // let link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
  let node = g.append("g")
              .attr("stroke", "#fff")
              .attr("stroke-width", 1.5)
              .selectAll(".node");


  restart();

  function restart() {

    // Apply the general update pattern to the nodes.
    node = node.data(nodes)
      // , function(d) { return d.id;});

    node.exit().remove();

    node = node.enter()
                .append("circle")
                .attr("fill", function(d) { return color(d.id); })
                .attr("r", 8)
                .merge(node);
  
    // Apply the general update pattern to the links.
    // link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
    // link.exit().remove();
    // link = link.enter().append("line").merge(link);
  
    // Update and restart the simulation.
    simulation.nodes(nodes);
    // simulation.force("link").links(links);
    simulation.alpha(1).restart();
  }

  simulation.on("tick", function ticked(){
                  node.attr("cx", function(d) { return d.x; })
                      .attr("cy", function(d) { return d.y; })
                });

  rm.on('click',()=>{
    nodes.pop();
    restart();
  })

  add.on('click',()=>{
    nodes.push({
      id: Math.random()
    });
    restart();
  })

  vm.$refs.notes.innerHTML = `
  <p>对simulation进行修改，需要创建一个restart()的函数，其中需要传入.data(data)，删除多余元素.exit().remove()，然后添加新元素.append()，最后进行合并.merge(dots)。然后把新数组传入simulation.nodes(data)，进行重新模拟。</p>
  <p>直接调用 simulation.nodes() 会返回在模拟器中的node的数组。</p>`

}