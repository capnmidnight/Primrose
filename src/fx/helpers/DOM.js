////
// 1) If id is a string, tries to find the DOM element that has said ID
//      a) if it exists, and it matches the expected tag type, returns the
//          element, or throws an error if validation fails.
//      b) if it doesn't exist, creates it and sets its ID to the provided
//          id, then returns the new DOM element, not yet placed in the
//          document anywhere.
// 2) If id is a DOM element, validates that it is of the expected type,
//      a) returning the DOM element back if it's good,
//      b) or throwing an error if it is not
// 3) If id is null, creates the DOM element to match the expected type.
// @param {string|DOM element|null} id
// @param {string} tag name
// @param {function} DOMclass
// @returns DOM element
///
function cascadeElement ( id, tag, DOMClass ) {
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
    throw new Error( id + " does not refer to a valid " + tag +
        " element." );
  }
  else {
    elem.innerHTML = "";
  }
  return elem;
}

function findEverything ( elem, obj ) {
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
}

function makeHidingContainer ( id, obj ) {
  var elem = cascadeElement( id, "div", window.HTMLDivElement );
  elem.style.position = "absolute";
  elem.style.left = 0;
  elem.style.top = 0;
  elem.style.width = 0;
  elem.style.height = 0;
  elem.style.overflow = "hidden";
  elem.appendChild( obj );
  return elem;
}



function makeSelectorFromObj ( id, obj, def, target, prop, lbl, filter ) {
  var elem = cascadeElement( id, "select", window.HTMLSelectElement );
  var items = [ ];
  for ( var key in obj ) {
    if ( obj.hasOwnProperty( key ) ) {
      var val = obj[key];
      if ( !filter || val instanceof filter ) {
        val = val.name || key;
        var opt = document.createElement( "option" );
        opt.innerHTML = val;
        items.push( obj[key] );
        if ( val === def ) {
          opt.selected = "selected";
        }
        elem.appendChild( opt );
      }
    }
  }

  if ( typeof target[prop] === "function" ) {
    elem.addEventListener( "change", function () {
      target[prop]( items[elem.selectedIndex] );
    } );
  }
  else {
    elem.addEventListener( "change", function () {
      target[prop] = items[elem.selectedIndex];
    } );
  }

  var container = cascadeElement( "container -" + id, "div",
      window.HTMLDivElement );
  var label = cascadeElement( "label-" + id, "span",
      window.HTMLSpanElement );
  label.innerHTML = lbl + ": ";
  label.for = elem;
  elem.title = lbl;
  elem.alt = lbl;
  container.appendChild( label );
  container.appendChild( elem );
  return container;
}
