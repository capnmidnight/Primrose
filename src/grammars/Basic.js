window.Primrose = window.Primrose || { };
window.Primrose.Grammars = window.Primrose.Grammars || { };
window.Primrose.Grammars.Basic = ( function () {

  var grammar = new Primrose.Grammar( "BASIC", [
    [ "newlines", /(?:\r\n|\r|\n)/ ],
    [ "lineNumbers", /^\d+ / ],
    [ "comments", /^REM.*$/ ],
    [ "strings", /"(?:\\"|[^"])*"/ ],
    [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
    [ "keywords",
      /\b(?:LET|DATA|READ|IF|THEN|ELSE|FOR|TO|STEP|NEXT|WHILE|WEND|REPEAT|UNTIL|GOTO|GOSUB|RETURN|ON|DEF FN|PRINT|INPUT|TAB|AT|END)\b/
    ],
    [ "operators", /(?:\+|-|\*|\/|>=|<=|=|<|>|OR|AND|NOT)/ ],
    [ "identifiers", /\w+/ ]
  ] );

  grammar.interpret = function ( sourceCode, input, output, error ) {
    var tokens = this.tokenize( sourceCode );
    var program = { };
    var lineNumbers = [ ];
    var lines = [ ];
    var currentLine = [ ];
    while ( tokens.length > 0 ) {
      var token = tokens.shift();
      if ( token.type === "newlines" ) {
        lines.push( currentLine );
        currentLine = [ ];
      }
      else if ( token.type !== "regular" ) {
        if ( token.value === "OR" ) {
          token.value = "||";
        }
        else if ( token.value === "AND" ) {
          token.value = "&&";
        }
        else if ( token.value === "NOT" ) {
          token.value = "!";
        }
        currentLine.push( token );
      }
    }
    lines.push( currentLine );

    for ( var i = 0; i < lines.length; ++i ) {
      var line = lines[i];
      if ( line.length > 0 ) {
        var lineNumber = line.shift();
        if ( lineNumber.type !== "lineNumbers" ) {
          error( "All lines must start with a line number. >>> " +
              lineNumber.value );
          break;
        }
        else {
          lineNumber = parseFloat( lineNumber.value );
          lineNumbers.push( lineNumber );
          program[lineNumber] = line;
        }
      }
    }

    var state = { };
    var counter = 0;

    function getLine () {
      var lineNumber = lineNumbers[counter];
      return program[lineNumber].slice();
    }

    function evaluate ( line ) {
      with ( state ) {
        var script = line.map( function ( token ) {
          return token.value;
        } )
            .join( " " );
        return eval( script );
      }
    }

    function setValue ( line ) {
      var name = line.shift();
      var equals = line.shift();
      if ( name.type !== "identifiers" ) {
        error( "Identifier expected. >>> " + name.value );
      }
      else if ( equals.type !== "operators" && equals.value !== "=" ) {
        error( "Expected equals sign. >>> " + equals.value );
      }
      else {
        state[name.value] = evaluate( line );
      }
    }

    function print ( line ) {
      output( evaluate( line ) );
    }

    function setProgramCounter ( line ) {
      var lineNumber = parseFloat( evaluate( line ) );
      counter = -1;

      while ( counter < lineNumbers.length - 1 &&
          lineNumbers[counter + 1] < lineNumber ) {
        ++counter;
      }
    }

    function checkConditional ( line ) {
      var thenIndex = -1,
          elseIndex = -1;
      for ( var i = 0; i < line.length; ++i ) {
        if ( line[i].type === "keywords" && line[i].value === "THEN" ) {
          thenIndex = i;
        }
        else if ( line[i].type === "keywords" && line[i].value === "ELSE" ) {
          elseIndex = i;
        }
      }
      if ( thenIndex === -1 ) {
        error( "BLBHBALBHA" );
      }
      else {
        var condition = line.slice( 0, thenIndex );
        var thenClause,
            elseClause;
        if ( elseIndex === -1 ) {
          thenClause = line.slice( thenIndex + 1 );
        }
        else {
          thenClause = line.slice( thenIndex + 1, elseIndex );
          elseClause = line.slice( elseIndex + 1 );
        }
        if ( evaluate( condition ) ) {
          process( thenClause );
        }
        else if ( elseClause ) {
          process( elseClause );
        }
      }
    }

    function process ( line ) {
      var op = line.shift();
      if ( !op ) {
        error( "Blank lines are not allowed" );
      }
      else if ( op.type !== "keywords" ) {
        error( "The first operation in a line must be a keyword. >>> " +
            op.value + " (" + op.type + ")" );
      }
      else {
        if ( commands.hasOwnProperty( op.value ) ) {
          commands[op.value]( line );
        }
        else {
          error( "Unknown command. >>> " + op.value );
        }
      }
    }

    function isEndOfProgram () {
      var line = getLine();
      return counter >= lineNumbers.length ||
          ( line.length === 1 &&
              line[0].type === "keywords" &&
              line[0].value === "END" );
    }

    var commands = {
      LET: setValue,
      PRINT: print,
      GOTO: setProgramCounter,
      IF: checkConditional
          //|DATA|FOR|TO|STEP|NEXT|WHILE|WEND|REPEAT|UNTIL|GOSUB|RETURN|ON|DEF FN|INPUT|TAB|AT|END
    };

    var line = getLine();
    while ( !isEndOfProgram() ) {
      process( line );
      ++counter;
      line = getLine();
    }
  };

  return grammar;
} )();