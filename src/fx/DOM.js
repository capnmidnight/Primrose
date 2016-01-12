/* global Primrose, pliny */

Primrose.DOM = ( function () {

  pliny.theElder.namespace( "Primrose.DOM", "DOM manipulators" );
  var DOM = {};
  pliny.theElder.function( "Primrose.DOM", {
    name: "cascadeElement",
    description: "1) If id is a string, tries to find the DOM element that has said ID\n      a) if it exists, and it matches the expected tag type, returns the\n          element, or throws an error if validation fails.\n      b) if it doesn't exist, creates it and sets its ID to the provided\n          id, then returns the new DOM element, not yet placed in the\n          document anywhere.\n2) If id is a DOM element, validates that it is of the expected type,\n      a) returning the DOM element back if it's good,\n      b) or throwing an error if it is not\n3) If id is null, creates the DOM element to match the expected type.",
    parameters: [
      {name: "id", type: "(String|DOM element)", description: "A vague reference to the element. Either a String id where the element can be had, a String id to give a newly created element if it does not exist, or an Element to manipulate and validate"},
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
      pliny.theElder.error( {name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation."} );
      throw new Error( id + " does not refer to a valid " + tag +
          " element." );
    }
    else {
      elem.innerHTML = "";
    }
    return elem;
  };

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