Primrose.Text.Token = ( function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Text",
    name: "Token",
    description: "| [under construction]"
  } );
  function Token ( value, type, index, line ) {
    this.value = value;
    this.type = type;
    this.index = index;
    this.line = line;
  }

  Token.prototype.clone = function () {
    return new Token( this.value, this.type, this.index, this.line );
  };

  Token.prototype.splitAt = function ( i ) {
    var next = this.value.substring( i );
    this.value = this.value.substring( 0, i );
    return new Token( next, this.type, this.index + i, this.line );
  };

  Token.prototype.toString = function () {
    return "[" + this.type + ": " + this.value + "]";
  };

  return Token;
} )();

