/* global Function */

function copyObject ( dest, source ) {
  var stack = [ {dest: dest, source: source} ];
  while ( stack.length > 0 ) {
    var frame = stack.pop();
    source = frame.source;
    dest = frame.dest;
    for ( var key in source ) {
      if ( source.hasOwnProperty( key ) ) {
        if ( typeof ( source[key] ) !== "object" ) {
          dest[key] = source[key];
        }
        else {
          if ( !dest[key] ) {
            dest[key] = {};
          }
          stack.push( {dest: dest[key], source: source[key]} );
        }
      }
    }
  }
}

function inherit ( classType, parentType ) {
  classType.prototype = Object.create( parentType.prototype );
  classType.prototype.constructor = classType;
}


( function () {
  var _bind = Function.prototype.bind;
  Function.prototype.bind = function () {
    var thunk = _bind.apply( this, arguments );
    thunk.executionContext = arguments[0];
    return thunk;
  };
} )();

function fireAll () {
  var args = Array.prototype.slice.call( arguments ),
      evt = args.shift(),
      handlers = this.listeners[evt];
  for ( var i = 0; i < handlers.length; ++i ) {
    var thunk = handlers[i];
    thunk.apply( thunk.executionContext || this, args );
  }
}
