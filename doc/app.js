/* global pliny, Primrose */

"use strict";

var docSearch = document.getElementById( "docSearch" ),
    nav = document.querySelector( "#contents > nav > ul" ),
    main = document.querySelector( "#documentation" ),
    docoCache = {"": main.innerHTML},
groupings = {
  examples: [ ],
  namespaces: [ ],
  classes: [ ],
  functions: [ ],
  enumerations: [ ],
  records: [ ]
};

function search () {
  var elems = document.querySelectorAll( "#contents li li" ),
      search = this.value.toLocaleLowerCase();
  for ( var i = 0; i < elems.length; ++i ) {
    var e = elems[i],
        b = e.dataset.name.toLocaleLowerCase();
    console.log( b, search, b.indexOf( search ) );
    e.style.display = ( search.length === 0 || b.indexOf( search ) > -1 ) ? "" : "none";
  }
}

function showHash ( evt ) {
  main.innerHTML = docoCache[document.location.hash] || ( "Not found: " + document.location.hash );
  if ( evt ) {
    main.parentElement.scrollTo( 0, 0 );
  }
}

docSearch.addEventListener( "keyup", search, false );
docSearch.addEventListener( "change", search, false );

var stack = [ pliny.database ];
while ( stack.length > 0 ) {
  var obj = stack.shift();
  for ( var key in obj ) {
    if ( groupings[key] ) {
      var collect = obj[key],
          group = groupings[key];
      for ( var i = 0; i < collect.length; ++i ) {
        group.push( collect[i] );
        stack.push( collect[i] );
      }
    }
  }
}

var output = "";
for ( var g in groupings ) {
  var group = groupings[g];
  output += "<li><h2>" + g + "</h2><ul>";
  for ( var i = 0; i < group.length; ++i ) {
    var obj = group[i];
    output += "<li data-name=\"" + obj.fullName + "\"><a href=\"#" + obj.id + "\">" + obj.fullName + "</a></li>";
    docoCache["#" + obj.id] = pliny.formats.html.format( obj );
  }
  output += "</ul></li>";
}

nav.innerHTML += output;

window.addEventListener( "hashchange", showHash, false );

showHash();