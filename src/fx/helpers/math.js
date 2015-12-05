var TAU = 2 * Math.PI;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  if(max === undefined){
    max = min;
    min = 0;
  }
  return Math.floor(randomRange(min, max));
}

function randomSteps(min, max, steps) {
  return min + randomInt(0, (1 + max - min) / steps) * steps;
}

function isNumber ( str ) {
  return !isNaN( str );
}