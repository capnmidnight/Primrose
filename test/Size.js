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

Size.tests = {
  zero: function () {
    var p = new Size();
    Assert.areEqual( 0, p.width, "width" );
    Assert.areEqual( 0, p.height, "height" );
  },
  new1: function () {
    var p = new Size( 3, 5 );
    Assert.areEqual( 3, p.width, "width" );
    Assert.areEqual( 5, p.height, "height" );
  },
  set1: function () {
    var p = new Size( 3, 5 );
    p.set( 7, 11 );
    Assert.areEqual( 7, p.width, "width" );
    Assert.areEqual( 11, p.height, "height" );
  },
  copy1: function () {
    var p = new Size( 3, 5 );
    var q = new Size( 7, 11 );
    p.copy( q );
    Assert.areEqual( 7, p.width, "width" );
    Assert.areEqual( 11, p.height, "height" );
  },
  clone1: function () {
    var p = new Size( 13, 17 );
    var q = p.clone();
    Assert.areEqual( p.width, q.width, "width" );
    Assert.areEqual( p.height, q.height, "height" );
    Assert.areNotEqual( p, q );
  },
  toString1: function () {
    var p = new Size( 13, 17 );
    Assert.areEqual( "<w:13, h:17>", p.toString() );
  }
};