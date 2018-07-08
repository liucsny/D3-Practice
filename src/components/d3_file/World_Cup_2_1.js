module.exports = function (vm) {
    let margin = {top: 400, right: 160, bottom: 30, left: 400}
    let width = vm.$refs.chartArea.offsetWidth * 0.95
    let height = 25000
    let innerWidth = width - margin.left - margin.right
    let innerHeight = height - margin.top - margin.bottom
  
    const svg = d3.select(vm.$refs.chartArea)
                .append('svg')
                .attr('height', height)
                .attr('width', width)
                .style('background-color','#243157')
  
    let innerRadius = 120
    let outterRadius = 260
  
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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
  
      // console.log(nestDataByYearObject)
      
      let graphGroups = g.selectAll('.graph')
                        .data(nestData)
                        .enter()
                        .append('g')
                        .attr('class','graph')
                        .attr('transform',function(d ,i){
                          let columnGap = 620
                          let rowGap = 650
                          let x = i%2 * columnGap
                          let y = Math.floor(i/2) * rowGap
                          // console.log(i)
                          // console.log(x,'  ',y)
                          return `translate(${x},${y})`
                        })
                      
      graphGroups.append('text')
                .text(function(d) {
                  // console.log(d)
                  return d['key']
                })
                .attr("font-family", "sans-serif")
                .attr("text-anchor", "middle")
                .attr('y', 0)
                .attr('fill', 'white')
                .attr('font-size','12px')
  
  
      // let stars = graphGroups.append("g")
      //                       .selectAll("g")
      //                       .data(function(d){
      //                         console.log(d.key)
      //                         return d
      //                       }).enter()
      //                       .append("g")
  
  
      let labels = graphGroups.append("g")
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
                                  // console.log(d)
                                  // return "rotate(" + ((x(d.km) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"
                                  return "rotate(" + ( xRadial(d.x0) * 180 / Math.PI ) + ")translate(0," + (-innerRadius) + ")"
                                })
  
      // let star = d3.symbol().type('symbolStar')
  
      // console.log(d3.symbols)
  
      let stars = graphGroups.append("g")
                              .selectAll("g")
                              .data(function(d){
                                return nestDataByYearObject[d.key]
                              }).enter()
                              .append('g')
                              .attr("transform", function(d) {
                                // console.log(d.key)
                                return "rotate(" + ( xRadial(d.key) * 180 / Math.PI ) + ")translate(0," + (-outterRadius) + ")"
                              })
                              .append('path')
                              .attr('fill',function(d){
                                // console.log(d)
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
  
  
      let graphs = graphGroups.append('g')
                        .attr('class',function(d){
                          // console.log(d)
                          return d['key']
                        })
                      .selectAll('.gBin')
                      .data(function(d){
                        let histogram = d3.histogram()
                                          .value(function(d) { return d['year'] })
                                          .thresholds(x.domain())
                        return histogram(d.values)
                      })
                      .enter()
                      .append("g")
                      .attr("class", "gBin")
                      .attr("transform", function(d) {
                        return "rotate(" + ( xRadial(d.x0) * 180 / Math.PI ) + ")translate(0," + (-innerRadius) + ")"
                      })
                      .attr("transform-origin", "0 0")
  
  
      graphs.selectAll("g")
            .data(function(d){
              return d.map(function(p,i){
                          p.index = i
                          return p
                        })
                        .sort(function(d){ return d['Datetime'] })
            })
            .enter()
            .append('g')
            .attr('transform',function(d){
              // console.log(d)
              return `translate(0, ${-d.index*16} )`
            })
            .selectAll('circle')
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
    `
  }