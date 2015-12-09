/* global Primrose */
Primrose.Text.Control = ( function () {
  "use strict";

  var CONTROLS = [ ];

  function updateControls () {
    for ( var i = 0; i < CONTROLS.length; ++i ) {
      CONTROLS[i].render();
    }
    requestAnimationFrame( updateControls );
  }

  requestAnimationFrame( updateControls );

  function Control () {
    CONTROLS.push( this );
    this.controlID = CONTROLS.length;
    this.focused = false;
  }

  Control.prototype.render = function () {
  };

  Control.prototype.dispose = function () {
    for ( var i = CONTROLS.length - 1; i >= 0; --i ) {
      if ( CONTROLS[i] === this ) {
        CONTROLS.splice( i, 1 );
        break;
      }
    }
  };

  Control.prototype.focus = function () {
    for ( var i = 0; i < CONTROLS.length; ++i ) {
      var e = CONTROLS[i];
      if ( e !== this ) {
        e.blur();
      }
    }
    this.focused = true;
  };

  Control.prototype.blur = function () {
    this.focused = false;
  };

  return Control;
} )();
