/* global pliny */

pliny.issue({
  name: "document copyObject",
  type: "open",
  description: "Finish writing the documentation for the [`copyObject`](#copyObject) function\n\
in the helpers/oop.js file."
} );
pliny.function({
  name: "copyObject",
  description: "| [under construction]"
} );
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

pliny.issue({
  name: "document inherit",
  type: "open",
  description: "Finish writing the documentation for the [`inherit`](#inherit) function\n\
in the helpers/oop.js file."
} );
pliny.function({
  name: "inherit",
  description: "| [under construction]"
} );
function inherit ( classType, parentType ) {
  classType.prototype = Object.create( parentType.prototype );
  classType.prototype.constructor = classType;
}


pliny.issue({
  name: "document range",
  type: "open",
  description: "Finish writing the documentation for the [`range`](#range) function\n\
in the helpers/oop.js file."
} );
pliny.function({
  name: "range",
  description: "| [under construction]"
} );
function range ( n, m, s, t ) {
  var n2 = s && n || 0,
      m2 = s && m || n,
      s2 = t && s || 1,
      t2 = t || s || m;
  for ( var i = n2; i < m2; i += s2 ) {
    t2( i );
  }
}


pliny.issue({
  name: "document emit",
  type: "open",
  description: "Finish writing the documentation for the [`emit`](#emit) function\n\
in the helpers/oop.js file."
} );
pliny.function({
  name: "emit",
  description: "| [under construction]"
} );
function emit ( evt, args ) {
  var handlers = this.listeners[evt];
  for ( var i = 0; i < handlers.length; ++i ) {
    handlers[i]( args );
  }
}

pliny.issue({
  name: "document helpers/oop",
  type: "open",
  description: "Finish writing the documentation for the [oop](#oop) class in the helpers/ directory"
} );
