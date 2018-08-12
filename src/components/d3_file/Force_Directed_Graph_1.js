// https://bl.ocks.org/mbostock/4062045

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

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  // d3.schemeCategory20 似乎不再支持了

  d3.json('/static/miserables.json', function(d) {
    return d;
  }).then(function(data) {
    let simulation = d3.forceSimulation()

    simulation.nodes(data.nodes)
              .force('link', d3.forceLink().id(function(d) {
                // console.log(d)
                return d.id;
              }))
              .force("charge", d3.forceManyBody().strength(-1))
              // .force("center", d3.forceCenter(width / 2, height / 2));

    let dots = canvas.append('g')
                  .selectAll('.dot')
                  .data(data.nodes)
                  .enter()
                  .append('circle')
                  .attr('class', 'dot')
                  .attr('r', 5)
                  .attr('fill', function(d) {
                    // console.log(d.group);
                    // console.log(color(d.group))
                    return color(d.group)
                  })

      // simulation.force("link")
      //             .links(data.links);

    simulation.on('tick', function tick() {
      dots.attr('cx', function(d) { return d.x })
          .attr('cy', function(d) { return d.y })
    })
  

    dots.call(
      d3.drag().on('start',function start(d) {
                        //这里解释了为什么要判断一下 if (!d3.event.active)： https://stackoverflow.com/questions/42605261/d3-event-active-purpose-in-drag-dropping-circles

                        if (!d3.event.active){
                          simulation.alphaTarget(0.3)
                                    .restart();
                        }

                        // console.log(d)
                        // d.vx = 10;
                        d.fx = d.x;
                        d.fy = d.y;
                      })
                      .on('drag',function drag(d) {
                        // console.log(d3.event.)
                        d.fx = d3.event.x;
                        d.fy = d3.event.y;
                      })
                      .on('end',function end(d) {
                        // console.log(d)
                        simulation.alphaTarget(0)
                        d.fx = null;
                        d.fy = null;

                        // 这样可以让该点重新运动起来，如果不把fx,fy设置为null，该点会静止在被拖拽到的地方
                      })
    )

    window.addEventListener('click', function() {
      // d3.forceCenter(width / 2, height / 2).initialize(dots)
      // console.log('click')
    })

    // simulation.stop()

    // for (let i = 0; i < 6; i++) {
    //   simulation.tick();
    // }

    // simulation.alphaMin(.9)


    // setInterval(function(){
    //   console.log(d3.event)
    // },100)

    // console.log(simulation)

    vm.$refs.notes.innerHTML = `
    <p>d3.event表示正在发生的事件</p>
    <p>Simulation可以理解为是由 d3.forceSimulation()而创建的一个力学模拟器。</p>
    <p>Simulation会有一个alpha的属性，解释为 Simulation activity，也就是力学模拟器的活力，alpha值会随着时间推移不断下降，直到为0，此时力学模拟停止变为静态。</p>
    <p>调用Simulation.alpha()可以返回当前力学模拟器的alpha值；向Simulation.alpha(a)里传递参数a可以将力学模拟器的alpha值设置为a</p>
    <p>调用Simulation.alphaMin()返回可以使当前力学模拟器停止的最小alpha（我称为停机最小值），默认是0.001；向simulation.alphaMin(min)里传递参数 min 表示当模拟器运行到 alpha == min 的时候模拟自动停止；</p>
    <p>调用Simulation.alphaDecay()返回当前力学模拟器alpha的衰减率，默认是 1 - 0.001^(1/300)；向simulation.alphaDecay(decay)里传递参数decay可以手动设置衰减率。当衰减率设置为0的时候，图像会永远运动下去。</p>
    <p>调用Simulation.alphaTarget()返回当前力学模拟器alpha的衰减的目标值，默认是0；向simulation.alphaTarget(target)里传递参数target可以手动设置衰减目标值。当目标值大于停机最小值的时候，图像会永远运动下去（永远不会停机）。</p>
    <p>调用Simulation.tick()可以手动将力学模拟器向前运算一步。一般用于创建布局。由于一般的力导布局初始状态都是挤在一起的，这时如果想要把运行一段时间以后的力导图作为初始状态（这时图像不会挤在一起），就可以先用循环语句多调用.tick()几次。</p>
    </br>
    <p>d3.schemeCategory20已经在v5版本里被弃用了。详见：https://github.com/d3/d3/blob/master/CHANGES.md</p>`
  })

}