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

  // const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  const g = svg.append("g").attr("transform", "translate(" + innerWidth/2 + "," + innerHeight/2 + ")")

  let parseTime = {
    Datetime: d3.timeParse("%d %b %Y - %H:%M"),
    Year: d3.timeParse("%Y")
  }

  let xRadial = d3.scaleBand()
  .range([0.1*Math.PI, 1.9*Math.PI])
  .align(1)

  let x = d3.scalePoint().rangeRound([0,innerWidth/2])

  d3.csv('/static/World_Cup.csv',function(d){
    let numAttr = ['Half-time Away Goals', 'Half-time Home Goals', 'Home Team Goals', 'Away Team Goals', 'Attendance']
    numAttr.forEach((attr)=>{
      d[attr] = +d[attr]
    })

    d['Datetime'] = parseTime.Datetime(d['Datetime'])
    // d['Year'] = parseTime.Year(d['Year'])

    return d
  }).then(function(rawData){
    // console.log(rawData)
    x.domain(rawData.map(function(d) { return d['Year'] }))
    xRadial.domain(rawData.map(function(d) { return d['Year'] }))
    // console.log(rawData)
    // console.log(rawData.map(function(d) { return d['Year'] }))

    let data = flattenData(rawData)
    // console.log(data)

    let nestData = d3.nest().key(function(d) {
        return d.country
      }).entries(data)
    // console.log(nestData)

    let sampleData = nestData[5].values
    // console.log(sampleData)

    const histogram = d3.histogram()
                        .value(function(d) { return d['year'] })
                        .thresholds(x.domain())
            
    // console.log(x.domain())
    const bins = histogram(sampleData)
    // console.log(bins)

    let binContainer = g.append('g')
                        .selectAll('circle')
                        .data(bins)

    let binContainerEnter = binContainer.enter()
                                        .append("g")
                                        .attr("class", "gBin")
                                        // .attr("transform", d => `translate(${x(d.x0)}, ${innerHeight/2})`)
                                        // .append("g")
                                        .attr("transform", function(d) { return "rotate(" + ( xRadial(d.x0) * 180 / Math.PI ) + ")translate(" + 0 + ",0)"; })
                                        .attr("transform-origin", "0% 15%")                                        
                                        // .attr("transform", function(d) { return "rotate(" + (xRadial(d.x0) * 180 / Math.PI - 90) + ")translate(" + 0 + ",0)"; });
                                        
    binContainerEnter.selectAll("circle")
    .data(function(d){
      return d.map(function(p,i){
        p.index = i
        return p
      }).sort(function(d){ return d['Datetime'] })
    })
    .enter()
    .append('g')
    .attr('transform',function(d){
      return `translate(0, ${-d.index*16} )`
    })
    .selectAll('circle')
    .data(function(d){
      // console.log(d)
      let array = []
      for (let i = 0; i <= d['Goals']; i++) {
        array.push({
          index : i
        })
      }
      // console.log(d)
      // console.log(array)
      return array
    })
    .enter()
    .append('circle')
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
          return 'rgba(0,0,0,.2)'
        }else{
          return 'none'
        }
      })
      .attr('stroke', function(d){
        if(d.index === 0){
          return 'none'
        }else{
          return 'black'
        }
      })
      // .attr('cy', function(d){
      //   console.log(d)
      //   return -d.index*16 
      // })
      // .attr('r', function(d){
      //   // console.log(d)
      //   return (d['Goals']+1)*2
      // })
      // .attr('fill', function(d){
      //   if(d['Stage'] === 'Final'){
      //     return 'rgba(255,0,0,.5)'
      //   } else if(d['Stage'].includes('Group')||d['Stage'] == 'First round'){
      //     return 'rgba(0,155,0,.5)'
      //   } else {
      //     return 'rgba(0,0,255,.5)'
      //   }
      //   // return 'rgba(0,0,0,.5)'
      // })

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
        Stage : d['Stage']
      })

      newData.push({
        year : d['Year'],
        Datetime : d['Datetime'],
        country: d['Away Team Name'],
        Goals : d['Away Team Goals'],
        Half_Goals : d['Half-time Away Goals'],
        Opponent : d['Home Team Name'],
        Opponent_Goals : d['Home Team Goals'],
        Stage : d['Stage']
      })
    })

    return newData
  }

  vm.$refs.notes.innerHTML = `
  <p>可以使用<pre>
  .selectAll('selector')
  .data(function(d){
    return array(d)
  }).enter()

  .selectAll('selector')
  .data(function(d){
    return array(d)
  }).enter()

  .selectAll('selector')
  .data(function(d){
    return array(d)
  }).enter()

  ...
  </pre></p>
  <p>这样循环的方式去触及每个数据的枝叶部分</p>
  `
}