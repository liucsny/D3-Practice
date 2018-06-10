// http://bl.ocks.org/danaoira/6b271c84d8a22789b6145ff1e82d8eb4/ce9b78c6b6cb7ac9ce84c345400391943bbdcd58
// https://bost.ocks.org/mike/join/


module.exports = function (vm) {
    let margin = {top: 40, right: 60, bottom: 30, left: 60}
    let width = vm.$refs.chartArea.offsetWidth * 0.95
    let height = 600
    let innerWidth = width - margin.left - margin.right
    let innerHeight = height - margin.top - margin.bottom
    
    let SelectGroup = d3.select(vm.$refs.chartArea).append('div').attr('class', 'tl flex')
    let selectX = SelectGroup.append('p').attr('class', 'mr3').text('X-Axis').append('select').attr('id', 'x-menu').attr('class','mh2 w4')
    let selectY= SelectGroup.append('p').attr('class', 'mr3').text('Y-Axis').append('select').attr('id', 'y-menu').attr('class','mh2').attr('class','mh2 w4')
    let selectS = SelectGroup.append('p').attr('class', 'mr3').text('Size').append('select').attr('id', 's-menu').attr('class','mh2 w4')

    let svg = d3.select(vm.$refs.chartArea)
                  .append('svg')
                  .attr('height', height)
                  .attr('width', width)

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    function populateSelect(selectionID, options, defaultVal) {
        let select = document.querySelector(selectionID)
        for(let i = 0; i < options.length; i++) {
            let opt = options[i];
            let ele = document.createElement("option");
            ele.textContent = opt;
            ele.value = opt;
            if (options[i] == defaultVal) {
                ele.selected = "selected";
            }
            select.appendChild(ele);
        }
    }

    //这里使用函数来对各种组件进行设置（横轴纵轴，比例尺），好处是当初始化和更新都需要的时候只用调用就可以了
    //而且这里他把 x,y 的比例尺，横轴纵轴，domain range都封装到了一个对象里，更加方便管理使用

    let setDomain = function(data, xVal, yVal, sVal) {
        return {
            x: d3.extent(data, function(d) { return d[xVal] }),
            y: d3.extent(data, function(d) { return d[yVal] }),
            s: d3.extent(data, function(d) { return d[sVal] })
        }
    }

    let setRange = function() {
        return {
            x: [0, innerWidth],
            y: [innerHeight, 0],
            s: [0.1, 20]
        }
    }

    let setScale = function(domain, range) {
        return {
            x: d3.scaleLinear()
                .domain(domain.x)
                .range(range.x),
            y: d3.scaleLinear()
                .domain(domain.y)
                .range(range.y),
            s: d3.scaleLinear()
                .domain(domain.s)
                .range(range.s)
        }
    }

    let setAxes = function(scale) {
        return {
            x: d3.axisBottom().scale(scale.x),
            y: d3.axisLeft().scale(scale.y)
        }
    }

    let numVals = ["P. Min Mass (EU)", "P. Mass (EU)", "P. Radius (EU)", "P. Density (EU)", "P. Gravity (EU)", "P. Esc Vel (EU)", "P. SFlux Min (EU)", "P. SFlux Mean (EU)", "P. SFlux Max (EU)", "P. Teq Min (K)", "P. Teq Mean (K)", "P. Teq Max (K)", "P. Ts Min (K)", "P. Ts Mean (K)", "P. Ts Max (K)", "P. Surf Press (EU)", "P. Mag", "P. Appar Size (deg)", "P. Period (days)", "P. Sem Major Axis (AU)", "P. Eccentricity", "P. Mean Distance (AU)", "P. Inclination (deg)", "P. Omega (deg)", "S. Mass (SU)", "S. Radius (SU)", "S. Teff (K)", "S. Luminosity (SU)", "S. Age (Gyrs)", "S. Distance (pc)", "S. RA (hrs)", "S. DEC (deg)", "S. Mag from Planet", "S. Size from Planet (deg)", "S. No. Planets", "S. No. Planets", "S. No. Planets HZ", "S. Hab Zone Min (AU)", "S. Hab Zone Max (AU)", "P. HZD", "P. HZC", "P. HZA", "P. HZI", "P. SPH", "P. ESI", "P. Disc. Year"];


    populateSelect("#x-menu", numVals, "P. Mass (EU)");
    populateSelect("#y-menu", numVals, "P. Gravity (EU)");
    populateSelect("#s-menu", numVals, "P. Radius (EU)");

    //====================================
    //append操作也被写成函数=================

    let appendX = function(svg, axes) {
        let drawnX = svg.append("g")
            .call(axes.x)
            .attr("transform", "translate(0, " + innerHeight + ")");
        return drawnX;
    }

    let appendY = function(svg, axes) {
        drawnY = svg.append("g")
            .call(axes.y);
        return drawnY;
    }

    let appendTitle = function(svg, xVal, yVal) {
        let title = svg.append("text")
            .text(xVal + " vs. " + yVal)
            .attr("class", "title")
            .attr("transform", "translate(" + -margin.left + ", " + -(margin.top * 0.5) + ")")
            .attr("text-anchor", "start");
        return title;
    }
    //====================================
    //==updateSVG 每次改变 x轴 y轴 选项时调用的函数，整个可视化的核心函数
    function updateSVG(canvas, data, xVal, yVal, sVal, title, axisX, axisY){
      let domain = setDomain(data, xVal, yVal, sVal);
      let range = setRange();
      let scale = setScale(domain, range);
      let axes = setAxes(scale);

      let selection = canvas.selectAll("circle")
                    .data(data, function(d) { return d["P. Name"] })//这里的函数决定了 P. Nam 属性的数据绑定到 ID 为对应 P. Name 属性的元素

      //https://bost.ocks.org/mike/join/
      let t = selection.transition().duration(1000);

      selection.exit().remove();

      selection.enter()
                .append('g')
                .append("circle")
                .merge(selection)
                .transition(t)//transition的位置很讲究，只能放倒merge后面
                .attr("class", "circle")
                .attr("cx", function(d) { return scale.x(d[xVal]) })
                .attr("cy", function(d) { return scale.y(d[yVal]) })
                .attr("r", function(d) { return scale.s(d[sVal]) })
                .attr("fill", "SteelBlue")
                .attr("fill-opacity", 0.5)
                .attr("id", function(d) { return d["P. Name"]} );

      //更新数据的核心代码
    //   let selection = canvas.selectAll("circle")
    //             .data(data, function(d) { return d["P. Name"] })
                
    //   selection.exit().remove();

    //   selection.enter()
    //         .append("circle")
    //         .merge(selection)//看不懂
    //         .transition()
    //         .duration(1000)
    //         .attr("class", "circle")
    //         .attr("cx", function(d) { return scale.x(d[xVal]) })
    //         .attr("cy", function(d) { return scale.y(d[yVal]) })
    //         .attr("r", 5)
    //         .attr("id", function(d) { return d["P. Name"]} );

      //更新数据轴
      axisX.transition()
            .duration(1000)
            .call(axes.x);
            
      axisY.transition()
            .duration(1000)
            .call(axes.y);

    }
    //====================================


    let dataUrl = "/static/phl_hec_all_confirmed.csv"
    

    d3.csv("/static/phl_hec_all_confirmed.csv", function(d){
      let result = {}
      for (let k in d) {
        result[k] = +d[k]
        if (isNaN(result[k])) {
          result[k] = d[k]
        }
      }
      return result
    }).then(function(data){
    //   console.log(data)

      let xVal = d3.select("#x-menu")
                .property("value")
      let yVal = d3.select("#y-menu")
                .property("value")
      let sVal = d3.select("#s-menu")
                .property("value")
                
      let domain = setDomain(data, xVal, yVal, sVal);
      let range = setRange();
      let scale = setScale(domain, range);
      let axes = setAxes(scale);

      let axisX = appendX(g, axes);
      let axisY = appendY(g, axes);
      let title = appendTitle(g, xVal, yVal);


      updateSVG(g, data, xVal, yVal, sVal, title, axisX, axisY);

      d3.select("#x-menu").on("change", function() {
        xVal = d3.select("#x-menu")
          .property("value");
        updateSVG(g, data, xVal, yVal, sVal, title, axisX, axisY);
      });

      d3.select("#y-menu").on("change", function() {
        yVal = d3.select("#y-menu")
          .property("value");
        updateSVG(g, data, xVal, yVal, sVal, title, axisX, axisY);
      });

      d3.select("#s-menu").on("change", function() {
        sVal = d3.select("#s-menu")
          .property("value");
        updateSVG(g, data, xVal, yVal, sVal, title, axisX, axisY);
      });
    })
    // populateSelect('x-menu',[1,2,3,4,5,6,7,8,9,10],4)

}