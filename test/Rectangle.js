/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
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
define( function ( require ) {
  "use strict";

  var Assert = require( "./testing" ),
      Rectangle = require( "../src/Rectangle" );
  
  Rectangle.tests = {
    zero: function () {
      var p = new Rectangle();
      Assert.areEqual( 0, p.x, "x" );
      Assert.areEqual( 0, p.y, "y" );
      Assert.areEqual( 0, p.width, "width" );
      Assert.areEqual( 0, p.height, "height" );
      Assert.areEqual( 0, p.left, "left" );
      Assert.areEqual( 0, p.right, "right" );
      Assert.areEqual( 0, p.top, "top" );
      Assert.areEqual( 0, p.bottom, "bottom" );
    },
    new1: function () {
      var p = new Rectangle( 3, 5, 7, 11 );
      Assert.areEqual( 3, p.x, "x" );
      Assert.areEqual( 5, p.y, "y" );
      Assert.areEqual( 7, p.width, "width" );
      Assert.areEqual( 11, p.height, "height" );
      Assert.areEqual( 3, p.left, "left" );
      Assert.areEqual( 10, p.right, "right" );
      Assert.areEqual( 5, p.top, "top" );
      Assert.areEqual( 16, p.bottom, "bottom" );
    },
    set1: function () {
      var p = new Rectangle( 3, 5, 7, 11 );
      p.set( 13, 17, 19, 23 );
      Assert.areEqual( 13, p.x, "x" );
      Assert.areEqual( 17, p.y, "y" );
      Assert.areEqual( 19, p.width, "width" );
      Assert.areEqual( 23, p.height, "height" );
      Assert.areEqual( 13, p.left, "left" );
      Assert.areEqual( 32, p.right, "right" );
      Assert.areEqual( 17, p.top, "top" );
      Assert.areEqual( 40, p.bottom, "bottom" );
    },
    copy1: function () {
      var p = new Rectangle( 3, 5, 7, 11 );
      var q = new Rectangle( 13, 17, 19, 23 );
      p.copy( q );
      Assert.areEqual( 13, p.x, "x" );
      Assert.areEqual( 17, p.y, "y" );
      Assert.areEqual( 19, p.width, "width" );
      Assert.areEqual( 23, p.height, "height" );
      Assert.areEqual( 13, p.left, "left" );
      Assert.areEqual( 32, p.right, "right" );
      Assert.areEqual( 17, p.top, "top" );
      Assert.areEqual( 40, p.bottom, "bottom" );
    },
    clone1: function () {
      var p = new Rectangle( 13, 17, 19, 23 );
      var q = p.clone();
      Assert.areEqual( p.x, q.x, "x" );
      Assert.areEqual( p.y, q.y, "y" );
      Assert.areEqual( p.width, q.width, "width" );
      Assert.areEqual( p.height, q.height, "height" );
      Assert.areEqual( p.left, q.left, "left" );
      Assert.areEqual( p.right, q.right, "right" );
      Assert.areEqual( p.top, q.top, "top" );
      Assert.areEqual( p.bottom, q.bottom, "bottom" );
      Assert.areNotEqual( p, q );
    },
    toString1: function () {
      var p = new Rectangle( 29, 31, 37, 41 );
      Assert.areEqual( "[(x:29, y:31) x <w:37, h:41>]", p.toString() );
    }
  };
  return Rectangle;
} );