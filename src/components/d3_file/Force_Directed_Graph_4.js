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

  const cursor_radius = 50;

  const svg = d3.select(vm.$refs.chartArea)
                .append('svg')
                .attr('height', height)
                .attr('width', width)

  const dots_array = [{}]
  let links_array = []

  const simulation = d3.forceSimulation()

  simulation.force('charge', d3.forceManyBody().strength(-60))
            .force('x', d3.forceX().x(width/2))
            .force('y', d3.forceY().y(height/2))
            .force('link', d3.forceLink())

  let links = svg.append('g')
                      .attr('class', 'link_group')
                      .selectAll('.link')

  let dots = svg.append('g')
                      .attr('class', 'dots_group')
                      .selectAll('.dot')

  const cursor = svg.append("circle")
                        .attr("r", cursor_radius)
                        .attr("transform", "translate(-100,-100)")
                        .attr("class", "cursor")
                        .attr("fill", 'none')
                        .attr("stroke", "black")
                        .attr("pointer-events", 'none')


  restart()



  simulation.on('tick', ()=>{
                dots.attr('cx', d =>{ return d.x })
                  .attr('cy', d =>{ return d.y });

                links.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
                })

svg.on("mousemove", function mousemove(){
      cursor.attr('transform', 'translate('+ d3.mouse(this) + ')')
    })
    .on('mousedown', function mousedown(){
      let point = d3.mouse(this);
      let node = {x: point[0], y: point[1]};

      dots_array.forEach(function(target) {
        // console.log(target)
        // console.log(node)
        let x = target.x - node.x,
            y = target.y - node.y;
        if (Math.sqrt(x * x + y * y) < cursor_radius) {
          links_array.push({source: node, target: target});
        }
      });

      let n = dots_array.push(node);

      // console.log(links_array)

      restart();
    })

  function restart() {
    dots = dots.data(dots_array);
    dots.exit().remove();
    dots = dots.enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('r', 5)
                .attr('fill', 'blue')
                .merge(dots)
                .on('mousedown', function(d, i){
                  dots_array.splice(i, 1);

                  links_array = links_array.filter(function(l){
                    return l.source !== d && l.target !== d;
                  })

                  // 事件不再传播，意味着当点击dot的时候，在svg上的点击事件不灾触发
                  d3.event.stopPropagation();

                  restart();
                });
                
    links = links.data(links_array);
    links.exit().remove();
    links = links.enter()
                .append("line")
                .attr('stroke', '#666')
                .attr('stroke-width', 1)
                .merge(links)


    simulation.nodes(dots_array);
    simulation.alphaTarget(.6)
    simulation.restart()
  }

  vm.$refs.notes.innerHTML = `
  <p>forceX([f]).strength(f).x(x) 中，f 和 x 的区别是：f代表力的大小，x代表力学的目标位置。</p>
  <p>直接调用 simulation.nodes() 会返回在模拟器中的node的数组。</p>`
}

// svg.on("mousemove", function mousemove(){
//   cursor.attr('transform', 'translate('+ d3.mouse(this) + ')')
// })
// .on('mousedown', function mousedown(){
//   let point = d3.mouse(this);
//   let node = {x: point[0], y: point[1]};
//   let n = dots_array.push(node);
// })

// simulation.on('tick', ()=>{
// // console.log(dots)
// dots.attr('cx', d =>{return d.x })
//   .attr('cy', d =>{ return d.y })
// })