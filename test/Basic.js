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

/* global Primose, Assert */
( function () {
  function runProgramTest ( program, expectedOutput ) {
    var input = null;
    var buffer = "";
    var output = function ( msg ) {
      console.log(msg);
      if ( buffer.length > 0 ) {
        buffer += "\n";
      }
      buffer += msg;
    };
    var error = Assert.fail;
    Primrose.Grammars.Basic.interpret( program, input, output, error );
    Assert.areEqual( expectedOutput, buffer );
  }

  Primrose.Grammars.Basic.tests = {
    printingHello: function () {
      runProgramTest("10 PRINT \"HELLO\"\n\
20 END", "HELLO");
    },
    printingNumber: function () {
      runProgramTest("10 PRINT 55\n\
20 END", "55");
    },
    printingMath: function () {
      runProgramTest("10 PRINT 5 + 7\n\
20 END", "12");
    },
    printingVariable: function () {
      runProgramTest("10 LET X = 5\n\
20 PRINT X\n\
30 END", "5");
    },
    printingMathVariable: function () {
      runProgramTest("10 LET X = 17 + 22\n\
20 PRINT X\n\
30 END", "5");
    }
  };
} )();