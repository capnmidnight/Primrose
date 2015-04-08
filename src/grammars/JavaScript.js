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
define(function (require) {
  "use strict";
  var Grammar = require("../Grammar");
  return new Grammar("JavaScript", [
    ["newlines", /(?:\r\n|\r|\n)/],
    ["comments", /\/\/.*$/],
    ["startBlockComments", /\/\*/],
    ["endBlockComments", /\*\//],
    ["strings", /"(?:\\"|[^"])*"/],
    ["strings", /'(?:\\'|[^'])*'/],
    ["strings", /\/(?:\\\/|[^/])*\/\w*/],
    ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    ["keywords",
      /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
    ],
    ["functions", /(\w+)(?:\s*\()/],
    ["members", /(?:(?:\w+\.)+)(\w+)/]
  ]);
});