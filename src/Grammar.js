/* global Primrose */
Primrose.Grammar = ( function ( ) {
  "use strict";

  function Grammar ( name, grammar ) {
    this.name = name;
    // clone the preprocessing grammar to start a new grammar
    this.grammar = grammar.map( function ( rule ) {
      return new Primrose.Rule( rule[0], rule[1] );
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
      var tokens = [ new Primrose.Token( text, "regular", 0 ) ];
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
