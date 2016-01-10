/* global pliny, Primrose */

"use strict";

var log = console.log.bind( console );
console.log = function ( output ) {
  document.body.innerHTML += "<p>" + output.replace( /\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;" ).split( "\n" ).join( "<br>" ) + "</p><hr>";
};

function recurse ( obj, stack, subName ) {
  if ( obj ) {
    var arr = obj[subName];
    if ( arr && arr instanceof Array ) {
      for ( var i = 0; i < arr.length; ++i ) {
        stack.push( arr[i] );
      }
    }
  }
}

var stack = [ pliny.database ];
while ( stack.length > 0 ) {
  var obj = stack.shift();
  pliny.theYounger( obj );
  [ "namespaces", "functions", "classes", "methods", "enumerations", "records" ]
      .forEach( recurse.bind( null, obj, stack ) );
}


console.log = log;