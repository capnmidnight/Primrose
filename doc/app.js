/* global pliny, Primrose */

"use strict";

function recurse ( obj, stack, namespaces, subName ) {
  if ( obj ) {
    var arr = obj[subName];
    if ( arr && arr instanceof Array ) {
      for ( var i = 0; i < arr.length; ++i ) {
        stack.push( arr[i] );
        if ( subName === "namespaces" ) {
          namespaces.push( arr[i] );
        }
      }
    }
  }
}

var stack = [ pliny.database ],
    nav = document.querySelector( "nav" ),
    main = document.querySelector( "main" ),
    namespaces = [ pliny.database ];

while ( stack.length > 0 ) {
  var obj = stack.shift();
  main.innerHTML += pliny.formats.html.format( obj );

  [ "namespaces",
    "functions",
    "classes",
    "methods",
    "enumerations",
    "records" ]
      .forEach( recurse.bind( null, obj, stack, namespaces ) );
}

var output = "<ul>";
for ( var i = 0; i < namespaces.length; ++i ) {
  var ns = namespaces[i];
  output += "<li><h2><a href=\"#" + ns.id + "\">" + ns.fullName + "</a></h2>";
  [ "functions",
    "classes",
    "enumerations",
    "records"]
      .forEach( function ( sub ) {
        var arr = ns[sub];
        if ( arr ) {
          output += "<h3>" + sub + "</h3><ul>";
          for ( var i = 0; i < arr.length; ++i ) {
            output += "<li><a href=\"#" + arr[i].id + "\">" + arr[i].name + "</a></li>";
          }
          output += "</ul>";
        }
      } );
  output += "</li>";
}
nav.innerHTML += output + "</ul>";