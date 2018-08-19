// https://bl.ocks.org/tlfrd/c63f9e449ff9e98db97e711889054018/46054efb3b533b2d52689f3b7b560a22dd7157db

module.exports = function (vm) {
  const margin = {top: 20, right: 20, bottom: 30, left: 60}
  const width = vm.$refs.chartArea.offsetWidth * 0.95
  const height = 600
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const svg = d3.select(vm.$refs.chartArea)
                .append('svg')
                .attr('height', height)
                .attr('width', width)
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const config = {
                  radius: 4,
                  padding: 5,
                  top: 25,
                  left: 0,
                  iconWidth: 8,
                  largeIconWidth: 64,
                  legendOffset: 100,
                  gridWidth: 7
                };

  const dataURL = 'https://raw.githubusercontent.com/tlfrd/pay-ratios/master/data/over140k.json'

  d3.json(dataURL).then(({number_over_140k})=>{
    const data = number_over_140k.filter(d => d.women != "-").map(d => {
      let t = d.name !== "City" ? "women" : "women-uncertain"
      return {
          name: d.name,
          pay: [
            {
              type: t, 
              value: d.women}, 
            {
              type: "men", 
              value: d.over - d.women}
          ]
      }
    });

    // console.log(number_over_140k.filter(d => d.women != "-"))
    // console.log(data)
    data.sort((a, b)=>{
      return a.pay[1].value > b.pay[1].value ? 1 : -1
    })

    let gridGroups = svg.append("g")
                        .attr("class", "grids");


    let grids = gridGroups.selectAll('pay-grid')
                    .data(data)
                    .enter()
                    .append('g')
                    .attr("class", "pay-grid")
                    .attr('transform', (d, i)=>{
                      return 'translate('+ 
                      [config.left + ((config.iconWidth * config.radius * 4) * (i % config.gridWidth)), 
                       config.top + findMaxHeightOfPreviousRow(data, i, config.iconWidth) * (config.radius * 20)] + ')'
                    })

    function findMaxHeightOfPreviousRow(array, currentIndex) {
      var row = Math.floor(currentIndex / config.gridWidth) - 1;
      var start = config.gridWidth * row,
          end = config.gridWidth * (row + 1);
      var highest = 0;
      if (row >= 0) {
        for (var i = start; i < end; i++) {
          var total = array[i].pay[0].value + array[i].pay[1].value;
          if (total > highest) {
            highest = total;
          }
        }
      }
      var heightOfHeighest = Math.ceil(highest / config.iconWidth);
      return heightOfHeighest;
    }


    // 这里一定不能用箭头函数 ()=>{ ... } 否则this无法指向当前dom元素
    grids.each(function(d){
      let selection = d3.select(this);
      let data = d.pay;

      let total = d3.sum(data, d => d.value);
      let dataArray = new Array(total);

      data.forEach(function(d, i) {
        let previous = 0;
        if (i > 0){
          previous = data[i - 1].value;
        }
        
        for (let i = previous; i < (d.value + previous); i++) {
          dataArray[i] = {type: d.type};
        };
      });

      dataArray.forEach(function(d, i) {
        d.x = i % config.iconWidth;
        d.y = Math.floor(i / config.iconWidth);
      })

      let dotElems = selection.append("g")
                              .selectAll("circle")
                              .data(dataArray)
                              .enter()
                              .append("circle")
                              .attr("class", d => d.type)
                              .attr('fill', d => {
                                if(d.type === 'men'){
                                  return 'steelblue'
                                }else if(d.type === 'women'){
                                  return 'tomato'
                                }else{
                                  return 'khaki'
                                }
                              })
                              .attr("cx", d => d.x * (config.radius * 2 + config.padding))
                              .attr("cy", d => d.y * (config.radius * 2 + config.padding))
                              .attr("r", config.radius);
    })//.each()

    let separate = true;

    d3.select('svg').on('click', function animate(){
      // console.log('click')
      let payGrids = svg.selectAll(".pay-grid");

      let men = svg.selectAll(".men");
      let women = svg.selectAll(".women");
      let womenUn = svg.selectAll(".women-uncertain");

      let womenUnOffset = women.size();
      let menOffset = womenUnOffset + womenUn.size();

      // debugger
      console.log(payGrids)

      if (separate) {
        payGrids.transition().duration(1000).attr("transform", "translate(" + [0, config.top] + ")");
        
        women.transition()
                .duration(1000)
                .attr("cx", (d, i) => (i % config.largeIconWidth) * (config.radius * 2 + config.padding))
                .attr("cy", (d, i) => Math.floor(i / config.largeIconWidth) * (config.radius * 2 + config.padding));
      
        womenUn.transition()
                .duration(1000)
                .attr("cx", (d, i) => ((womenUnOffset + i) % config.largeIconWidth) * (config.radius * 2 + config.padding))
                .attr("cy", (d, i) => Math.floor((womenUnOffset + i) / config.largeIconWidth) * (config.radius * 2 + config.padding));

        men.transition()
            .duration(1000)
            .attr("cx", (d, i) => ((menOffset + i) % config.largeIconWidth) * (config.radius * 2 + config.padding))
            .attr("cy", (d, i) => Math.floor((menOffset + i) / config.largeIconWidth) * (config.radius * 2 + config.padding));
      
      }else{
        payGrids.transition()
                .duration(1000)
                .attr("transform", (d, i) => 
                      "translate(" + 
                      [config.left + ((config.iconWidth * config.radius * 4) * (i % config.gridWidth)), 
                      config.top + findMaxHeightOfPreviousRow(data, i, config.iconWidth) * (config.radius * 20)] + ")");

        women.transition()
              .duration(1000)
              .attr("cx", d => d.x * (config.radius * 2 + config.padding))
              .attr("cy", d => d.y * (config.radius * 2 + config.padding));
        
        womenUn.transition()
              .duration(1000)
              .attr("cx", d => d.x * (config.radius * 2 + config.padding))
              .attr("cy", d => d.y * (config.radius * 2 + config.padding));
            
        men.transition()
              .duration(1000)
              .attr("cx", d => d.x * (config.radius * 2 + config.padding))
              .attr("cy", d => d.y * (config.radius * 2 + config.padding));
                    
      }

      separate = !separate
    })


  })

  // fetch(dataURL).then((response)=>{
  //   console.log(response.json());
  //   // return response.json();
  // })
  // .then((data)=>{
    // console.log(data)
  // })

  vm.$refs.notes.innerHTML = `
  <p>selection.each(function(d){ ... }) 对selecion中每个元素执行函数，用 d3.select(this) 获取改元素的dom，d为该元素的数据。</p>
  <p> ⚠️：这里一定不能用箭头函数 (d)=>{ ... } 否则this无法指向当前dom元素</p>
  <p>动画实现：在svg上绑定'click'监听，调用animte函数。</p>
  <p>在animte中，用 d3.selectAll('class') 获取到对应都dom组，然后修改他的attr。</p>
  `
}