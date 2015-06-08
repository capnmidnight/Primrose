// Applying Array's slice method to array-like objects. Called with
// no parameters, this function converts array-like objects into
// JavaScript Arrays.
function arr ( arg, a, b ) {
  return Array.prototype.slice.call( arg, a, b );
}

function map ( arr, fun ) {
  return Array.prototype.map.call( arr, fun );
}

function reduce ( arr, fun, base ) {
  return Array.prototype.reduce.call( arr, fun, base );
}

function filter ( arr, fun ) {
  return Array.prototype.filter.call( arr, fun );
}

function ofType ( arr, t ) {
  if ( typeof ( t ) === "function" ) {
    return filter( arr, function ( elem ) {
      return elem instanceof t;
    } );
  }
  else {
    return filter( arr, function ( elem ) {
      return typeof ( elem ) === t;
    } );
  }
}

function agg ( arr, get, red ) {
  if ( typeof ( get ) !== "function" ) {
    get = ( function ( key, obj ) {
      return obj[key];
    } ).bind( window, get );
  }
  return arr.map( get )
      .reduce( red );
}

function add ( a, b ) {
  return a + b;
}

function sum ( arr, get ) {
  return agg( arr, get, add );
}

function group ( arr, getKey, getValue ) {
  var groups = [ ];
  // we don't want to modify the original array.
  var clone = arr.slice();

  // Sorting the array by the group key criteeria first
  // simplifies the grouping step. With a sorted array
  // by the keys, grouping can be done in a single pass.
  clone.sort( function ( a, b ) {
    var ka = getKey ? getKey( a ) : a;
    var kb = getKey ? getKey( b ) : b;
    if ( ka < kb ) {
      return -1;
    }
    else if ( ka > kb ) {
      return 1;
    }
    return 0;
  } );

  for ( var i = 0; i < clone.length; ++i ) {
    var obj = clone[i];
    var key = getKey ? getKey( obj ) : obj;
    var val = getValue ? getValue( obj ) : obj;
    if ( groups.length === 0 || groups[groups.length - 1].key !== key ) {
      groups.push( { key: key, values: [ ] } );
    }
    groups[groups.length - 1].values.push( val );
  }
  return groups;
}
