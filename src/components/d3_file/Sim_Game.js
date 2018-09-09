module.exports = function (vm) {
  // console.log(vm.$refs.chartArea)


  let container = document.createElement('div')
  container.setAttribute('id', 'simulation')

  vm.$refs.chartArea.appendChild(container)

  import('../lib/Sim/index.js').then(function(module){
    let Simulation  = module.Simulation;
    // let Sim  = module.Sim;

    let simulation = new Simulation(container);

    simulation.start();
    console.log(simulation)
  })
}