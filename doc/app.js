/*global pliny, Primrose*/
var log = console.log.bind( console );
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

var stack = [ "Primrose" ];
while ( stack.length > 0 ) {
  var name = stack.shift();
  pliny.theYounger( name );
  [ "namespaces", "functions", "classes", "methods", "values" ]
      .forEach( recurse.bind( null, name, pliny.get( name ), stack ) );
}