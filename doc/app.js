/* global pliny, Primrose */
var log = console.log.bind( console );
console.log = function ( output ) {
  document.body.innerHTML += "<p>" + output.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").split( "\n" ).join( "<br>" ) + "</p>";
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
  [ "namespaces", "functions", "classes", "methods", "enumerations", "records" ]
      .forEach( recurse.bind( null, name, pliny.get( name ), stack ) );
}


console.log = log;