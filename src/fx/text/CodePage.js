/* global Primrose, pliny */

Primrose.Text.CodePage = ( function ( ) {
  "use strict";

  function CodePage ( name, lang, options ) {
    this.name = name;
    this.language = lang;

    copyObject( this, {
      NORMAL: {
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z"
      },
      SHIFT: {
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z"
      }
    } );

    copyObject( this, options );

    for ( var i = 0; i <= 9; ++i ) {
      var code = Primrose.Keys["NUMPAD" + i];
      this.NORMAL[code] = i.toString();
    }

    this.NORMAL[Primrose.Keys.MULTIPLY] = "*";
    this.NORMAL[Primrose.Keys.ADD] = "+";
    this.NORMAL[Primrose.Keys.SUBTRACT] = "-";
    this.NORMAL[Primrose.Keys.DECIMALPOINT] = ".";
    this.NORMAL[Primrose.Keys.DIVIDE] = "/";
  }

  CodePage.DEAD = function ( key ) {
    return function ( prim ) {
      prim.setDeadKeyState( "DEAD" + key );
    };
  };

  return CodePage;
} ) ();

pliny.issue( "Primrose.Text.CodePage", {
  name: "document CodePage",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CodePage](#Primrose_Text_CodePage) class in the text/ directory"
} );
