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
  var Themes = require( "../Themes" );

  Themes.Dark = {
    name: "Dark",
    fontFamily: "monospace",
    cursorColor: "white",
    fontSize: 14,
    regular: {
      backColor: "black",
      foreColor: "#c0c0c0",
      currentRowBackColor: "#202020",
      selectedBackColor: "#404040"
    },
    strings: {
      foreColor: "#aa9900",
      fontStyle: "italic"
    },
    numbers: {
      foreColor: "green"
    },
    comments: {
      foreColor: "yellow",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "cyan"
    },
    functions: {
      foreColor: "brown",
      fontWeight: "bold"
    },
    members: {
      foreColor: "green"
    },
    error: {
      foreColor: "red",
      fontStyle: "underline italic"
    }
  };
  return Themes;
} );