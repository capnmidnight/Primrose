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
    pages: [ ],
    examples: [ ],
    namespaces: [ pliny.database ],
    classes: [ ],
    methods: [ ],
    events: [ ],
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
          b = codeBlocks[i],
          fs = parseFloat( document.defaultView.getComputedStyle( b, null ).getPropertyValue( "font-size" ) );
      ed.setSize( b.clientWidth, Math.min( b.clientHeight * ( 1.25 + devicePixelRatio * 0.05 ), 400 ) );
      ed.targetSize = fs;
      setFontSize( ed );
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
  function setFontSize ( ed ) {
    ed.fontSize = ed.targetSize * devicePixelRatio;
  }
  window.addEventListener( "resize", function () {
    editors.forEach( setFontSize );
  } );

  function toTop () {
    doc.scrollIntoView( {
      block: "top",
      behavior: "smooth"
    } );
  }

  function showHash ( evt ) {
    doc.innerHTML = docoCache[document.location.hash] || ( "Not found: " + document.location.hash );
    replacePreBlocks();
    if ( evt ) {
      toTop();
    }
    var top = document.getElementById( "returnToTop" );
    if ( top ) {
      top.addEventListener( "click", toTop );
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
            docoCache["#" + obj.id.trim()] = pliny.formats.html.format( obj ) + "<a id=\"returnToTop\" href=\"#\">top</a>";
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

  function renderDocs () {
    buildDocumentation();
    groupings.pages.unshift( {id: "", fullName: "Getting Started"} );
    // Build the menu.
    groupings.examples = pliny.database.examples || [ ];
    var output = "";
    for ( var g in groupings ) {
      if ( g !== "methods" && g !== "events" ) {
        var group = groupings[g];
        if ( g !== "pages" ) {
          group.sort( function ( a, b ) {
            var c = a.fullName,
                d = b.fullName;
            if ( c === "[Global]" ) {
              c = "A" + c;
            }
            if ( d === "[Global]" ) {
              d = "A" + d;
            }
            if ( c > d ) {
              return 1;
            }
            else if ( c < d ) {
              return -1;
            }
            else {
              return 0;
            }
          } );
        }

        output += "<li><h2>";
        if ( g === "issues" ) {
          output += "Open Issues (" + group.length + ")";
        }
        else {
          output += g;
        }
        output += "</h2><ul>";
        for ( var i = 0; i < group.length; ++i ) {
          var obj = group[i];
          if ( g !== "issues" || obj.type === "open" ) {
            output += "<li data-name=\"" + obj.fullName + "\"><a href=\"#" + obj.id + "\">" + obj.fullName + "</a></li>";
          }
        }
        output += "</ul></li>";
      }
    }
    nav.innerHTML = output;
    showHash();
    search.call( docSearch );
  }

  // Setup the navigation events
  docSearch.addEventListener( "keyup", search, false );
  docSearch.addEventListener( "search", search, false );
  window.addEventListener( "hashchange", showHash, false );

  Primrose.Text.Themes.Default.regular.unfocused = "transparent";

  pliny.load( [
    "setup",
    "faq",
    "pliny"
  ].map( function ( f ) {
    return f + ".md";
  } ) ).then( renderDocs );
} )();