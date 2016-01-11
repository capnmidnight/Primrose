/* global pliny, Primrose */
( function () {
  "use strict";

  var docSearch = document.getElementById( "docSearch" ),
      nav = document.querySelector( "#contents nav > ul" ),
      doc = document.querySelector( "#documentation" ),
      docoCache = {"": doc.innerHTML},
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
      e.style.display = ( search.length === 0 || b.indexOf( search ) > -1 ) ? "" : "none";
    }
  }

  function showHash ( evt ) {
    if ( document.location.hash !== "#top" ) {
      doc.innerHTML = docoCache[document.location.hash] || ( "Not found: " + document.location.hash );
      if ( evt ) {
        doc.scrollIntoView( {
          block: "top",
          behavior: "smooth"
        } );
      }
    }
  }


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
      docoCache["#" + obj.id] = pliny.formats.html.format( obj ) + "<a class=\"return-to-top\" href=\"#top\">top</a>";
    }
    output += "</ul></li>";
  }

  nav.innerHTML += output;


  docSearch.addEventListener( "keyup", search, false );
  docSearch.addEventListener( "change", search, false );
  window.addEventListener( "hashchange", showHash, false );

  showHash();
} )();