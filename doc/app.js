/* global pliny, Primrose */

"use strict";

function translate( output ) {
  //return "<p>" + output.replace( /\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;" ).split( "\n" ).join( "<br>" ) + "</p><hr>";
  return output + "<hr>";
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
//var stack = [ "Primrose.Angle" ];
while ( stack.length > 0 ) {
  var obj = stack.shift();
  document.body.innerHTML += translate(pliny.formats.html.format(obj));
  [ "namespaces", "functions", "classes", "properties", "examples", "methods", "enumerations", "records" ]
      .forEach( recurse.bind( null, obj, stack ) );
}