function Sim (config){
  const self = this;

  self.config = config;
  self.networkConfig = {...config.network};
  self.container = config.container;
  self.options = config.options || {};
  self.id = config.id;
  self.ctx = self.canvas.getContext('2d');
  self.mouse = {x:0, y:0};

  self.canvas = createCanvas(container.clientWidth, container.clientHeight);
}

Sim.prototype.clear = function(){
  const self = this;
  self.peeps = [];
  self.connections = [];
  self.contagion = 0;
}

Sim.prototype.init = function(){
  const self = this;
  self.clear();
}

Sim.prototype.draw = function(){
  const self = this;
  let ctx = self.ctx;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.scale(2,2);

  

  ctx.restore();
}

Sim.prototype.kill = function(){
  const self = this;		
  self.clear();
};


export default Sim;