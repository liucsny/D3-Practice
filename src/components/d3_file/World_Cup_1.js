module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  const svg = d3.select(vm.$refs.chartArea)
            .append('svg')
            .attr('height', height)
            .attr('width', width)
  
  const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  
  let parseTime = {
    Datetime: d3.timeParse("%d %b %Y - %H:%M"),
    Year: d3.timeParse("%Y")
  }

  let xScale = d3.scaleTime()

  let xAxis = d3.axisBottom()
//   13 Jul 1930 - 15:00
  d3.csv('/static/World_Cup.csv',function(d){
    let numAttr = ['Half-time Away Goals', 'Half-time Home Goals', 'Home Team Goals', 'Away Team Goals', 'Attendance']
    numAttr.forEach((attr)=>{
      d[attr] = +d[attr]
    })

    d['Datetime'] = parseTime.Datetime(d['Datetime'])
    d['Year'] = parseTime.Year(d['Year'])

    return d
  }).then(function(data){
    // console.log(data)
    let xExtent = d3.extent(data, function(d){ return d['Datetime'] })
    xScale.domain(xExtent).range([0,innerWidth])

    xAxis.scale(xScale)

    let gXAxis = g.append('g')
                .attr('class', 'xAxis')
                .call(xAxis)
                .attr('transform', `translate(0,${innerHeight/2+40})`)

    let force = d3.forceSimulation()
                .force("x", d3.forceX(function(d) { 
                  // console.log(d)
                  return xScale(d['Datetime'])
                }))
                .force("y-1", d3.forceY(function(d) { 
                  return innerHeight/2 + 100
                }).strength(0.05))
                .force("y-2", d3.forceY(function(d) { 
                  return innerHeight/2 - 100
                }).strength(0.05))
                .force("collide", d3.forceCollide().radius(function(d){ return d['Home Team Goals']+1 }))
                .alpha(.8)
                // .force("charge", d3.forceManyBody())

    // for (var i = 0; i < 120; ++i) force.tick()
    // force.restart()

    let circleGroup = g.selectAll(".teams")
                  .data(['Home Team Goals','Away Team Goals'])
                  .enter().append("g")
                  .attr('class', 'teams')
                  .attr('id', function(d){ return d })
                  .each(function(attr){
                    let group = d3.select(this)
                    // console.log(attr)

                    group.selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr('r', function(d){
                          return d[attr]
                        })
                        .attr('fill', function(d){
                          if(attr == 'Home Team Goals'){
                            return '#EC4A46'
                          } else {
                            return '#257DD4'
                          }
                        })

                  //   // console.log(group)
                  })

                  // .attr("r", function(d){
                  //   return d['Home Team Goals']
                  // })
                  // .style("fill", 'orange')

    // force.nodes(data).on("tick", function(){
    //   circleGroup.attr("cx", function(d) {
    //     // console.log(d)
    //     return d.x
    //   })
    //   .attr("cy", function(d) { return d.y; });
    // })


    force.nodes(data).on("tick", function(){
      circleGroup.each(function(d){
        // console.log(d)
        let circles = d3.select(this)

        // console.log(circles.selectAll('circle'))
        circles.selectAll('circle').attr("cx", function(d) {
                return d.x
              })
              .attr("cy", function(d) {
                return d.y
              })
      })
    })

    // .start()
    // console.log(xExtent)


  })

  vm.$refs.notes.innerHTML = `
  <p>力导布局d3.forceSimulation()</p>
  <p>力导布局基本流程：</p>
  <p class='ml3'>1）创建力导布局 force = d3.forceSimulation()</p>
  <p class='ml3'>2）设置力导布局里的作用力 d3.forceSimulation().force()</p>
  <p class='ml3'>3）用 .node() 传入数据</p>
  <p class='ml3'>4）在 .on("tick", function(d){}) 函数里去更新视图中的元素。</p>
  <p>力导布局的一些坑：</p>
  <p class='ml3'>0）simulation() 的本质是对传入的data进行修改赋值，也就是说 .node(data) 之后，data本身就有了x、y属性，与在哪更新'cx'、'cy'无关。如果在on('tick',function(){})函数里更新图形就是动态的，其他地方就是静态的。此时要使用.tick()函数，.tick()相当于“下一帧动画”的概念。</p>
  <p class='ml3'>1）alpha = <span class='orange'>'Simulation activity'</span>，alphaTarget 和 alphaDecay</p>
  <p class='ml4'>详见：https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03</p>
  <p class='ml3'>2）.alpha([alpha])设定动画运动的时间，超过时间后运动就会停止。alpha范围是[0,1]。Increments the current alpha by (alphaTarget - alpha) × alphaDecay</p>
  `
  // https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03
}