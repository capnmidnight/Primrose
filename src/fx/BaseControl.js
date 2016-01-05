/* global Primrose, THREE, pliny */
Primrose.BaseControl = ( function () {
  "use strict";

  var ID = 1;

  pliny.the.elder.class("Primrose.BaseControl", {
    description: "The BaseControl class is the parent class for all 3D controls. It manages a unique ID for every new control, the focus state of the control, and performs basic conversions from DOM elements to the internal Control format.",
    author: "Sean T. McBeth"
  });
  function BaseControl () {
    this.controlID = ID++;
    this.focused = false;
  }

  pliny.the.elder.method("Primrose.BaseControl.prototype.focus", {
    author: "Sean T. McBeth"
  });
  BaseControl.prototype.focus = function () {
    this.focused = true;
  };

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

  return BaseControl;
} )();
