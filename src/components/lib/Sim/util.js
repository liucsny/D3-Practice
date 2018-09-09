function getVectorLength({x, y}){
  return Math.sqrt(x*x + y*y);
}

function getUnitVector({x, y}){
  let length = getVectorLength({x, y});
  return {
		x: x/length,
		y: y/length
	};
}

function multiplyVector({x, y}, scale){
	return {
		x: x * scale,
		y: y * scale
	};
}


function addVectors(a,b){
	return {
		x: a.x + b.x,
		y: a.y + b.y
	};
}

export { getVectorLength, getUnitVector, multiplyVector, addVectors }