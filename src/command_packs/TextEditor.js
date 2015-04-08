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


// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
define(function (require) {
  "use strict";
  var Commands = require("../Commands");
  Commands.TextEditor = {
    name: "Basic commands",
    NORMAL_SPACEBAR: " ",
    SHIFT_SPACEBAR: " ",
    NORMAL_BACKSPACE: function (prim, tokenRows) {
      if (prim.frontCursor.i === prim.backCursor.i) {
        prim.frontCursor.left(tokenRows);
      }
      prim.overwriteText();
      prim.scrollIntoView(prim.frontCursor);
    },
    NORMAL_ENTER: function (prim, tokenRows) {
      var indent = "";
      var tokenRow = tokenRows[prim.frontCursor.y];
      if (tokenRow.length > 0 && tokenRow[0].type === "whitespace") {
        indent = tokenRow[0].value;
      }
      prim.overwriteText("\n" + indent);
      prim.scrollIntoView(prim.frontCursor);
    },
    NORMAL_DELETE: function (prim, tokenRows) {
      if (prim.frontCursor.i === prim.backCursor.i) {
        prim.backCursor.right(tokenRows);
      }
      prim.overwriteText();
      prim.scrollIntoView(prim.frontCursor);
    },
    SHIFT_DELETE: function (prim, tokenRows) {
      if (prim.frontCursor.i === prim.backCursor.i) {
        prim.frontCursor.home(tokenRows);
        prim.backCursor.end(tokenRows);
      }
      prim.overwriteText();
      prim.scrollIntoView(prim.frontCursor);
    },
    NORMAL_TAB: function (prim, tokenRows) {
      var ts = prim.getTabString();
      prim.overwriteText(ts);
    }
  };

  return Commands;
});