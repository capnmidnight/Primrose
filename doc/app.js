/* global pliny, Primrose */

"use strict";

var t = document.getElementById( "docSearch" );
t.addEventListener( "keyup", search, false );
t.addEventListener( "change", search, false );

function search () {
  var elems = document.querySelectorAll("#contents li li"),
      search = this.value.toLocaleLowerCase();
  for(var i = 0; i < elems.length; ++i){
    var e = elems[i],
        b = e.dataset.name.toLocaleLowerCase();
    console.log(b, search, b.indexOf(search));
    e.style.display = (search.length === 0 || b.indexOf(search) > -1) ? "" : "none";
  }
}

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
    nav = document.querySelector( "#contents > nav > ul" ),
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

var output = "";
for ( var i = 0; i < namespaces.length; ++i ) {
  var ns = namespaces[i];
  output += "<li><h2><a href=\"#" + ns.id + "\">" + ns.fullName + "</a></h2>";
  [ "functions",
    "classes",
    "enumerations",
    "records" ]
      .forEach( function ( sub ) {
        var arr = ns[sub];
        if ( arr ) {
          output += "<h3>" + sub + "</h3><ul>";
          for ( var i = 0; i < arr.length; ++i ) {
            output += "<li data-name=\"" + arr[i].fullName + "\"><a href=\"#" + arr[i].id + "\">" + arr[i].name + "</a></li>";
          }
          output += "</ul>";
        }
      } );
  output += "</li>";
}
nav.innerHTML += output;