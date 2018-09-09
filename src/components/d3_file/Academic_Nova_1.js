module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60};
  let width = vm.$refs.chartArea.offsetWidth * 0.95;
  let height = 600;
  let innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(vm.$refs.chartArea)
                .append('svg')
                .attr('height', height)
                .attr('width', width)

  const canvas = svg.append("g").attr('class', 'canvas').attr("transform", "translate(" + (margin.left + innerWidth/2) + "," + (margin.top + + innerHeight/2) + ")")

  let simulation = d3.forceSimulation();

  let radialScale = d3.scaleQuantile().domain([0,0.6,0.8,1]).range([100,150,190])
  let colorScale = d3.scaleQuantile().domain([0,0.6,0.8,1]).range(['#EC7361', '#F1C61C','#76BA5C'])

  // let Quantile = d3.scaleQuantile().domain([0,10,90,100]).range([0,1,10])
  // let Quantize = d3.scaleQuantize().domain([0,10,90,100]).range([0,1,10])

  // for (let i = 0; i < 100; i++) {
  //   console.log(i,' + ',Quantile(i),' + ',Quantize(i))
  // }

  simulation.force('charge', d3.forceManyBody().strength(-60))
            // .force('x', d3.forceX().x(width/2))
            // .force('y', d3.forceY().y(height/2))
            // .force('link', d3.forceLink())

  d3.tsv('/static/tensor_userid_val_1995_2015.tsv',(d)=>{
    d['Academic_Age'] = + d['Academic_Age']
    return d
  }).then(function(d){
    let data = d3.nest()
                  .key((d)=> {
                    return d['Author_ID']
                  })
                  .rollup((d)=>{
                    return {
                      Academic_Age_Now: d3.max(d,(e)=>e['Academic_Age']),
                      value: d
                    }
                  })
                  .entries(d)
                  .sort((a,b)=>{
                    return b.value['Academic_Age_Now'] - a.value['Academic_Age_Now']
                  })

    // console.log(data[0])

    let sample_data = data[1];
    let node = sample_data.value.value;

    let name = canvas.append("text")
                      .text(()=>{
                        console.log(sample_data)
                        return sample_data.key
                      })
                      .attr("text-anchor", "middle")
                      .attr('fill', '#696B73')
                      .attr('font-size','12px')
                      .attr('y', -10)

    let age = canvas.append("text")
                      .text(()=>{
                        console.log(sample_data)
                        return 'Academic Age: ' + sample_data.value.Academic_Age_Now
                      })
                      .attr("text-anchor", "middle")
                      .attr('fill', '#696B73')
                      .attr('font-size','12px')
                      .attr('y', 10)

    canvas.append("circle")
          .attr('r', 100)
          .attr('fill', 'transparent')
          .attr('stroke', '#F5F5F8')
                              
                              
    canvas.append("circle")
          .attr('r', 150)
          .attr('fill', 'transparent')
          .attr('stroke', '#F5F5F8')
                              
    canvas.append("circle")
          .attr('r', 190)
          .attr('fill', 'transparent')
          .attr('stroke', '#F5F5F8')


    let dots = canvas.selectAll('dot')
                              .data(node)
                              .enter()
                              .append('circle')
                              .attr('class', 'dot')
                              // .attr('r', d => {
                              //   return rScale(d['Ratio_Rank'])
                              // })
                              .attr('r', 6)
                              .attr('fill', d =>{
                                // console.log(d);
                                return colorScale(d['Ratio_Rank'])
                              })


    simulation.force("radial", d3.forceRadial().radius(function(d){
      // console.log(d)
      // return d.group > 5?60:200;
      return radialScale(d['Ratio_Rank'])
    })
    .strength(2))
    simulation.nodes(node);

    simulation.on('tick', function(){
      dots.attr('cx', function(d) { return d.x })
          .attr('cy', function(d) { return d.y })
    })

    // console.log(node)
  })

  vm.$refs.notes.innerHTML = `
    <h3>D3 Scale 总结</h3>`
}