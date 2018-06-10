// http://bl.ocks.org/danaoira/6b271c84d8a22789b6145ff1e82d8eb4/ce9b78c6b6cb7ac9ce84c345400391943bbdcd58

module.exports = function (vm) {
    let margin = {top: 20, right: 60, bottom: 30, left: 60}
    let width = vm.$refs.chartArea.offsetWidth * 0.95
    let height = 600
    let innerWidth = width - margin.left - margin.right
    let innerHeight = height - margin.top - margin.bottom
    
    let svg = d3.select(vm.$refs.chartArea)
                  .append('svg')
                  .attr('height', height)
                  .attr('width', width)



}