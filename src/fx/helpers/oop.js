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

function fireAll (evt, args) {
  var handlers = this.listeners[evt];
  for ( var i = 0; i < handlers.length; ++i ) {
    var thunk = handlers[i];
    thunk.call( thunk.executionContext || this, args );
  }
}
