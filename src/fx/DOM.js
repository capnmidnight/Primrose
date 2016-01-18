/* global Primrose, pliny */

Primrose.DOM = ( function () {

  pliny.namespace( "Primrose.DOM", "A few functions for manipulating DOM." );
  var DOM = {};


  pliny.function( "Primrose.DOM", {
    name: "cascadeElement",
    description: "1. If id is a string, tries to find the DOM element that has said ID\n\
* If it exists, and it matches the expected tag type, returns the element, or throws an error if validation fails.\n\
* If it doesn't exist, creates it and sets its ID to the provided id, then returns the new DOM element, not yet placed in the document anywhere.\n\
2. If id is a DOM element, validates that it is of the expected type,\n\
* returning the DOM element back if it's good,\n\
* or throwing an error if it is not\n\
3. If id is null, creates the DOM element to match the expected type.",
    parameters: [
      {name: "id", type: "(String|Element)", description: "A vague reference to the element. Either a String id where the element can be had, a String id to give a newly created element if it does not exist, or an Element to manipulate and validate"},
      {name: "tag", type: "String", description: "The HTML tag name of the element we are finding/creating/validating."},
      {name: "DOMClass", type: "Class", description: "The class Function that is the type of element that we are frobnicating."}
    ],
    returns: "DOM element"
  } );
  DOM.cascadeElement = function ( id, tag, DOMClass ) {
    var elem = null;
    if ( id === null ) {
      elem = document.createElement( tag );
      elem.id = id = "auto_" + tag + Date.now();
    }
    else if ( DOMClass === undefined || id instanceof DOMClass ) {
      elem = id;
    }
    else if ( typeof ( id ) === "string" ) {
      elem = document.getElementById( id );
      if ( elem === null ) {
        elem = document.createElement( tag );
        elem.id = id;
      }
      else if ( elem.tagName !== tag.toUpperCase() ) {
        elem = null;
      }
    }

    if ( elem === null ) {
      pliny.error( {name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation."} );
      throw new Error( id + " does not refer to a valid " + tag + " element." );
    }
    else {
      elem.innerHTML = "";
    }
    return elem;
  };

  pliny.function( "Primrose.DOM", {
    name: "findEverything",
    description: "Searches an element for all sub elements that have a named ID, using that ID as the name of a field in a hashmap to store a reference to the element. Basically, a quick way to get at all the named elements in a page.\n\
\n\
NOTE: You may name your IDs pretty much anything you want, but for ease of use, you should name them in a camalCase fashion. See ref#[1].",
    parameters: [
      {name: "elem", type: "Element", description: "(Optional) the root element from which to search. Defaults to `document`."},
      {name: "obj", type: "Object", description: "(Optional) the object in which to store the element references. If no object is provided, one will be created."}
    ],
    returns: "An object full of element references, with fields named by the ID of the elements that were found.",
    references: [ {name: "CamelCase - Wikipedia, the free encyclopedia.", description: "https://en.wikipedia.org/wiki/CamelCase"} ],
    examples: [ {name: "Get all child elements.", description: "Assuming the following HTML snippet:\n``<div>\n  <div id=\"First\">first element</div>\n  <section id=\"second-elem\">\n    Second element\n    <img id=\"img1\" src=\"img.png\">\n  </section>\n</div>``\n\
\n\
Code:\n\
``var elems = Primrose.DOM.findEverything();\n\
console.log(elems.First.innerHTML);\n\
console.log(elems[\"second-elem\"].textContent);\n\
console.log(elems.img1.src);``\n\
Results:\n\
``first element\n\
Second element\n\
img.png``"} ]
  } );
  DOM.findEverything = function ( elem, obj ) {
    elem = elem || document;
    obj = obj || {};
    var arr = elem.querySelectorAll( "*" );
    for ( var i = 0; i < arr.length; ++i ) {
      var e = arr[i];
      if ( e.id && e.id.length > 0 ) {
        obj[e.id] = e;
        if ( e.parentElement ) {
          e.parentElement[e.id] = e;
        }
      }
    }
    return obj;
  };

  pliny.function( "Primrose.DOM", {
    name: "makeHidingContainer",
    description: "Takes an element and shoves it into a containing element that is 0x0 pixels in size, with the overflow hidden. Sometimes, we need an element like a TextArea in the DOM to be able to receive key events, but we don't want the user to see it, so the makeHidingContainer function makes it easy to make it disappear.",
    parameters: [
      {name: "id", type: "(String|Element)", description: "A vague reference to the element. Either a String id where the element can be had, a String id to give a newly created element if it does not exist, or an Element to manipulate and validate"},
      {name: "obj", type: "Element", description: "The child element to stow in the hiding container."}
    ],
    returns: "The hiding container element, not yet inserted into the DOM."
  } );
  DOM.makeHidingContainer = function ( id, obj ) {
    var elem = DOM.cascadeElement( id, "div", window.HTMLDivElement );
    elem.style.position = "absolute";
    elem.style.left = 0;
    elem.style.top = 0;
    elem.style.width = 0;
    elem.style.height = 0;
    elem.style.overflow = "hidden";
    elem.appendChild( obj );
    return elem;
  };

  return DOM;

} )();