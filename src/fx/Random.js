/* global Primrose, pliny */

Primrose.Random = ( function () {
  var Random = {};

  Random.number = function ( min, max ) {
    return Math.random() * ( max - min ) + min;
  };

  Random.int = function ( min, max, power ) {
    power = power || 1;
    if ( max === undefined ) {
      max = min;
      min = 0;
    }
    var delta = max - min,
        n = Math.pow( Math.random(), power );
    return Math.floor( min + n * delta );
  };

  Random.item = function ( arr ) {
    return arr[Primrose.Random.int( arr.length )];
  };

  Random.steps = function ( min, max, steps ) {
    return min + Primrose.Random.int( 0, ( 1 + max - min ) / steps ) * steps;
  };

  return Random;
} )();