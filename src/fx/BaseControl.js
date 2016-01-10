/* global Primrose, THREE, pliny */

Primrose.BaseControl = ( function () {
  "use strict";

  var ID = 1;

  pliny.theElder.class( "Primrose", {
    name: "BaseControl",
    description: "The BaseControl class is the parent class for all 3D controls. It manages a unique ID for every new control, the focus state of the control, and performs basic conversions from DOM elements to the internal Control format."
  } );
  function BaseControl () {
    pliny.theElder.property( {
      name: "controlID",
      type: "Number",
      description: "Automatically incrementing counter for controls, to make sure there is a distinct differentiator between them all."
    } );
    this.controlID = ID++;

    pliny.theElder.property( {
      name: "focused",
      type: "Boolean",
      description: "Flag indicating this control has received focus. You should theoretically only read it."
    } );
    this.focused = false;

    pliny.theElder.property( {
      name: "listeners",
      type: "Object",
      description: "A bag of arrays that hold the callback functions for each event. The child class of BaseControl will add such arrays to this object."
    } );
    this.listeners = {};
  }

  pliny.theElder.method( "Primrose.BaseControl", {
    name: "focus",
    description: "Sets the focus property of the control, does not change the focus property of any other control."
  } );
  BaseControl.prototype.focus = function () {
    this.focused = true;
  };

  pliny.theElder.method( "Primrose.BaseControl", {
    name: "blur",
    description: "Unsets the focus property of the control, does not change the focus property of any other control."
  } );
  BaseControl.prototype.blur = function () {
    this.focused = false;
  };

  var NUMBER_PATTERN = "([+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+)))",
      TRANSLATE_PATTERN = new RegExp( "translate3d\\s*\\(\\s*" +
          NUMBER_PATTERN + "(?:em|px)\\s*,\\s*" +
          NUMBER_PATTERN + "(?:em|px)\\s*,\\s*" +
          NUMBER_PATTERN + "(?:em|px)\\s*\\)", "i" ),
      ROTATE_PATTERN = new RegExp( "rotate3d\\s*\\(\\s*" +
          NUMBER_PATTERN + "\\s*,\\s*" +
          NUMBER_PATTERN + "\\s*,\\s*" +
          NUMBER_PATTERN + "\\s*,\\s*" +
          NUMBER_PATTERN + "rad\\s*\\)", "i" );


  pliny.theElder.method( "Primrose.BaseControl", {
    name: "copyElement",
    description: "Copies properties from a DOM element that the control is supposed to match.",
    parameters: [
      {name: "elem", type: "Element", description: "The element--e.g. a button or textarea--to copy."}
    ]
  } );
  BaseControl.prototype.copyElement = function ( elem ) {
    this.element = elem;
    if ( elem.style.transform ) {
      var match = TRANSLATE_PATTERN.exec( elem.style.transform );
      if ( match ) {
        this.position.set(
            parseFloat( match[1] ),
            parseFloat( match[2] ),
            parseFloat( match[3] ) );
      }
      match = ROTATE_PATTERN.exec( elem.style.transform );
      if ( match ) {
        this.quaternion.setFromAxisAngle(
            new THREE.Vector3().set(
            parseFloat( match[1] ),
            parseFloat( match[2] ),
            parseFloat( match[3] ) ),
            parseFloat( match[4] ) );
      }
    }
  };

  pliny.theElder.method( "Primrose.BaseControl", {
    name: "addEventListener",
    description: "Adding an event listener registers a function as being ready to receive events.",
    parameters: [
      {name: "evt", type: "String", description: "The name of the event for which we are listening."},
      {name: "thunk", type: "Function", description: "The callback to fire when the event occurs."}
    ]
  } );
  BaseControl.prototype.addEventListener = function ( event, func ) {
    if ( this.listeners[event] ) {
      this.listeners[event].push( func );
    }
  };

  return BaseControl;
} )();
