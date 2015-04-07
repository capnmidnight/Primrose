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

Point.tests = {
  zero: function () {
    var p = new Point();
    Assert.areEqual( 0, p.x, "x" );
    Assert.areEqual( 0, p.y, "y" );
  },
  new1: function () {
    var p = new Point( 3, 5 );
    Assert.areEqual( 3, p.x, "x" );
    Assert.areEqual( 5, p.y, "y" );
  },
  set1: function () {
    var p = new Point( 3, 5 );
    p.set( 7, 11 );
    Assert.areEqual( 7, p.x, "x" );
    Assert.areEqual( 11, p.y, "y" );
  },
  copy1: function () {
    var p = new Point( 3, 5 );
    var q = new Point( 7, 11 );
    p.copy( q );
    Assert.areEqual( 7, p.x, "x" );
    Assert.areEqual( 11, p.y, "y" );
  },
  clone1: function () {
    var p = new Point( 13, 17 );
    var q = p.clone();
    Assert.areEqual( p.x, q.x, "x" );
    Assert.areEqual( p.y, q.y, "y" );
    Assert.areNotEqual( p, q );
  },
  toString1: function () {
    var p = new Point( 13, 17 );
    Assert.areEqual( "(x:13, y:17)", p.toString() );
  }
};