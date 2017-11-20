/*
pliny.class({
  parent: "Primrose.Text",
  name: "CodePage",
  description: "A code page is a description of how a certain cultural locale's keyboard works. Keys send \"key codes\" to the operating system, and the operating system then translates this into \"virtual key codes\" (as the keyboard's own code system is arbitrary and proprietary). The operating system's virtual key codes attempt to express the intended meaning of the user's key striking activity.\n\
\n\
As we work in the browser and not at the operating system level, we do not receive these virtual key codes. The browser does yet another translation into \"key events\" that are nominally standardized. Unfortunately, the standard is incomplete with regards to the full breadth of cultural locales in the world, and the current state of browser support for the standard is subopitmal. So we have to reinterpret what the browser tells us to get a better idea of what the user actually meant. And that reinterpretation is this CodePage class.",
  parameters: [{
    name: "codePageName",
    type: "String",
    description: "A readable name for the CodePage, to be used in options UIs.",
  }, {
    name: "lang",
    type: "String",
    description: "The IETF standard language tag describing the locale for which this CodePage was created. See: https://en.wikipedia.org/wiki/IETF_language_tag."
  }, {
    name: "options",
    type: "Object",
    description: "The CodePage description, an object literal expressing how different key events with different modifier keys result into different character codes or dead key state transitions. See: https://en.wikipedia.org/wiki/Dead_key."
  }]
});
*/

import Keys from "../../Keys";
export default class CodePage {
  constructor(codePageName, lang, options) {
    this.name = codePageName;
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

    for(var key in options){
      commands[key] = Object.assign({}, commands[key], options[key]);
    }

    var char, code, cmdName;
    for (var i = 0; i <= 9; ++i) {
      code = Keys["NUMPAD" + i];
      commands.NORMAL[code] = i.toString();
    }

    commands.NORMAL[Keys.MULTIPLY] = "*";
    commands.NORMAL[Keys.ADD] = "+";
    commands.NORMAL[Keys.SUBTRACT] = "-";
    commands.NORMAL[Keys.DECIMALPOINT] = ".";
    commands.NORMAL[Keys.DIVIDE] = "/";

    this.keyNames = {};
    this.commandNames = [];
    for (char in Keys) {
      code = Keys[char];
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
          this[cmdName] = func.bind(this);
        }
      }
    }

    this.lastDeadKeyState = this.deadKeyState = "";
  }

  resetDeadKeyState() {
    if(this.deadKeyState === this.lastDeadKeyState) {
      this.deadKeyState = "";
    }
  }
};

CodePage.DEAD = function (key) {
  return function (prim) {
    this.lastDeadKeyState = this.deadKeyState;
    this.deadKeyState = "DEAD" + key;
  };
};
