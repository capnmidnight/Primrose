( function () {
  function runProgramTest ( program, expectedOutput, inputQueue ) {
    var buffer = "";
    var isDone = false;
    var input = function ( callback ) {
      callback( inputQueue.shift() );
    };
    var output = function ( msg ) {
      buffer += msg;
    };
    var error = Assert.fail;
    var next = null;
    var done = function () {
      isDone = true;
    };

    var looper = Primrose.Text.Grammars.Basic.interpret( program, input, output,
        error, next, done );

    while ( !isDone ) {
      looper();
    }
    Assert.areEqual( expectedOutput, buffer );
  }

  Primrose.Text.Grammars.Basic.tests = {
    printingHello: function () {
      runProgramTest( "10 PRINT \"HELLO\"\n\
20 END", "HELLO\n" );
    },
    printingNumber: function () {
      runProgramTest( "10 PRINT 55\n\
20 END", "55\n" );
    },
    printingMath: function () {
      runProgramTest( "10 PRINT 5 + 7\n\
20 END", "12\n" );
    },
    printingVariable: function () {
      runProgramTest( "10 LET X = 5\n\
20 PRINT X\n\
30 END", "5\n" );
    },
    printingMathVariable: function () {
      runProgramTest( "10 LET X = 17 + 22\n\
20 PRINT X\n\
30 END", "39\n" );
    },
    gotoSkipsLine: function () {
      runProgramTest(
          "10 GOTO 30\n\
20 PRINT \"OH NO\"\n\
30 PRINT \"OH YES!\"\n\
40 END",
          "OH YES!\n" );
    },
    ifStatement: function () {
      runProgramTest(
          "10 LET X = 5\n\
20 IF X < 10 THEN PRINT \"OH YES\"\n\
30 IF X > 10 THEN PRINT \"OH NO!\" ELSE PRINT \"OKAY!\"\n\
40 END",
          "OH YES\nOKAY!\n" );
    },
    gotoLooping: function () {
      runProgramTest(
          "10 LET X = 0\n\
20 IF X >= 10 THEN GOTO 60\n\
30 PRINT X\n\
40 LET X = X + 1\n\
50 GOTO 20\n\
60 END",
          "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n" );
    },
    inputString: function () {
      runProgramTest(
          "10 INPUT X\n\
20 PRINT X\n\
30 END",
          "HELLO\n", [ "HELLO" ] );
    },
    inputNumber: function () {
      runProgramTest(
          "10 INPUT X\n\
20 PRINT X * 2\n\
30 END",
          "6\n", [ "3" ] );
    },
    inputStringWithPrompt: function () {
      runProgramTest(
          "10 INPUT \"VALUE: \", X\n\
20 PRINT X\n\
30 END",
          "VALUE: HELLO\n", [ "HELLO" ] );
    }
  };
} )();