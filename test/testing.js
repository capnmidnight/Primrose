/*
 * Copyright (C) 2014 - 2015 Sean T. McBeth <sean@seanmcbeth.com>
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

var Assert = ( function ( ) {
  "use strict";

  function getDifference ( expected, actual ) {
    return typeof ( expected ) !== "number"
        || typeof ( actual ) !== "number"
        || Math.abs( actual - expected )
        || ( Number.isNaN( expected )
            ^ Number.isNaN( actual ) );
  }

  function errr ( op, expected, actual, msg ) {
    return fmt( "$3(expected value) $1 $4 $2 (actual value)", expected, actual,
        msg ? "[" + msg + "] " : "", op );
  }

  function test ( func ) {
    if ( func.tests ) {
      var results = {
        success: { },
        failure: { },
        total: 0,
        failed: 0,
        succeeded: 0
      },
      exp;
      for ( var key in func.tests ) {
        if ( func.tests[key]
            && typeof ( func.tests[key] ) === "function" ) {
          var start = Date.now();
          ++results.total;
          try {
            func.tests[key]();
            ++results.succeeded;
            var end = Date.now();
            results.success[key] = { dt: ( end - start ) };
          }
          catch ( exp ) {
            ++results.failed;
            var end = Date.now();
            results.failure[key] = { dt: ( end - start ), msg: exp.message,
              stack: exp.stack || false };
          }
        }
      }
    }
    return results;
  }

  function displayTest ( func, log ) {
    if ( func && func.tests ) {
      var result = test( func ),
          nameMatch = /function (\w+)\(/,
          matches = func.toString()
          .match( nameMatch ),
          name = matches && matches[1],
          beam = "";
      for ( var i = 0; i < result.total; ++i ) {
        beam += i < result.succeeded
            ? "o"
            : "x";
      }

      log( fmt( "Test results for $1: [$2]\n\n$3 succeeded, $4 failed",
          name,
          beam, result.succeeded, result.failed ) );

      if ( result.succeeded > 0 ) {
        log( "\n    Successes:" );
        for ( var key in result.success ) {
          if ( result.success[key] ) {
            log( fmt( "        $1 succeeded after $2ms", key,
                result.success[key].dt ) );
          }
        }
      }

      if ( result.failed > 0 ) {
        log( "\n    Failures:" );
        for ( var key in result.failure ) {
          if ( result.failure[key] ) {
            var val = result.failure[key];
            log( fmt( "        $1 FAILED after $2ms: $3", key, val.dt,
                val.msg ) );
            if ( val.stack && val.stack.indexOf( "at Object.Assert" ) ===
                -1 ) {
              log( fmt( "        $1", val.stack ) );
            }
          }
        }
      }
    }
  }

  var Assert = {
    ALPHA: 0.0000000000001,
    fail: function ( msg ) {
      throw new Error( errr( msg ) );
    },
    areEqual: function ( expected, actual, msg ) {
      if ( expected !== actual && getDifference( expected, actual ) >=
          Assert.ALPHA ) {
        throw new Error( errr( "!=", expected, actual, msg ) );
      }
    },
    areNotEqual: function ( expected, actual, msg ) {
      if ( expected === actual || getDifference( expected, actual ) <
          Assert.ALPHA ) {
        throw new Error( errr( "==", expected, actual, msg ) );
      }
    },
    throwsError: function ( thunk ) {
      var errored;
      try {
        thunk();
        errored = false;
      }
      catch ( exp ) {
        errored = true;
      }
      if ( !errored ) {
        throw new Error( "Excpected an error but there was none" );
      }
    },
    isNotNull: function ( obj, msg ) {
      if ( obj === null || obj === undefined ) {
        throw new Error( ( msg ? "[" + msg + "] " : "" ) + "object was null" );
      }
    },
    consoleTest: function ( func ) {
      if ( func instanceof Array ) {
        func.forEach( Assert.consoleTest );
      }
      else {
        displayTest( func, console.log.bind( console ) );
      }
    },
    stringTest: function ( func ) {
      if ( func instanceof Array ) {
        return func.map( Assert.stringTest )
            .join(
                "\n===---===---===---===---===---===---===---===---===---===\n\n" );
      }
      else {
        var accum = "";
        var log = function ( txt ) {
          accum += txt + "\n";
        };
        displayTest( func, log );
        return accum;
      }
    }
  };

  return Assert;
} )();