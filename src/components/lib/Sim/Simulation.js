import Sim from './Sim';

function Simulation (container){
  const self = this

  self.container = container;
  self.sims = [];

  self.CLOCK = -1;
}

Simulation.prototype.add = function(config){
  const self = this;

  let configClone = {...config};

  configClone.container = this;

  let sim = new Sim(configClone);

  self.container.appendChild(sim.canvas);
  self.sims.push(sim);
}


Simulation.prototype.clear = function(){
  const self = this

  Simulation.IS_RUNNING = false;//？？？


  self.container.removeAttribute("sim_is_running");

  self.sims.forEach(function(sim){
    self.dom.removeChild(sim.canvas);
    sim.kill();
  })
  self.sims = [];
}

Simulation.prototype.update = function(){
  if (Simulation.IS_RUNNING) {
    if(self.CLOCK==0){
      self.sims.forEach(function(sim){
        sim.nextStep();
      });
      self.CLOCK = 30;
    }
    self.CLOCK--;
  }

  self.sims.forEach(function(sim){
    sim.update();
  });
}//不太懂


Simulation.prototype.draw = function(){
  self.sims.forEach(function(sim){
    sim.draw();
  });
};

Simulation.prototype.start = function(){
  let self = this;
  
  Simulation.IS_RUNNING = true;
  self.container.setAttribute("sim_is_running",true);
  
  self.CLOCK = 0;
  // save for later resetting
  self.sims.forEach(function(sim){
    sim.save();
  });
}

Simulation.prototype.stop = function (){
  let self = this;

  Simulation.IS_RUNNING = false;
  self.removeAttribute("sim_is_running");

  self.sims.forEach(function(sim){
    sim.reload(); 
  });
}

export default Simulation;