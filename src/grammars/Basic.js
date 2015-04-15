window.Primrose = window.Primrose || { };
window.Primrose.Grammars = window.Primrose.Grammars || { };
window.Primrose.Grammars.Basic = ( function () {

  var grammar = new Primrose.Grammar( "BASIC", [
    [ "newlines", /(?:\r\n|\r|\n)/ ],
    [ "lineNumbers", /^\d+ / ],
    [ "comments", /^REM.*$/ ],
    [ "strings", /'(?:\\'|[^'])*'/ ],
    [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
    [ "keywords",
      /\b(?:LET|DATA|READ|IF|THEN|ELSE|FOR|TO|STEP|NEXT|WHILE|WEND|REPEAT|UNTIL|GOTO|GOSUB|RETURN|ON|DEF FN|TAB|AT|END)\b/
    ],
    [ "functions", /(?:PRINT(?:LN)?|INPUT)/ ],
    [ "operators", /(?:\+|-|\*|\/|>=|<=|=|<|>|OR|AND|NOT|MOD|\(|\))/ ],
    [ "identifiers", /\w+/ ]
  ] );

  var oldTokenize = grammar.tokenize;
  grammar.tokenize = function ( code ) {
    return oldTokenize.call( this, code.toUpperCase() );
  };

  grammar.interpret = function ( sourceCode, input, output, error, next,
      done ) {
    var tokens = this.tokenize( sourceCode ),
        program = { },
        lineNumbers = [ ],
        lines = [ ],
        currentLine = [ ],
        state = { },
        counter = 0,
        isDone = false;

    while ( tokens.length > 0 ) {
      var token = tokens.shift();
      if ( token.type === "newlines" ) {
        lines.push( currentLine );
        currentLine = [ ];
      }
      else if ( token.type !== "regular" && token.type !== "comments" ) {
        if ( token.value === "OR" ) {
          token.value = "||";
        }
        else if ( token.value === "AND" ) {
          token.value = "&&";
        }
        else if ( token.value === "NOT" ) {
          token.value = "!";
        }
        else if ( token.value === "MOD" ) {
          token.value = "%";
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

    function getLine () {
      var lineNumber = lineNumbers[counter];
      return lineNumber && program[lineNumber] && program[lineNumber].slice();
    }

    function evaluate ( line ) {
      var script = line.map( function ( token ) {
        return token.value;
      } )
          .join( " " );
      with ( state ) {
        try {
          return eval( script );
        }
        catch ( exp ) {
          console.error( exp.message );
          console.error( script );
        }
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

      return true;
    }

    function print ( line ) {
      output( evaluate( line ) );

      return true;
    }

    function println ( line ) {
      output( evaluate( line ) + "\n" );

      return true;
    }

    function setProgramCounter ( line ) {
      var lineNumber = parseFloat( evaluate( line ) );
      counter = -1;

      while ( counter < lineNumbers.length - 1 &&
          lineNumbers[counter + 1] < lineNumber ) {
        ++counter;
      }

      return true;
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
        for ( var i = 0; i < condition.length; ++i ) {
          var t = condition[i];
          if ( t.type === "operators" && t.value === "=" ) {
            t.value = "==";
          }
        }
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
          return process( thenClause );
        }
        else if ( elseClause ) {
          return process( elseClause );
        }
      }

      return true;
    }

    function process ( line ) {
      var op = line.shift();
      if ( !op ) {
        error( "Blank lines are not allowed" );
      }
      else if ( op.type !== "keywords" && op.type !== "functions" ) {
        error( "The first operation in a line must be a keyword. >>> " +
            op.value + " (" + op.type + ")" );
      }
      else {
        if ( commands.hasOwnProperty( op.value ) ) {
          return commands[op.value]( line );
        }
        else {
          error( "Unknown command. >>> " + op.value );
        }
      }
      return programComplete();
    }

    function waitForInput ( line ) {
      if ( line.length > 1 && line[0].type === "strings" ) {
        var promptText = line.shift();
        var txt = promptText.value;
        txt = txt.substring( 1, txt.length - 1 );
        output( txt );
      }
      input( function ( str ) {
        var valueToken = null;
        if ( /-?\d+(\.\d+)?/.test( str ) ) {
          valueToken = { type: "numbers", value: str };
        }
        else {
          valueToken = { type: "strings", value: "\"" + str + "\"" };
        }
        setValue( [ line[0], { type: "operators", value: "=" }, valueToken ] );
        if ( next ) {
          next();
        }
      } );

      return false;
    }

    function programComplete () {
      isDone = true;
      if ( done ) {
        done();
      }
      return false;
    }

    function noop () {
      return true;
    }

    var commands = {
      LET: setValue,
      PRINT: print,
      PRINTLN: println,
      GOTO: setProgramCounter,
      IF: checkConditional,
      INPUT: waitForInput,
      END: programComplete,
      REM: noop
          //|DATA|FOR|TO|STEP|NEXT|WHILE|WEND|REPEAT|UNTIL|GOSUB|RETURN|ON|DEF FN|TAB|AT|END
    };

    return function () {
      if ( !isDone ) {
        var goNext = process( getLine() );
        ++counter;
        if ( goNext && next ) {
          next();
        }
      }
    };
  };

  return grammar;
} )();