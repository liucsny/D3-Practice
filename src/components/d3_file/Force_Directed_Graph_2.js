// https://bl.ocks.org/mbostock/4062045

module.exports = function (vm) {
  // console.log('hello world')
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 800
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
    let simulation = d3.forceSimulation();

    let linkForce = d3.forceLink()
                      .id(function(d) {
                        return d.id;
                      })
                      .strength(function(link){
                        console.log(link);
                        return link.value * 0.1
                      });

    simulation
              .force("charge", d3.forceManyBody().strength(-100))
              .force('collid', d3.forceCollide().radius(5))
              .force("center", d3.forceCenter(0, 0))
              .force("radial", d3.forceRadial().radius(function(d){
                                                        return d.group > 5?80:300;
                                                        // return (d.group+1)*30
                                                      })
                                                      .strength(2)
              )
              .force('link', linkForce);

    let link = canvas.append("g")
              .selectAll(".link")
              .data(data.links)
              .enter()
              .append("line")
              .attr('class', 'link')
              .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
              .attr('stroke','#999')
              .attr('stroke-opacity', 0.2);

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

      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
  
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

    simulation.nodes(data.nodes)
    // 把nodes数据传进去
    linkForce.links(data.links)
    // 相当于把之前配置的“link”力单独拉了出来，把links数据传进去

    // simulation.force('charge').strength(-40)

    vm.$refs.notes.innerHTML = `
    <p>该段代码</p>
    <pre class='blue bg-near-white'>

    let simulation = d3.forceSimulation(data.nodes)

    simulation.force('link', d3.forceLink()
                                .id(function(d) {
                                  return d.id;
                                })
                                .iterations(1)
                                .links(data.links)
              )
              .force("charge", d3.forceManyBody())
              .force("center", d3.forceCenter(0, 0));
    </pre>
    <p>和</p>
    <pre class='blue bg-near-white'>

    let simulation = d3.forceSimulation()

    simulation.force('link', d3.forceLink()
                                .id(function(d) {
                                  return d.id;
                                })
                                .iterations(1)
              )
              .force("charge", d3.forceManyBody())
              .force("center", d3.forceCenter(0, 0));

    simulation.nodes(data.nodes)
    simulation.force("link").links(data.links)
    </pre>
    <p>和</p>
    <pre class='blue bg-near-white'>

    let simulation = d3.forceSimulation();

    let linkForce = d3.forceLink()
                      .id(function(d) {
                        return d.id;
                      })
                      .iterations(1)

    linkForce.links(data.links)

    simulation.force('link', linkForce
              )
              .force("charge", d3.forceManyBody())
              .force("center", d3.forceCenter(0, 0));
    </pre>
    <p>效果是一样的</p>
    <p>Simulation.force('forceName') 似乎是把该力学模拟器中对应名称的力单独拉出来，然后可以进行修改设置。</p>
   `
  })

}