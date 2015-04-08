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

define(function(require){
  "use strict";

  function Rule ( name, test ) {
    this.name = name;
    this.test = test;
  }

  Rule.prototype.carveOutMatchedToken = function ( tokens, j ) {
    var token = tokens[j];
    if ( token.type === "regular" ) {
      var res = this.test.exec( token.value );
      if ( res ) {
        // Only use the last group that matches the regex, to allow for more
        // complex regexes that can match in special contexts, but not make
        // the context part of the token.
        var midx = res[res.length - 1];
        var start = res.index;
        // We skip the first record, because it's not a captured group, it's
        // just the entire matched text.
        for ( var k = 1; k < res.length - 1; ++k ) {
          start += res[k].length;
        }

        var end = start + midx.length;
        if ( start === 0 ) {
          // the rule matches the start of the token
          token.type = this.name;
          if ( end < token.value.length ) {
            // but not the end
            var next = token.splitAt( end );
            next.type = "regular";
            tokens.splice( j + 1, 0, next );
          }
        }
        else {
          // the rule matches from the middle of the token
          var mid = token.splitAt( start );
          if ( midx.length < mid.value.length ) {
            // but not the end
            var right = mid.splitAt( midx.length );
            tokens.splice( j + 1, 0, right );
          }
          mid.type = this.name;
          tokens.splice( j + 1, 0, mid );
        }
      }
    }
  };

  return Rule;
} );