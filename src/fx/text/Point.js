/* global qp, Primrose */

Primrose.Text.Point = ( function ( ) {
  "use strict";

  function Point ( x, y ) {
    this.set( x || 0, y || 0 );
  }

  Point.prototype.set = function ( x, y ) {
    this.x = x;
    this.y = y;
  };

  Point.prototype.copy = function ( p ) {
    if ( p ) {
      this.x = p.x;
      this.y = p.y;
    }
  };

  Point.prototype.clone = function () {
    return new Point( this.x, this.y );
  };

  Point.prototype.toString = function () {
    return "(x:" + this.x + ", y:" + this.y + ")";
  };

  return Point;
} )();

pliny.issue( "Primrose.Text.Point", {
  name: "document Point",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Point](#Primrose_Text_Point) class in the text/ directory"
} );
