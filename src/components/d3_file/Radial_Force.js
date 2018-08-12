// https://bl.ocks.org/mbostock/cd98bf52e9067e26945edd95e8cf6ef9

module.exports = function (vm) {
  // console.log('hello world')
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  const svg = d3.select(vm.$refs.chartArea)
                .append('svg')
                .attr('height', height)
                .attr('width', width)

  const canvas = svg.append("g").attr("transform", "translate(" + (margin.left + innerWidth/2) + "," + (margin.top + + innerHeight/2) + ")")

  // let dots = [].concat(
  //   d3.range(80).map(function() { return {type: "a"}; }),
  //   d3.range(160).map(function() { return {type: "b"}; })
  // );

  let dots = d3.range(80).map(function() { return {type: "a"}; }).concat(
        d3.range(160).map(function() { return {type: "b"}; })
      );

  console.log(dots)

  let simulation = d3.forceSimulation()
                      // .stop()
                      .force('radial', d3.forceRadial(function(d) { return d.type === "a" ? 100 : 200; }))
                      .force('collide', d3.forceCollide().radius(7))
                      .force('charge', d3.forceManyBody().strength(-5))
                      // .force('x', d3.forceX(function(d) { return d.type === "a" ? innerWidth/2 : innerWidth/3; }))
                      // .force('y', d3.forceY(function(d) { return d.type === "a" ? innerHeight/2 : innerHeight/3; }))

  simulation.nodes(dots);
  // 这里传入的是数组数据
  // 这里直接改变了原有的dots数组，向其中添加了 ‘vx’, ‘vy’, ‘x’, ‘y’，这四个 d3.forceSimulation 计算出来的属性

  let nodes = canvas.append('g')
                    .selectAll('.circle')
                    .data(dots)
                    .enter()
                    .append('circle')
                    .attr('class', 'circle')
                    .attr('r', 6)
                    .attr('fill', function(d){
                      return d.type === "a"?'blue':'red'
                    })
                    .call(
                      d3.drag().on('start', function start(d){
                                  simulation.alphaTarget(.4).restart();
                                  d.fx = d.x;
                                  d.fy = d.y;
                                })
                                .on('drag', function drag(d){
                                  d.fx = d3.event.x;
                                  d.fy = d3.event.y;
                                })
                                .on('end', function end(d){
                                  simulation.alphaTarget(0)
                                  d.fx = null
                                  d.fy = null;
                                })
                    )


  simulation.on('tick',function tick(){
    nodes.attr('cx',function(d) { return d.x })
          .attr('cy',function(d) { return d.y })
  })

  // window.addEventListener('click', function(){
  //   console.log('click')
  //   simulation.tick();
  // })



  vm.$refs.notes.innerHTML = `
  <p>d3.forceSimulation() 的使用方法总结。</p>
  <p>d3.forceSimulation()可以看作为一个力学处理器。</p>
  <p>d3.forceSimulation().nodes(dataArray)：将一组数据传入力学处理器，根据力学配置Array中的给每一个对象添加‘vx’, ‘vy’, ‘x’, ‘y’四个属性 (后面还可能有fx、fy属性，表示‘fixX’‘fixY’)（这里直接改变了原有的Array数组）。也可以直接传入 d3.forceSimulation(dataArray)</p>
  <p>d3.forceSimulation().force('forceName', d3.forceType())：通过.force()函数对力学处理器进行配置。首先给每种力取一个名字（相当于设置变量，名字原则上可以随便取，取名字是为了方便以后对某一个力进行修改），然后配置相应的力，d3提供了多种力的形式以及对应的设置（d3.forceX()、d3.forceY()、d3.forceCollide()等等）。</p>
  <p>Simulation会有一个‘tick’事件，默认触发，每触发一次相当于对力学进行了一次计算，在事件的回调函数中设置DOM元素的属性（attr()，因为原有的Array数组已经被改变，每个对象都多了‘vx’, ‘vy’, ‘x’, ‘y’四个属性），从而达到力学动画效果。</p>`
}