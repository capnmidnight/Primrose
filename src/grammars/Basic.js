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
    [ "operators", /(?:\+|-|\*|\/|=)/ ],
    [ "identifiers", /\w+/ ]
  ] );

  grammar.interpret = function ( sourceCode, input, output, error ) {
    var tokens = this.tokenize(sourceCode);
    var program = { };
    var lineNumbers = [ ];
    var lines = [];
    var currentLine = [];
    while(tokens.length > 0){
      var token = tokens.shift();
      if(token.type === "newlines"){
        lines.push(currentLine);
        currentLine = [];
      }
      else if(token.type !== "regular"){
        currentLine.push(token);
      }
    }
    lines.push(currentLine);

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
          lineNumber = lineNumber.value;
          lineNumbers.push( lineNumber );
          program[lineNumber] = line;
        }
      }
    }

    var state = { };
    var counter = 0;

    function getLine () {
      var lineNumber = lineNumbers[counter];
      return program[lineNumber];
    }

    function evaluate ( line ) {
      with ( state ) {
        return eval( line.map( function ( token ) {
          return token.value;
        } )
            .join( " " ) );
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

    var commands = {
      LET: setValue,
      PRINT: print

          //|DATA|IF|THEN|ELSE|FOR|TO|STEP|NEXT|WHILE|WEND|REPEAT|UNTIL|GOTO|GOSUB|RETURN|ON|DEF FN|INPUT|TAB|AT|END
    };

    var line = getLine();
    while ( line.length !== 1 || line[0].type !== "keywords" ||
        line[0].value !== "END" ) {
      var op = line.shift();
      if ( !op ) {
        error( "Blank lines are not allowed" );
      }
      else if ( op.type !== "keywords" ) {
        error( "The first operation in a line must be a keyword. >>> " +
            op.value );
      }
      else {
        if ( commands.hasOwnProperty( op.value ) ) {
          commands[op.value]( line );
        }
        else {
          error( "Unknown command. >>> " + op.value );
        }
      }
      ++counter;
      line = getLine();
    }
  };

  return grammar;
} )();