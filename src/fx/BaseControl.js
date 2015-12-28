/* global Primrose, THREE */
Primrose.BaseControl = ( function () {
  "use strict";

  var ID = 1;

  function BaseControl () {
    this.controlID = ID++;
    this.focused = false;
  }

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
