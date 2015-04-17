window.Primrose = window.Primrose || { };
window.Primrose.Grammars = window.Primrose.Grammars || { };
window.Primrose.Grammars.Basic = ( function ( ) {

  var grammar = new Primrose.Grammar( "BASIC", [
    [ "newlines", /(?:\r\n|\r|\n)/ ],
    [ "lineNumbers", /^\d+/ ],
    [ "comments", /^ REM.*$/ ],
    [ "strings", /"(?:\\"|[^"])*"/ ],
    [ "strings", /'(?:\\'|[^'])*'/ ],
    [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
    [ "keywords",
      /\b(?:RESTORE|REPEAT|RETURN|LOAD|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|DEF FN|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK)\b/
    ],
    [ "operators",
      /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
    ],
    [ "identifiers", /\w+\$?/ ]
  ] );

  var oldTokenize = grammar.tokenize;
  grammar.tokenize = function ( code ) {
    return oldTokenize.call( this, code.toUpperCase( ) );
  };

  grammar.interpret = function ( sourceCode, input, output, errorOut, next,
      clearScreen, loadFile, done ) {
    var tokens = this.tokenize( sourceCode ),
        EQUAL_SIGN = new Primrose.Token( "=", "operators" ),
        counter = 0,
        isDone = false,
        program = { },
        lineNumbers = [ ],
        lines = [ ],
        currentLine = [ ],
        data = [ ],
        dataCounter = 0,
        state = {
          INT: function ( v ) {
            return Math.floor( parseFloat( v ) );
          },
          RND: function ( v ) {
            return Math.random( );
          },
          CLK: function ( ) {
            return Date.now( ) / 3600000;
          },
          LINE: function ( ) {
            return lineNumbers[counter];
          },
          TAB: function ( v ) {
            var str = "";
            for ( var i = 0; i < v; ++i ) {
              str += " ";
            }
            return str;
          },
          POW: function ( a, b ) {
            return Math.pow( a, b );
          }
        };

    function toNum ( ln ) {
      return new Primrose.Token( ln, "numbers" );
    }

    function toStr ( str ) {
      return new Primrose.Token( "\"" + str.replace( "\n", "\\n" )
          .replace( "\"", "\\\"" ) + "\"", "strings" );
    }

    var tokenMap = {
      "OR": "||",
      "AND": "&&",
      "NOT": "!",
      "MOD": "%",
      "<>": "!="
    };

    while ( tokens.length > 0 ) {
      var token = tokens.shift( );
      if ( token.type === "newlines" ) {
        lines.push( currentLine );
        currentLine = [ ];
      }
      else if ( token.type !== "regular" && token.type !== "comments" ) {
        token.value = tokenMap[token.value] || token.value;

        if ( token.type === "identifiers" &&
            token.value[token.value.length - 1] === "$" &&
            tokens[0].type === "operators" &&
            tokens[0].value === "(" ) {
          tokens[0].value = "[";
          for ( var j = 1; j < tokens.length; ++j ) {
            if ( tokens[j].type === "operators" && tokens[j].value ===
                ")" ) {
              tokens[j].value = "]";
              break;
            }
          }
        }

        currentLine.push( token );
      }
    }

    lines.push( currentLine );
    for ( var i = 0; i < lines.length; ++i ) {
      var line = lines[i];
      if ( line.length > 0 ) {
        var lineNumber = line.shift( );
        if ( lineNumber.type !== "lineNumbers" ) {
          error( "All lines must start with a line number. >>> " + line.join(
              ", " ) );
          break;
        }
        else {
          lineNumber = parseFloat( lineNumber.value );
          var lastLine = lineNumbers[lineNumbers.length - 1];
          if ( !lastLine || lineNumber > lastLine ) {
            lineNumbers.push( lineNumber );
            program[lineNumber] = line;
          }
          else {
            throw new Error( "expected line number greater than " + lastLine +
                ", but received " + lineNumber + "." );
          }
        }
      }
    }

    function error ( msg ) {
      errorOut( "At line " + lineNumbers[counter] + ": " + msg );
    }

    function getLine ( ) {
      var lineNumber = lineNumbers[counter];
      return lineNumber && program[lineNumber] &&
          program[lineNumber].slice( );
    }

    function evaluate ( line ) {
      var script = line.map( function ( token ) {
        return token.value;
      } )
          .join( " " ),
          exp;
      with ( state ) {
        try {
          return eval( script );
        }
        catch ( exp ) {
          console.debug( line.join( ", " ) );
          console.error( exp );
          console.error( script );
          error( exp.message + ": " + script );
        }
      }
    }

    function declareVariable ( line ) {
      var id = line.shift( );
      if ( id.type !== "identifiers" ) {
        error( "Identifier expected: " + id.value );
      }
      else {
        var val = null;
        id = id.value;
        if ( id[id.length - 1] === "$" ) {
          val = [ ];
          if ( line.length === 3 &&
              line[0].type === "operators" && line[0].value === "(" &&
              line[1].type === "numbers" &&
              line[2].type === "operators" && line[2].value === ")" ) {
            for ( var i = Math.floor( parseFloat( line[1].value ) ); i > 0;
                --i ) {
              val.push( null );
            }
          }
        }
        state[id] = val;
        return true;
      }
    }

    function setValue ( line ) {
      var name = line.shift( );
      var equals = line.shift( );
      if ( name.type !== "identifiers" ) {
        error( "Identifier expected. >>> " + name.value );
      }
      else if ( equals.type === "operators" && equals.value === "=" ) {
        state[name.value] = evaluate( line );
      }
      else if ( equals.type === "operators" && equals.value === "[" ) {
        var idxExpr = [ ];
        while ( line.length > 0 && line[0].type !== "operators" &&
            line[0].value !== "]" ) {
          idxExpr.push( line.shift( ) );
        }
        if ( line.length > 0 ) {
          line.shift( ); // burn the close paren
          equals = line.shift( );
          if ( equals.type === "operators" && equals.value === "=" ) {
            state[name.value][evaluate( idxExpr )] = evaluate( line );
          }
        }
      }
      else {
        error( "Expected equals sign. >>> " + equals.value );
      }

      return true;
    }

    function print ( line ) {
      var endLine = "\n";
      line.forEach( function ( t, i ) {
        if ( t.type === "operators" ) {
          if ( t.value === "," ) {
            t.value = "+ \", \" + ";
          }
          else if ( t.value === ";" ) {
            t.value = "+ \" \"";
            if ( i < line.length - 1 ) {
              t.value += " + ";
            }
            else {
              endLine = "";
            }
          }
        }
      } );
      output( ( evaluate( line ) || "" ) + endLine );
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
        error( "Expected THEN clause." );
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
      var exp,
          op;
      try {
        if ( line && line.length > 0 ) {
          op = line.shift( );
          if ( op ) {
            if ( commands.hasOwnProperty( op.value ) ) {
              return commands[op.value]( line );
            }
            else if ( isNumber( op.value ) ) {
              return setProgramCounter( [ op ] );
            }
            else if ( state[op.value] ||
                ( line[0].type === "operators" && line[0].value === "=" ) ) {
              line.unshift( op );
              return setValue( line );
            }
            else {
              error( "Unknown command. >>> " + op.value );
            }
          }
        }
        return true;
      }
      catch ( exp ) {
        console.error( exp );
        if ( op ) {
          console.log( op.toString() );
        }
        error( exp.message );
      }
      return programComplete( );
    }

    function waitForInput ( line ) {
      var toVar = line.pop();
      if ( line.length > 0 ) {
        print( line );
      }
      input( function ( str ) {
        str = str.toUpperCase();
        var valueToken = null;
        if ( isNumber( str ) ) {
          valueToken = toNum( str );
        }
        else {
          valueToken = toStr( str );
        }
        setValue( [ toVar, EQUAL_SIGN, valueToken ] );
        if ( next ) {
          next( );
        }
      } );
      return false;
    }

    function onStatement ( line ) {
      var oldLine = line.slice(),
          idxExpr = [ ],
          idx = null,
          targets = [ ],
          exp;
      try {
        while ( line.length > 0 && ( line[0].type !== "keywords" ||
            line[0].value !== "GOTO" ) ) {
          idxExpr.push( line.shift( ) );
        }
        if ( line.length > 0 ) {
          line.shift( ); // burn the goto;
          for ( var i = 0; i < line.length; ++i ) {
            var t = line[i];
            if ( t.type !== "operators" ||
                t.value !== "," ) {
              targets.push( t );
            }
          }
          idx = evaluate( idxExpr );
          if ( 0 <= idx && idx < targets.length ) {
            return setProgramCounter( [ targets[idx - 1] ] );
          }
        }
      }
      catch ( exp ) {
        console.error( exp );
        console.log( oldLine.join( "," ) );
        console.log( idxExpr.join( "," ) );
        console.log( idx );
      }
      return true;
    }

    var returnStack = [ ];
    function gotoSubroutine ( line ) {
      returnStack.push( toNum( lineNumbers[counter + 1] ) );
      return setProgramCounter( line );
    }

    function setRepeat ( ) {
      returnStack.push( toNum( lineNumbers[counter] ) );
      return true;
    }

    function conditionalReturn ( cond ) {
      var ret = true;
      var val = returnStack.pop();
      if ( val && cond ) {
        ret = setProgramCounter( [ val ] );
      }
      return ret;
    }

    function untilLoop ( line ) {
      return conditionalReturn( evaluate( line ) );
    }

    function stackReturn ( ) {
      return conditionalReturn( true );
    }

    function loadCodeFile ( line ) {
      loadFile( evaluate( line ), function ( ) {
        if ( next ) {
          next( );
        }
      } );
      return false;
    }

    function programComplete ( ) {
      isDone = true;
      if ( done ) {
        done( );
      }
      return false;
    }

    function noop ( ) {
      return true;
    }

    function loadData ( line ) {
      while ( line.length > 0 ) {
        var t = line.shift();
        if ( t.type !== "operators" ) {
          data.push( t.value );
        }
      }
      return true;
    }

    function readData ( line ) {
      var value = data[dataCounter];
      ++dataCounter;
      line.push( EQUAL_SIGN );
      line.push( toNum( value ) );
      return setValue( line );
    }

    function restoreData () {
      dataCounter = 0;
      return true;
    }

    var commands = {
      DIM: declareVariable,
      LET: setValue,
      PRINT: print,
      GOTO: setProgramCounter,
      IF: checkConditional,
      INPUT: waitForInput,
      END: programComplete,
      STOP: programComplete,
      REM: noop,
      "'": noop,
      CLS: clearScreen,
      ON: onStatement,
      GOSUB: gotoSubroutine,
      RETURN: stackReturn,
      LOAD: loadCodeFile,
      DATA: loadData,
      READ: readData,
      RESTORE: restoreData,
      REPEAT: setRepeat,
      UNTIL: untilLoop
          //FOR|TO|STEP|NEXT|WHILE|WEND|DEF FN|AT
    };

    return function ( ) {
      if ( !isDone ) {
        var line = getLine( );
        var goNext = process( line );
        ++counter;
        if ( goNext && next ) {
          next( );
        }
      }
    };
  };
  return grammar;
} )( );