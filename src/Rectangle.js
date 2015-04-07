/*
 * Copyright (C) 2015 Sean
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var Rectangle = ( function () {
  "use strict";
  function Rectangle ( x, y, width, height ) {
    this.point = new Point( x, y );
    this.size = new Size( width, height );

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
    return fmt( "[$1 x $2]", this.point.toString(), this.size.toString() );
  };

  return Rectangle;
} )();