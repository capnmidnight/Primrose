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
  return function rosetta_24_game () {

    //////////////////////////////////////////////////////////////////
    // copied from: http://rosettacode.org/wiki/24_game#JavaScript  //
    //////////////////////////////////////////////////////////////////

    function twentyfour ( numbers, input ) {
      var invalidChars = /[^\d\+\*\/\s-\(\)]/;

      var validNums = function ( str ) {
        // Create a duplicate of our input numbers, so that
        // both lists will be sorted.
        var mnums = numbers.slice();
        mnums.sort();

        // Sort after mapping to numbers, to make comparisons valid.
        return str.replace( /[^\d\s]/g, " " )
            .trim()
            .split( /\s+/ )
            .map( function ( n ) {
              return parseInt( n, 10 );
            } )
            .sort()
            .every( function ( v, i ) {
              return v === mnums[i];
            } );
      };

      var validEval = function ( input ) {
        try {
          return eval( input );
        } catch ( e ) {
          return { error: e.toString() };
        }
      };

      if ( input.trim() === "" )
        return "You must enter a value.";
      if ( input.match( invalidChars ) )
        return "Invalid chars used, try again. Use only:\n + - * / ( )";
      if ( !validNums( input ) )
        return "Wrong numbers used, try again.";
      var calc = validEval( input );
      if ( typeof calc !== 'number' )
        return "That is not a valid input; please try again.";
      if ( calc !== 24 )
        return "Wrong answer: " + String( calc ) + "; please try again.";
      return input + " == 24.  Congratulations!";
    }
    ;

// I/O below.

    while ( true ) {
      var numbers = [ 1, 2, 3, 4 ].map( function () {
        return Math.floor( Math.random() * 8 + 1 );
      } );

      var input = prompt(
          "Your numbers are:\n" + numbers.join( " " ) +
          "\nEnter expression. (use only + - * / and parens).\n",
          +"'x' to exit.", "" );

      if ( input === 'x' ) {
        break;
      }
      alert( twentyfour( numbers, input ) );
    }
  }
} );