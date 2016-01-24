/* global pliny, Primrose, devicePixelRatio */
( function () {
  "use strict";

  var docSearch = document.getElementById( "docSearch" ),
      nav = document.querySelector( "#contents nav > ul" ),
      doc = document.querySelector( "#documentation" ),
      main = document.querySelector( "main" ),
      docoCache = {
        "": doc.innerHTML,
        "#Global": pliny.formats.html.format( pliny.database )
      };

  var groupings = {
    examples: [ ],
    namespaces: [ pliny.database ],
    classes: [ ],
    methods: [ ],
    functions: [ ],
    enumerations: [ ],
    records: [ ],
    issues: [ ]
  };

  function search () {
    var lists = document.querySelectorAll( "#contents li ul" );
    for ( var i = 0; i < lists.length; ++i ) {
      var list = lists[i];
      var elems = list.querySelectorAll( "li" ),
          search = this.value.toLocaleLowerCase(),
          visibleCount = 0;
      for ( var j = 0; j < elems.length; ++j ) {
        var e = elems[j];
        if ( e && e.dataset && e.dataset.name ) {
          var b = e.dataset.name.toLocaleLowerCase(),
              visible = ( search.length === 0 || b.indexOf( search ) > -1 );
          if ( visible ) {
            ++visibleCount;
            e.style.display = "";
          }
          else {
            e.style.display = "none";
          }
        }
      }
      if ( visibleCount === 0 ) {
        list.parentElement.style.display = "none";
      }
      else {
        list.parentElement.style.display = "";
      }
    }
  }

  var editors = [ ];

  function editorFocused ( evt ) {
    for ( var i = 0; i < editors.length; ++i ) {
      if ( editors[i] !== evt.target ) {
        editors[i].blur();
      }
    }
  }

  function replacePreBlocks () {
    var codeBlocks = doc.querySelectorAll( "pre" );
    while ( editors.length < codeBlocks.length ) {
      editors.push( new Primrose.Text.Controls.TextBox( "editor" + editors.length, {
        autoBindEvents: true,
        keyEventSource: window,
        readOnly: true
      } ) );
      editors[editors.length - 1].addEventListener( "focus", editorFocused );
    }
    for ( var i = 0; i < codeBlocks.length; ++i ) {
      var ed = editors[i],
          b = codeBlocks[i];
      ed.setSize( b.clientWidth, Math.min( b.clientHeight * ( 1.25 + devicePixelRatio * 0.05 ), 400 ) );
      ed.value = b.textContent || b.innerText;
      ed.DOMElement.style.display = "block";
      ed.DOMElement.style.maxWidth = "100%";
      b.parentElement.replaceChild( ed.DOMElement, b );
    }
    for ( var i = codeBlocks.length; i < editors.length; ++i ) {
      var ed = editors[i];
      ed.DOMElement.style.display = "none";
    }
  }

  function toTop () {
    doc.scrollIntoView( {
      block: "top",
      behavior: "smooth"
    } );
  }

  function showHash ( evt ) {
    doc.innerHTML = docoCache[document.location.hash] || ( "Not found: " + document.location.hash );
    doc.querySelector( "#returnToTop" ).addEventListener( "click", toTop );
    replacePreBlocks();
    if ( evt ) {
      toTop();
    }
  }

  function paint () {
    requestAnimationFrame( paint );
    for ( var i = 0; i < editors.length; ++i ) {
      var ed = editors[i];
      if ( main.clientHeight + main.scrollTop > ed.DOMElement.offsetTop ) {
        ed.update();
        ed.render();
      }
    }
  }
  requestAnimationFrame( paint );

  // Walk the documentation database, grouping different objects by type.
  function buildDocumentation () {
    var stack = [ pliny.database ];
    while ( stack.length > 0 ) {
      var collections = stack.shift();
      for ( var key in collections ) {
        if ( groupings[key] ) {
          var collection = collections[key],
              group = groupings[key];
          for ( var i = 0; i < collection.length; ++i ) {
            var obj = collection[i];
            docoCache["#" + obj.id] = pliny.formats.html.format( obj ) + "<a id=\"returnToTop\" href=\"#\">top</a>";
            group.push( obj );
            // This is called "trampolining", and is basically a way of performing
            // recursion in languages that do not support automatic tail recursion.
            // Which is ECMAScript 5. Supposedly it's coming in ECMAScript 6. Whatever.
            stack.push( obj );
          }
        }
      }
    }
  }


  buildDocumentation();
  // Build the menu.
  delete groupings.methods;
  groupings.examples = pliny.database.examples || [ ];
  var output = "";
  for ( var g in groupings ) {
    var group = groupings[g];
    output += "<li><h2>" + g + "</h2><ul>";
    for ( var i = 0; i < group.length; ++i ) {
      var obj = group[i];
      if ( g !== "issues" || obj.type === "open" ) {
        output += "<li data-name=\"" + obj.fullName + "\"><a href=\"#" + obj.id + "\">" + obj.fullName + "</a></li>";
      }
    }
    output += "</ul></li>";
  }
  nav.innerHTML = output;

  // Setup the navigation events
  docSearch.addEventListener( "keyup", search, false );
  docSearch.addEventListener( "search", search, false );
  window.addEventListener( "hashchange", showHash, false );

  Primrose.Text.Themes.Default.regular.unfocused = "transparent";
  showHash();
  search.call( docSearch );
} )();