module.exports = function (vm) {
  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600
  let innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  let SelectGroup = d3.select(vm.$refs.chartArea).append('div').attr('class', 'tl flex')
  let select = SelectGroup.append('p').attr('class', 'mr3').text('User').append('select').attr('id', 'user').attr('class','mh2 w4')

  d3.select(vm.$refs.chartArea).append('div').property('innerHTML', `  <div class="A-plus"></div>
  <div class="A"></div>
  <div class="A-minus"></div>
  <div class="B-plus"></div>
  <div class="B"></div>
  <div class="B-minus"></div>
  <div class="C-and-D"></div>`)

  let maxVideoViews
  let maxSubscribers
  let radius = 2
  let focusRadius = 5

  d3.csv("/static/video.csv",function(d) { 
    d.Rank = +d.Rank;
    d.Subscribers = +d.Subscribers;
    d.VideoViews = +d.VideoViews;
    return d;
}).then(function(data){

    // select.on("change", highlightUser)

    select.selectAll('option')
            .data(data)
            .enter()
            .append("option")
            .attr("value", function(d) { return d.User })
            .text(function(d) { return d.User })

    maxVideoViews = d3.max(data, function(d){ return d.VideoViews })
    maxSubscribers = d3.max(data, function(d){ return d.Subscribers })

    let nestedData = d3.nest()
    .key(function(d){ return d.Rating; })
    .entries(data)

    nestedData.forEach(function({key, values}) {
      let className = "." + key

      let width = 600
      let height = 95
      let margin

      if (className == ".A-plus") {
        margin = {"top": 50, "left": 150, "right": 130, "bottom": 0,}
      } else {
        margin = {"top": 20, "left": 150, "right": 130, "bottom": 0,}
      }

      let maxVideoViewsRating = d3.max(values, function(d){ return d.VideoViews; })
      let maxSubscribersRating = d3.max(values, function(d){ return d.Subscribers; })

      let svg = d3.select(className)
                .append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)


    // 首行添加说明
      if (className == ".A-plus") {
        svg.append("text")
        .text("Rating")
        .attr("class", "axis-label")
        .attr("x", 0)
        .attr("y", 20)
        .style("text-anchor", "start");
            
        svg.append("text")
        .text("Views (billions)")
        .attr("class", "axis-label")
        .attr("x", (margin.left/2) + width/4)
        .attr("y", 20)
        .style("text-anchor", "middle");
        
        svg.append("text")
        .text("Subscribers (millions)")
        .attr("class", "axis-label")
        .attr("x", (margin.left + width/2) + width/4)
        .attr("y", 20)
        .style("text-anchor", "middle");; 
      }

      // 添加分级
      svg.append("text")
      .text(key.replace("-", " "))
      .attr("x", 0)
      .attr("y", margin.top + height/2)
      .style("fill", "black");
      
      svg.append("text")
      .text("(n=" + data.length+")")
      .attr("x", 0)
      .attr("y", margin.top + height/2 + 16)
      .style("fill", "black");

      let scaleVideoViews = d3.scaleLinear()
                            .domain([0,maxVideoViews])
                            .range([0,width/2])

      let xAxisVideoViews =  d3.axisTop(scaleVideoViews).tickFormat(function formatBillions(d) {
        let roundedNumber = Math.round(d/1000000000);
        return roundedNumber + "bn";
      })

      let gXAxisVideoViews = svg.append("g")
                        .attr("transform", "translate(" + (margin.left/2) + "," + margin.top + ")")
                        .call(xAxisVideoViews)


      gXAxisVideoViews.select('.domain').remove()

      let gVideoViews = svg.append("g")
                        .attr("transform", "translate(" + (margin.left/2) + "," + margin.top + ")");


      let simulationVideoViews = d3.forceSimulation(values)
                .force("x", d3.forceX(function(d) { return scaleVideoViews(d.VideoViews); }).strength(1))
                .force("y", d3.forceY(height/2))
                .force("collide", d3.forceCollide(radius + 0.5))
                .stop()

      for (let i = 0; i < 120; ++i) simulationVideoViews.tick()  // https://github.com/d3/d3-force/blob/master/README.md#simulation_tick

      let circlesVideoViews = gVideoViews.selectAll("g")
            .data(values)
            .enter()
            .append("g")
            .attr("class", function(d) {
                if (d.Rating == "A-plus" || d.VideoViews == maxVideoViewsRating ) { 
                    return "user-circle-always-shown";
                } else {
                    return "user-circle";
                }
            })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y +")" })

      circlesVideoViews.append("circle")
            .attr("r", function(d){
                if (d.Rating == "A-plus" || d.VideoViews == maxVideoViewsRating ) { 
                    return focusRadius;
                } else {
                    return radius;
                };
            })
            .attr("cx", 0)
            .attr("cy", 0)
            .style("fill", "DarkSlateBlue")
            .style("fill-opacity", 0.7 )

      // 左边绘图结束=====================================================================================

      let scaleSubscribers = d3.scaleLinear()
      .range([0,width/2])
      .domain([0,maxSubscribers]);
      
      
      let gSubscribers = svg.append("g")
      .attr("transform", "translate(" + (margin.left + width/2) + "," + margin.top + ")");
      
      let xAxisSubscribers = d3.axisTop(scaleSubscribers).tickFormat(function formatBillions(d) {
        let roundedNumber = Math.round(d/1000000);
        return roundedNumber + "m";
      });
      
      let gXAxisSubscribers = svg.append("g")
    	.attr("transform", "translate(" + (margin.left + (width/2)) + "," + margin.top + ")")
    	.call(xAxisSubscribers);
      
      gXAxisSubscribers.select('.domain').remove()


      let simulationSubscribers = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) { return scaleSubscribers(d.Subscribers); }).strength(1))
      .force("y", d3.forceY(height/2))
      .force("collide", d3.forceCollide(radius + 0.5))
      .stop();
      
      for (let i = 0; i < 60; ++i) simulationSubscribers.tick()

      let circlesSubscribers = gSubscribers.selectAll("g")
                    .data(values)
                    .enter()
                    .append("g")
                    .attr("class", function(d) {
                        if (d.Rating == "A-plus" || d.Subscribers == maxSubscribersRating ) { 
                            return "user-circle-always-shown";
                        } else {
                            return "user-circle";
                        }
                    })
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y +")"; });
      
      circlesSubscribers.append("circle")
                    .attr("r", function(d){
                        if (d.Rating == "A-plus" || d.Subscribers == maxSubscribersRating ) { 
                            return focusRadius;
                        } else {
                            return radius;
                        };
                    })
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .style("fill", "Tomato")
                    .style("fill-opacity", 0.7 )


      d3.selectAll("circle")
                .on("mouseover", function(d){
                    console.log(d)
                    d3.select("#user").property('value', d.User)

                    ;(function highlightUser() {
      
                        let sel = document.getElementById('user');
                        let selectedUser = sel.options[sel.selectedIndex].value;
                    
                        d3.selectAll("circle")
                        .style("opacity", function(d) { return d.User==selectedUser ? 1 : 0.2; });
                        
                        d3.selectAll(".user-circle").selectAll("circle")
                        .attr("r", function(d) { 
                          return d.User==selectedUser ? focusRadius : radius; 
                        });
                        
                        
                        d3.selectAll(".user-label-always-shown")
                        .style("fill", function(d) {
                          return d.User==selectedUser ? "black": "white";
                        });
                        
                        let labels = d3.selectAll(".user-label").style("visibility", "hidden");
                        
                        labels.filter(function(d) { return d.User==selectedUser; })
                        .style("visibility", "inherit");
                        
                      })()
                })
                .on("mouseout", function(d){
                    d3.selectAll("circle").style("opacity", 0.7);
                    d3.selectAll(".user-circle").selectAll("circle").attr("r", radius);
                    d3.selectAll(".user-label-always-shown").style("fill", "black");
                    d3.selectAll(".user-label").style("visibility", "hidden").style;
                })
    })
  })


  d3.selectAll("circle").attr('fill',function(d){
    console.log(d)
  })

  vm.$refs.notes.innerHTML = `
  <p>可以看出，d3.selection中DOM和data是绑定在一起的</p>
  `
}