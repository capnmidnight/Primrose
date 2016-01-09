/* global pliny, Primrose */

"use strict";

var log = console.log.bind( console );
console.log = function ( output ) {
  document.body.innerHTML += "<p>" + output.replace( /\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;" ).split( "\n" ).join( "<br>" ) + "</p>";
};

function recurse ( name, obj, stack, subName ) {
  var arr = obj[subName];
  if ( arr && arr instanceof Array ) {
    for ( var i = 0; i < arr.length; ++i ) {
      if ( name.length > 0 ) {
        stack.push( name + "." + arr[i].name );
      }
      else {
        stack.push( arr[i].name );
      }
    }
  }
}

var stack = pliny.values.slice();
stack.push( "Primrose" );
while ( stack.length > 0 ) {
  var obj = stack.shift(),
      bag;
  if ( typeof obj === "string" || obj instanceof String ) {
    bag = pliny.get( obj );
  }
  else {
    bag = obj;
    obj = bag.name || "";
  }
  pliny.theYounger( obj );
  [ "namespaces", "functions", "classes", "methods", "enumerations", "records" ]
      .forEach( recurse.bind( null, obj, bag, stack ) );
}


console.log = log;