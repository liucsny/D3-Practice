// http://bl.ocks.org/danaoira/6b271c84d8a22789b6145ff1e82d8eb4/ce9b78c6b6cb7ac9ce84c345400391943bbdcd58

module.exports = function (vm) {
    let margin = {top: 20, right: 60, bottom: 30, left: 60}
    let width = vm.$refs.chartArea.offsetWidth * 0.95
    let height = 600
    let innerWidth = width - margin.left - margin.right
    let innerHeight = height - margin.top - margin.bottom
    
    let SelectGroup = d3.select(vm.$refs.chartArea).append('div').attr('class', 'tl flex')
    let selectX = SelectGroup.append('p').attr('class', 'mr3').text('X-Axis').append('select').attr('id', 'x-menu').attr('class','mh2 w4')
    let selectY= SelectGroup.append('p').text('Y-Axis').append('select').attr('id', 'y-menu').attr('class','mh2').attr('class','mh2 w4')

    let svg = d3.select(vm.$refs.chartArea)
                  .append('svg')
                  .attr('height', height)
                  .attr('width', width)

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

    populateSelect('#x-menu',[1,2,3,4,5,6,7,8,9,0],0)
    populateSelect('#y-menu',[1,2,3,4,5,6,7,8,9,0],8)

    //这里使用函数来对各种组件进行设置（横轴纵轴，比例尺），好处是当初始化和更新都需要的时候只用调用就可以了
    //而且这里他把 x,y 的比例尺，横轴纵轴，domain range都封装到了一个对象里，更加方便管理使用

    let setDomain = function(data, xVal, yVal) {
        return {
            x: d3.extent(data, function(d) { return d[xVal] }),
            y: d3.extent(data, function(d) { return d[yVal] })
        }
    }

    let setRange = function() {
        return {
            x: [0, innerWidth],
            y: [innerHeight, 0]
        }
    }

    let setScale = function(domain, range) {
        return {
            x: d3.scaleLinear()
                .domain(domain.x)
                .range(range.x),
            y: d3.scaleLinear()
                .domain(domain.y)
                .range(range.y)
        }
    }

    let setAxes = function(scale) {
        return {
            x: d3.axisBottom().scale(scale.x),
            y: d3.axisLeft().scale(scale.y)
        }
    }
    //====================================

    let dataUrl = "/static/phl_hec_all_confirmed.csv"

    d3.csv("/static/phl_hec_all_confirmed.csv", function(d){
      var result = {}
      for (var k in d) {
        result[k] = +d[k]
        if (isNaN(result[k])) {
          result[k] = d[k]
        }
      }
      return result
    }).then(function(data){
    //   console.log(data)

      var xVal = d3.select("#x-menu")
                .property("value")
      var yVal = d3.select("#y-menu")
                .property("value")
                
      console.log(xVal)
    })
    // populateSelect('x-menu',[1,2,3,4,5,6,7,8,9,10],4)

}