// https://bl.ocks.org/mbostock/1b64ec067fcfc51e7471d944f51f1611

module.exports = function (vm) {
  const margin = {top: 20, right: 20, bottom: 30, left: 60};
  const width = vm.$refs.chartArea.offsetWidth * 0.95;
  const height = 800;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const canvas = d3.select(vm.$refs.chartArea)
                .append('canvas')
                .attr('height', height)
                .attr('width', width)

  // console.log(canvas.node())

  const context = canvas.node().getContext("2d");

  canvas.call(d3.drag().subject(function subject(){
                        let target = simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
                        // console.log(target)
                        return target;
                      })
                      .on('start', function(){
                        simulation.alphaTarget(0.3).restart();
                        
                        d3.event.subject.fx = d3.event.subject.x;
                        d3.event.subject.fy = d3.event.subject.y;
                      })
                      .on('drag', function(){
                        d3.event.subject.fx = d3.event.x;
                        d3.event.subject.fy = d3.event.y;
                      })
                      .on('end', function(){
                        simulation.alphaTarget(0);

                        d3.event.subject.fx = null;
                        d3.event.subject.fy = null;
                      }))

  let n = 20;

  let nodes = d3.range(n * n).map(function(i) {
    return {
      index: i
    };
  });

  let links = [];

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (y > 0) links.push({source: (y - 1) * n + x, target: y * n + x});
      if (x > 0) links.push({source: y * n + (x - 1), target: y * n + x});
    }
  }

  const simulation = d3.forceSimulation()
                        .force('charge', d3.forceManyBody().strength(-10))
                        .force('link', d3.forceLink().strength(1).distance(10).iterations(5))

  simulation.nodes(nodes);
  simulation.force('link').links(links);

  // 这里在tick事件更新canvas，之前用的是d3.timer(()=>{})
  simulation.on('tick', ()=>{
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    links.forEach((l)=>{
      context.moveTo(l.source.x, l.source.y);
      context.lineTo(l.target.x, l.target.y);
    });
    context.strokeStyle = "#aaa";
    context.stroke();
    
    context.beginPath();
        // draw nodes
    nodes.forEach((d)=>{
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    });
    context.fill();
    context.strokeStyle = "#fff";
    context.stroke();
  
    context.restore();
  })

  vm.$refs.notes.innerHTML = `
  <p>由于d3的设计逻辑是：“数据” => “图表的各项参数” => “图表”。所以用canvas直接从“图表的各项参数”生成图表是自然而然的事情。</p>
  <p>selection.node() 返回原生DOM元素。</p>
  <p>d3.forceLink().iterations(i) iterations代表了链接的刚性</p>
  <p></p>
  <pre>
  d3.drag()
    .container(canvas)
    .subject(dragsubject)
  </pre>
  <p>d3.drag().container(dom) 是用来设定相对参考系的，默认是 function container() { return this.parentNode }（这里没写似乎也没有问题）</p>
  <p>d3.drag().subject(function(d){ ... }) 是canvas上点击事件可以使用的关键，作用是指定被拖拽的“主体”。</p>
  <p>例子中是用simulation.find( ... )返回了一个simulation中虚拟的点，然后这个点就会赋给d3.event.subject。默认为：</p>
  <pre>
  function subject(d) {
    return d == null ? {x: d3.event.x, y: d3.event.y} : d;
  }
  </pre>
  <p>在svg的情况下，回调参数d就是被选择元素所绑定的数据。在canvas情况下则需要写函数手动绑定。</p>`
}