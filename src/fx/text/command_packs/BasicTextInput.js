//// 
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.BasicTextInput = (function () {
  "use strict";

  pliny.record({
    parent: "Primrose.Text.CommandPacks",
    name: "TextInput",
    baseClass: "Primrose.Text.CommandPack",
    description: "| [under construction]"
  });
  class BasicTextInput extends Primrose.Text.CommandPack {
    constructor(additionalName, additionalCommands) {
      var commands = {
        NORMAL_LEFTARROW: function (prim, tokenRows) {
          prim.cursorLeft(tokenRows, prim.frontCursor);
        },
        NORMAL_SKIPLEFT: function (prim, tokenRows) {
          prim.cursorSkipLeft(tokenRows, prim.frontCursor);
        },
        NORMAL_RIGHTARROW: function (prim, tokenRows) {
          prim.cursorRight(tokenRows, prim.frontCursor);
        },
        NORMAL_SKIPRIGHT: function (prim, tokenRows) {
          prim.cursorSkipRight(tokenRows, prim.frontCursor);
        },
        NORMAL_HOME: function (prim, tokenRows) {
          prim.cursorHome(tokenRows, prim.frontCursor);
        },
        NORMAL_END: function (prim, tokenRows) {
          prim.cursorEnd(tokenRows, prim.frontCursor);
        },
        NORMAL_BACKSPACE: function (prim, tokenRows) {
          if (prim.frontCursor.i === prim.backCursor.i) {
            prim.frontCursor.left(tokenRows);
          }
          prim.selectedText = "";
          prim.scrollIntoView(prim.frontCursor);
        },
        NORMAL_ENTER: function (prim, tokenRows, currentToken) {
          emit.call(prim, "change", { target: prim });
        },
        NORMAL_DELETE: function (prim, tokenRows) {
          if (prim.frontCursor.i === prim.backCursor.i) {
            prim.backCursor.right(tokenRows);
          }
          prim.selectedText = "";
          prim.scrollIntoView(prim.frontCursor);
        },
        NORMAL_TAB: function (prim, tokenRows) {
          prim.selectedText = prim.tabString;
        },

        SHIFT_LEFTARROW: function (prim, tokenRows) {
          prim.cursorLeft(tokenRows, prim.backCursor);
        },
        SHIFT_SKIPLEFT: function (prim, tokenRows) {
          prim.cursorSkipLeft(tokenRows, prim.backCursor);
        },
        SHIFT_RIGHTARROW: function (prim, tokenRows) {
          prim.cursorRight(tokenRows, prim.backCursor);
        },
        SHIFT_SKIPRIGHT: function (prim, tokenRows) {
          prim.cursorSkipRight(tokenRows, prim.backCursor);
        },
        SHIFT_HOME: function (prim, tokenRows) {
          prim.cursorHome(tokenRows, prim.backCursor);
        },
        SHIFT_END: function (prim, tokenRows) {
          prim.cursorEnd(tokenRows, prim.backCursor);
        },
        SHIFT_DELETE: function (prim, tokenRows) {
          if (prim.frontCursor.i === prim.backCursor.i) {
            prim.frontCursor.home(tokenRows);
            prim.backCursor.end(tokenRows);
          }
          prim.selectedText = "";
          prim.scrollIntoView(prim.frontCursor);
        },
        CTRL_HOME: function (prim, tokenRows) {
          prim.cursorFullHome(tokenRows, prim.frontCursor);
        },
        CTRL_END: function (prim, tokenRows) {
          prim.cursorFullEnd(tokenRows, prim.frontCursor);
        },

        CTRLSHIFT_HOME: function (prim, tokenRows) {
          prim.cursorFullHome(tokenRows, prim.backCursor);
        },
        CTRLSHIFT_END: function (prim, tokenRows) {
          prim.cursorFullEnd(tokenRows, prim.backCursor);
        },

        SELECT_ALL: function (prim, tokenRows) {
          prim.frontCursor.fullhome(tokenRows);
          prim.backCursor.fullend(tokenRows);
        },

        REDO: function (prim, tokenRows) {
          prim.redo();
          prim.scrollIntoView(prim.frontCursor);
        },
        UNDO: function (prim, tokenRows) {
          prim.undo();
          prim.scrollIntoView(prim.frontCursor);
        }
      };

      if (additionalCommands) {
        for (var key in additionalCommands) {
          commands[key] = additionalCommands[key];
        }
      }

      super(additionalName || "Text editor commands", commands);
    }
  }

  return BasicTextInput;
})();

