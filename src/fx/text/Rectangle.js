/* global qp, Primrose, pliny */

Primrose.Text.Rectangle = ( function ( ) {
  "use strict";

  pliny.class({
    parent: "Primrose.Text",
    name: "Rectangle",
    description: "| [under construction]"
  } );
  function Rectangle ( x, y, width, height ) {
    this.point = new Primrose.Text.Point( x, y );
    this.size = new Primrose.Text.Size( width, height );

    Object.defineProperties( this, {
      x: {
        get: function () {
          return this.point.x;
        },
        set: function ( x ) {
          this.point.x = x;
        }
      },
      left: {
        get: function () {
          return this.point.x;
        },
        set: function ( x ) {
          this.point.x = x;
        }
      },
      width: {
        get: function () {
          return this.size.width;
        },
        set: function ( width ) {
          this.size.width = width;
        }
      },
      right: {
        get: function () {
          return this.point.x + this.size.width;
        },
        set: function ( right ) {
          this.point.x = right - this.size.width;
        }
      },
      y: {
        get: function () {
          return this.point.y;
        },
        set: function ( y ) {
          this.point.y = y;
        }
      },
      top: {
        get: function () {
          return this.point.y;
        },
        set: function ( y ) {
          this.point.y = y;
        }
      },
      height: {
        get: function () {
          return this.size.height;
        },
        set: function ( height ) {
          this.size.height = height;
        }
      },
      bottom: {
        get: function () {
          return this.point.y + this.size.height;
        },
        set: function ( bottom ) {
          this.point.y = bottom - this.size.height;
        }
      }
    } );
  }

  Rectangle.prototype.set = function ( x, y, width, height ) {
    this.point.set( x, y );
    this.size.set( width, height );
  };

  Rectangle.prototype.copy = function ( r ) {
    if ( r ) {
      this.point.copy( r.point );
      this.size.copy( r.size );
    }
  };

  Rectangle.prototype.clone = function () {
    return new Rectangle( this.point.x, this.point.y, this.size.width,
        this.size.height );
  };

  Rectangle.prototype.toString = function () {
    return "[" + this.point.toString() + " x " + this.size.toString() + "]";
  };

  return Rectangle;
} )();

pliny.issue({
  parent: "Primrose.Text.Rectangle",
  name: "document Rectangle",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Rectangle](#Primrose_Text_Rectangle) class in the text/ directory"
} );
