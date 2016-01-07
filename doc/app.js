/*global pliny, Primrose*/
var oldConsole = console.log;
console.log = function ( output ) {
  document.body.innerHTML += "<pre>" + output + "</pre>";
};

function recurse ( name, obj, stack, subName ) {
  var arr = obj[subName];
  if ( arr && arr instanceof Array ) {
    for ( var i = 0; i < arr.length; ++i ) {
      stack.push( name + "." + arr[i].name );
    }
  }
}

function walk ( name ) {
  var stack = [ name ];
  while ( stack.length > 0 ) {
    name = stack.shift();
    pliny.theYounger( name );
    [ "namespaces", "functions", "classes", "methods" ]
        .forEach( recurse.bind( null, name, pliny.get( name ), stack ) );
  }
}

walk( "Primrose" );