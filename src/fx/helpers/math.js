var TAU = 2 * Math.PI;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max, power) {
  power = power || 1;
  if(max === undefined){
    max = min;
    min = 0;
  }
  var delta = max - min,
      n = Math.pow(Math.random(), power);
  return Math.floor(min + n * delta);
}

function randomSteps(min, max, steps) {
  return min + randomInt(0, (1 + max - min) / steps) * steps;
}

function isNumber ( str ) {
  return !isNaN( str );
}