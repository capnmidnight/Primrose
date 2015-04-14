/* global qp */

window.Primrose = window.Primrose || { };
window.Primrose.Size = (function ( ) {
  "use strict";
  
  function Size ( width, height ) {
    this.set( width || 0, height || 0 );
  }

  Size.prototype.set = function ( width, height ) {
    this.width = width;
    this.height = height;
  };

  Size.prototype.copy = function ( s ) {
    if ( s ) {
      this.width = s.width;
      this.height = s.height;
    }
  };

  Size.prototype.clone = function () {
    return new Size( this.width, this.height );
  };

  Size.prototype.toString = function () {
    return qp.fmt( "<w:$1, h:$2>", this.width, this.height );
  };

  return Size;
} )();