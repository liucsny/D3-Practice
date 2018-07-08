module.exports = function (vm) {
  let margin = {top: 100, right: 160, bottom: 30, left: 100}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 700
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let SelectGroup = d3.select(vm.$refs.chartArea).append('div').attr('class', 'tl flex')
  let select = SelectGroup.append('p').attr('class', 'mr3').text('Nation').append('select').attr('id', 'nation-menu').attr('class','mh2 w4')

  const svg = d3.select(vm.$refs.chartArea)
              .append('svg')
              .attr('height', height)
              .attr('width', width)
              .style('background-color','#243157')

  let innerRadius = 120
  let outterRadius = 260

  const g = svg.append("g").attr("transform", "translate(" + width/2 + "," + height*0.45 + ")")
  // const g = svg.append("g").attr("transform", "translate(" + innerWidth/2 + "," + innerHeight/2 + ")")

  let parseTime = {
    Datetime: d3.timeParse("%d %b %Y - %H:%M"),
    Year: d3.timeParse("%Y")
  }

  let xRadial = d3.scaleBand()
  .range([0.16*Math.PI, 1.9*Math.PI])
  .align(1)

  let x = d3.scaleBand().rangeRound([0,innerWidth/2])

  d3.csv('/static/World_Cup.csv',function(d){
    let numAttr = ['Half-time Away Goals', 'Half-time Home Goals', 'Home Team Goals', 'Away Team Goals', 'Attendance']
    numAttr.forEach((attr)=>{
      d[attr] = +d[attr]
    })

    d['Datetime'] = parseTime.Datetime(d['Datetime'])

    return d
  }).then(function(rawData){
    x.domain(rawData.map(function(d) { return d['Year'] }))
    xRadial.domain(rawData.map(function(d) { return d['Year'] }))


    let data = flattenData(rawData)
    // console.log(data)

    let nestData = d3.nest().key(function(d) {
                              return d.country
                            }).entries(data)

    let nations = nestData.map(function(d){
      return d.key
    })

    let nestDataByYear = d3.nest().key(function(d) {
                                    return d.country
                                  }).key(function(d) {
                                    return d.year
                                  })
                                  .rollup(function(d){
                                    let isWinner = false
                                    d.forEach(function(d){
                                      if (d.country == d.Winner){
                                        isWinner = true
                                      }
                                    })
                                    return isWinner
                                  }).entries(data)

    let nestDataByYearObject = {}

    nestDataByYear.forEach(function(d){
      nestDataByYearObject[d.key] = d.values
    })

    // nations = nations.sort(function(a,b){
    //   return ('' + a).localeCompare(b);
    // })

    nations.forEach(function(d){
      let select = document.getElementById('nation-menu');
      let ele = document.createElement("option");
      ele.textContent = d;
      ele.value = d;
      select.appendChild(ele);
    })

    // 画时间骨架================================================
    let labels = g.append("g")
                  .selectAll("g")
                  .data(function(d){
                    let histogram = d3.histogram()
                                      .value(function(d) { return d['year'] })
                                      .thresholds(x.domain())

                    let data = histogram(x.domain())
                    data.shift()

                    return data
                  })
                  .enter().append("g")
                    .attr("transform", function(d) {
                      return "rotate(" + ( xRadial(d.x0) * 180 / Math.PI ) + ")translate(0," + (-innerRadius) + ")"
                    })

                          labels.append("line")
          .attr("y2", '20')
          .attr("y1", '17')
          .attr("stroke", "rgba(255,255,255)")
  
    labels.append("line")
          .attr("y2", '10')
          .attr("y1", '-100')
          .attr("stroke", "rgba(255,255,255,.2)")
  
  
    labels.append("text")
          .attr("transform", function(d) {
            return (xRadial(d.x0) + xRadial.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) > Math.PI ? `rotate(180)translate(0,-${innerRadius/4})` : `rotate(0)translate(0,${innerRadius/4+8})`
          })
          .text(function(d) {
              // var xlabel = (((d.km % 5) == 0) | (d.km == '1')) ? d.km : '';
              // console.log(d)\
              let time
              if(d.x0 ==='1930'||d.x0 ==='2002'){
                return d.x0
              } else {
                return d.x0.slice(2,4)
              }
          })
          .attr('fill', 'rgba(255,255,255,.7)')
          .attr("text-anchor", "middle")
          .attr('font-size','10px')
          .attr("font-weight", "100")
          
    labels.append("line")
          .attr("y2", '20')
          .attr("y1", '17')
          .attr("stroke", "rgba(255,255,255)")
  
    labels.append("line")
          .attr("y2", '10')
          .attr("y1", '-100')
          .attr("stroke", "rgba(255,255,255,.2)")
  
  
      labels.append("text")
            .attr("transform", function(d) {
              return (xRadial(d.x0) + xRadial.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) > Math.PI ? `rotate(180)translate(0,-${innerRadius/4})` : `rotate(0)translate(0,${innerRadius/4+8})`
            })
            .text(function(d) {
                // var xlabel = (((d.km % 5) == 0) | (d.km == '1')) ? d.km : '';
                // console.log(d)\
                let time
                if(d.x0 ==='1930'||d.x0 ==='2002'){
                  return d.x0
                } else {
                  return d.x0.slice(2,4)
                }
            })
            .attr('fill', 'rgba(255,255,255,.7)')
            .attr("text-anchor", "middle")
            .attr('font-size','10px')
            .attr("font-weight", "100")

    // ========================================================================


    updatePattern(nations[0], nestData);
    updateStars(nations[0], nestDataByYearObject);

    d3.select("#nation-menu").on("change", function() {
      let nation = d3.select("#nation-menu")
        .property("value");
        
      updatePattern(nation, nestData);
      updateStars(nation, nestDataByYearObject);
    });

  })

  function flattenData (data) {
    let newData = []
    data.forEach((d)=>{


      newData.push({
        year : d['Year'],
        Datetime : d['Datetime'],
        country: d['Home Team Name'],
        Goals : d['Home Team Goals'],
        Half_Goals : d['Half-time Home Goals'],
        Opponent : d['Away Team Name'],
        Opponent_Goals : d['Away Team Goals'],
        Stage : d['Stage'],
        Winner : d['Winner']
      })

      newData.push({
        year : d['Year'],
        Datetime : d['Datetime'],
        country: d['Away Team Name'],
        Goals : d['Away Team Goals'],
        Half_Goals : d['Half-time Away Goals'],
        Opponent : d['Home Team Name'],
        Opponent_Goals : d['Home Team Goals'],
        Stage : d['Stage'],
        Winner : d['Winner']
      })
    })

    return newData
  }

  function updatePattern(nation, nestData) {
    let data = nestData.find(function(d){
      return d.key == nation;
    });

    let histogram = d3.histogram()
                      .value(function(d) { return d['year'] })
                      .thresholds(x.domain())

    let bins = histogram(data.values)

    // console.log(data)

    let name = g.selectAll('.name')
              .data([data])

    name.enter()
        .append('text')
        .attr('class', 'name')
        .merge(name)
        .text(function(d){
          return d.key
        })
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr('y', 0)
        .attr('fill', 'white')
        .attr('font-size','12px')


    let redirection = g.selectAll('.gBin')
                        .data(bins);

    redirection.exit().attr('opacity', 1).transition(4000).attr('opacity', 0).remove();
                    
    let redirection_update = redirection.enter()
                                        .append('g')
                                        .attr("class", "gBin")
                                        .merge(redirection)
                                        .attr("transform", function(d) {
                                          return "rotate(" + ( xRadial(d.x0) * 180 / Math.PI ) + ")translate(0," + (-innerRadius) + ")"
                                        })
                                        .attr("transform-origin", "0 0")

    let pattern = redirection_update.selectAll("g")
                              .data(function(d){
                                return d.map(function(p,i){
                                            p.index = i
                                            return p
                                          })
                                          .sort(function(d){ return d['Datetime'] })
                              })

    pattern.exit().attr('opacity', 1).transition(4000).attr('opacity', 0).remove();

    let pattern_update = pattern.enter()
                              .append('g')
                              .merge(pattern)
                              .attr('transform',function(d){
                                // console.log(d)
                                return `translate(0, ${-d.index*16} )`
                              })

    let circles = pattern_update.selectAll('circle')
                              .data(function(d){
                                // console.log(d)
                                let array = []
                                for (let i = 0; i <= d['Goals']; i++) {
                                  array.push({
                                    index : i,
                                    country : d['country']
                                  })
                                }
                                // console.log(array)
                                return array
                              })

    let circles_t = circles.transition().duration(4000);

    circles.exit().transition(circles_t).attr('r', 0).remove();

    let circles_update = circles.enter()
                              .append('circle')
                              .merge(circles)
                              .transition(circles_t)
                              .attr('cx', 0)
                              .attr('cy', 0)
                              .attr('r', function(d){
                                if(d.index === 0){
                                  return 2
                                }else{
                                  return ( d.index ) * 3
                                }
                              })
                              .attr('fill',function(d){
                                if(d.index === 0){
                                  return 'rgba(255,255,255,.6)'
                                }else{
                                  return 'none'
                                }
                              })
                              .attr('stroke', function(d){
                                if(d.index === 0){
                                  return 'none'
                                }else{
                                  return 'white'
                                }
                              })
                              .attr('stroke-width','.8')

  }

  function updateStars(nation, nestDataByYearObject) {

    // console.log(nestDataByYearObject[nation])

    g.selectAll(".star").remove();

    let stars = g.selectAll(".star")
                  .data(nestDataByYearObject[nation])
                  .enter()
                  .append('g')
                  .attr('class', 'star')
                  .attr("transform", function(d) {
                    return "rotate(" + ( xRadial(d.key) * 180 / Math.PI ) + ")translate(0," + (-outterRadius) + ")"
                  })
                  .append('path')
                  .attr('fill',function(d){
                    if(d.value){
                      return 'rgba(255,255,0,1)'
                    }else{
                      return 'rgba(255,255,255,0)'
                    }
                  })
                  .attr('d', d3.symbol()
                              .size(80)
                              .type(d3.symbols[4])
                  )
  }


  vm.$refs.notes.innerHTML = `
  <p>可以使用<pre>
  .selectAll('selector')
  .data(function(d){
    return array(d)
  }).enter()
  .append()

  .selectAll('selector')
  .data(function(d){
    return array(d)
  }).enter()
  .append()

  .selectAll('selector')
  .data(function(d){
    return array(d)
  }).enter()
  .append()

  ...
  </pre></p>
  <p>这样循环的方式去触及每个数据的枝叶部分</p>
  <p>d3.symbol()  d3.symbols</p>
  </br>
  <p>数据切换：</p>
  <p><pre>
let redirection = g.selectAll('.gBin')
  <span class="orange">.data(bins)</span>;

<span class="orange">redirection.exit().remove()</span>;

let redirection_update = redirection.enter()
                  .append('g')
                  .attr("class", "gBin")
                  <span class="orange">.merge(redirection)</span>
                  .attr("transform", function(d) {
                    return "rotate(" + ( xRadial(d.x0) * 180 / Math.PI ) + ")translate(0," + (-innerRadius) + ")"
                  })
                  .attr("transform-origin", "0 0")
                  </pre><p>
  `
}