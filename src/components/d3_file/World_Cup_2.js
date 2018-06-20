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

  let x = d3.scalePoint().rangeRound([0,innerWidth])

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
    // console.log(rawData)
    // console.log(rawData.map(function(d) { return d['Year'] }))

    let data = flattenData(rawData)
    // console.log(data)

    let nestData = d3.nest().key(function(d) {
        return d.country
      }).entries(data)
    // console.log(nestData)

    let sampleData = nestData[0].values
    // console.log(sampleData)

    g.append('g')
      .selectAll('circle')
      .data(sampleData)
      .enter()
      .append('circle')
      .attr('cx', function(d){ return x(d['year']) })
      .attr('cy', function(d){ return innerHeight/2 })
      .attr('r', 8)
      .attr('fill', 'rgba(0,0,0,.1)')

  })

  function flattenData (data) {
    let newData = []
    data.forEach((d)=>{
      newData.push({
        year : d['Year'],
        country: d['Home Team Name'],
        Goals : d['Home Team Goals'],
        Half_Goals : d['Half-time Home Goals'],
        Opponent : d['Away Team Name'],
        Opponent_Goals : d['Away Team Goals'],
        Stage : d['Stage']
      })

      newData.push({
        year : d['Year'],
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
}