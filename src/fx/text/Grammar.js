/* global Primrose */

Primrose.Text.Grammar = ( function ( ) {
  "use strict";

  function Grammar ( name, grammar ) {
    this.name = name;
    // clone the preprocessing grammar to start a new grammar
    this.grammar = grammar.map( function ( rule ) {
      return new Primrose.Text.Rule( rule[0], rule[1] );
    } );

    function crudeParsing ( tokens ) {
      var commentDelim = null,
          stringDelim = null,
          line = 0;
      for ( var i = 0; i < tokens.length; ++i ) {
        var t = tokens[i];
        t.line = line;
        if ( t.type === "newlines" ) {
          ++line;
        }

        if ( stringDelim ) {
          if ( t.type === "stringDelim" && t.value === stringDelim && ( i === 0 || tokens[i - 1].value[tokens[i - 1].value.length - 1] !== "\\" ) ) {
            stringDelim = null;
          }
          if ( t.type !== "newlines" ) {
            t.type = "strings";
          }
        }
        else if ( commentDelim ) {
          if ( commentDelim === "startBlockComments" && t.type === "endBlockComments"
              || commentDelim === "startLineComments" && t.type === "newlines" ) {
            commentDelim = null;
          }
          if ( t.type !== "newlines" ) {
            t.type = "comments";
          }
        }
        else if ( t.type === "stringDelim" ) {
          stringDelim = t.value;
          t.type = "strings";
        }
        else if ( t.type === "startBlockComments" || t.type === "startLineComments" ) {
          commentDelim = t.type;
          t.type = "comments";
        }
      }
    }

    this.tokenize = function ( text ) {
      // all text starts off as regular text, then gets cut up into tokens of
      // more specific type
      var tokens = [ new Primrose.Text.Token( text, "regular", 0 ) ];
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

  return Grammar;
} )();
