import {getUnitVector, getVectorLength, multiplyVector, addVectors } from './util.js'

function Peep(config){
  let self = this;

  // Properties
  self.x = config.x;
  self.y = config.y;

  self.velocity = {
    x:0,
    y:0
  };

  self.infected = !!config.infected;
  self.sim = config.sim;

  // Update
  self.numFriends = 0;
  self.numInfectedFriends = 0;
  self.isPastThreshold = false;
  self.faceX = 0;
  self.faceY = 0;
  self.faceBlink = 0;
  self.isMajority = false;

  let _facefollow = 0.75+(Math.random()*0.1);
}

Peep.prototype.update = function(){
  let self = this;

  // Face position!
  let faceVector = {
    x: (self.sim.mouse.x - self.x)/5,
    y: (self.sim.mouse.y - self.y)/5,
    get mag(){
      return Math.sqrt(this.x*this.x + this.y*this.y);
    }
  };

  let max_distance = 5;

  if(faceVector.mag > max_distance){
    faceVector.x = faceVector.x * (max_distance/faceVector.mag);
    faceVector.y = faceVector.y * (max_distance/faceVector.mag);
  }

  self.faceX = self.faceX*_faceFollow + faceVector.x*(1-_faceFollow);
  self.faceY = self.faceY*_faceFollow + faceVector.y*(1-_faceFollow);

  // Blink?
  if(!self.faceBlink){
    if(Math.random()<0.002) self.faceBlink=true;
  }else{
    if(Math.random()<0.07) self.faceBlink=false;
  }

  // Friends connected... or infected
  let friends = self.sim.getFriendsOf(self);
  self.numFriends = friends.length;
  friends.forEach(function(friend){
    if(friend.infected){
      self.numInfectedFriends++;
    }
  });

  // Past threshold?
  self.isPastThreshold = false;
  if(self.sim.contagion==0){
    // simple
    if(self.numInfectedFriends>0) self.isPastThreshold = true;
  } else {
    if(self.numFriends>0){
      let ratio = self.numInfectedFriends/self.numFriends;
      // if(ratio >= self.sim.contagion-0.0001){ // floating point errors
      if(ratio >= self.sim.contagion){
        self.isPastThreshold = true;
      }
    }
  }

  // SPLASH: FORCE-DIRECTED
  if(self.sim.options.splash){
    let gravity = getUnitVector({
      x: 0 - self.x,
      y: 0 - self.y
    });

    let gravityScale = getVectorLength(self)*0.00012;
    if(self.sim.options.CONCLUSION){
      gravityScale *= 2;
    } // ????????
    gravity = multiplyVector(gravity, gravityScale);
    self.velocity = addVectors(self.velocity, gravity);


  }
}