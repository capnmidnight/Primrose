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

function Grammar ( name, grammar ) {
  "use strict";
  this.name = name;
  // clone the preprocessing grammar to start a new grammar
  this.grammar = grammar.map( function ( rule ) {
    return new Rule( rule[0], rule[1] );
  } );

  function crudeParsing ( tokens ) {
    var blockOn = false,
        line = 0;
    for ( var i = 0; i < tokens.length; ++i ) {
      var t = tokens[i];
      t.line = line;
      if ( t.type === "newlines" ) {
        ++line;
      }

      if ( blockOn ) {
        if ( t.type === "endBlockComments" ) {
          blockOn = false;
        }
        if ( t.type !== "newlines" ) {
          t.type = "comments";
        }
      }
      else if ( t.type === "startBlockComments" ) {
        blockOn = true;
        t.type = "comments";
      }
    }
  }

  this.tokenize = function ( text ) {
    // all text starts off as regular text, then gets cut up into tokens of
    // more specific type
    var tokens = [ new Token( text, "regular", 0 ) ];
    for ( var i = 0; i < this.grammar.length; ++i ) {
      var rule = this.grammar[i];
      for ( var j = 0; j < tokens.length; ++j ) {
        rule.carveOutMatchedToken( tokens, j );
      }
    }

    crudeParsing( tokens );
    return tokens;
  };
}