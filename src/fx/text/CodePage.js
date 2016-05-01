Primrose.Text.CodePage = ( function ( ) {
  "use strict";

  pliny.class({
    parent: "Primrose.Text",
    name: "CodePage",
    description: "| [under construction]"
  } );
  function CodePage ( name, lang, options ) {
    this.name = name;
    this.language = lang;

    var commands = {
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
    };

    copyObject(commands, options);

    var char, code, cmdName;
    for ( var i = 0; i <= 9; ++i ) {
      code = Primrose.Keys["NUMPAD" + i];
      commands.NORMAL[code] = i.toString();
    }

    commands.NORMAL[Primrose.Keys.MULTIPLY] = "*";
    commands.NORMAL[Primrose.Keys.ADD] = "+";
    commands.NORMAL[Primrose.Keys.SUBTRACT] = "-";
    commands.NORMAL[Primrose.Keys.DECIMALPOINT] = ".";
    commands.NORMAL[Primrose.Keys.DIVIDE] = "/";

    this.keyNames = {};
    this.commandNames = [];
    for (char in Primrose.Keys) {
      code = Primrose.Keys[char];
      if (!isNaN(code)) {
        this.keyNames[code] = char;
      }
    }

    function overwriteText(txt, prim, lines) {
      prim.selectedText = txt;
    }
    
    for (var type in commands) {
      var codes = commands[type];
      if (typeof (codes) === "object") {
        for (code in codes) {
          if (code.indexOf("_") > -1) {
            var parts = code.split(' '),
              browser = parts[0];
            code = parts[1];
            char = commands.NORMAL[code];
            cmdName = browser + "_" + type + " " + char;
          }
          else {
            char = commands.NORMAL[code];
            cmdName = type + "_" + char;
          }
          this.commandNames.push(cmdName);
          this.keyNames[code] = char;
          var func = codes[code];
          if (typeof func !== "function") {
            func = overwriteText.bind(null, func);
          }
          this[cmdName] = func;
        }
      }
    }
  }

  CodePage.DEAD = function ( key ) {
    return function ( prim ) {
      prim.setDeadKeyState( "DEAD" + key );
    };
  };

  return CodePage;
} ) ();

