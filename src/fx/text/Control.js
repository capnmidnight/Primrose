/* global Primrose */
Primrose.Text.Control = ( function () {
  "use strict";

  var ID = 1;

  function Control () {
    this.controlID = ID++;
    this.focused = false;
  }

  Control.prototype.focus = function () {
    this.focused = true;
  };

  Control.prototype.blur = function () {
    this.focused = false;
  };

  return Control;
} )();
