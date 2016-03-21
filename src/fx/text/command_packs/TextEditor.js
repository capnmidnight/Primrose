/* global Primrose, pliny */
 
//// 
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.TextEditor = (function () {
  "use strict";

  pliny.record("Primrose.Text.CommandPacks", {
    name: "TextEditor",
    description: "<under construction>"
  });
  class TextEditor extends Primrose.Text.CommandPack {
    constructor(operatingSystem, codePage, editor) {

      var commands = {
        NORMAL: {
          SPACE: " ",
          LEFTARROW: function (prim, tokenRows) {
            prim.cursorLeft(tokenRows, prim.frontCursor);
          },
          SKIPLEFT: function (prim, tokenRows) {
            prim.cursorSkipLeft(tokenRows, prim.frontCursor);
          },
          RIGHTARROW: function (prim, tokenRows) {
            prim.cursorRight(tokenRows, prim.frontCursor);
          },
          SKIPRIGHT: function (prim, tokenRows) {
            prim.cursorSkipRight(tokenRows, prim.frontCursor);
          },
          UPARROW: function (prim, tokenRows) {
            prim.cursorUp(tokenRows, prim.frontCursor);
          },
          DOWNARROW: function (prim, tokenRows) {
            prim.cursorDown(tokenRows, prim.frontCursor);
          },
          PAGEUP: function (prim, tokenRows) {
            prim.cursorPageUp(tokenRows, prim.frontCursor);
          },
          PAGEDOWN: function (prim, tokenRows) {
            prim.cursorPageDown(tokenRows, prim.frontCursor);
          },
          HOME: function (prim, tokenRows) {
            prim.cursorHome(tokenRows, prim.frontCursor);
          },
          END: function (prim, tokenRows) {
            prim.cursorEnd(tokenRows, prim.frontCursor);
          },
          BACKSPACE: function (prim, tokenRows) {
            if (prim.frontCursor.i === prim.backCursor.i) {
              prim.frontCursor.left(tokenRows);
            }
            prim.selectedText = "";
            prim.scrollIntoView(prim.frontCursor);
          },
          ENTER: function (prim, tokenRows, currentToken) {
            var indent = "";
            var tokenRow = tokenRows[prim.frontCursor.y];
            if (tokenRow.length > 0 && tokenRow[0].type === "whitespace") {
              indent = tokenRow[0].value;
            }
            prim.selectedText = "\n" + indent;
            prim.scrollIntoView(prim.frontCursor);
          },
          DELETE: function (prim, tokenRows) {
            if (prim.frontCursor.i === prim.backCursor.i) {
              prim.backCursor.right(tokenRows);
            }
            prim.selectedText = "";
            prim.scrollIntoView(prim.frontCursor);
          },
          TAB: function (prim, tokenRows) {
            prim.selectedText = prim.tabString;
          }
        },

        SHIFT: {
          SPACE: " ",
          LEFTARROW: function (prim, tokenRows) {
            prim.cursorLeft(tokenRows, prim.backCursor);
          },
          SKIPLEFT: function (prim, tokenRows) {
            prim.cursorSkipLeft(tokenRows, prim.backCursor);
          },
          RIGHTARROW: function (prim, tokenRows) {
            prim.cursorRight(tokenRows, prim.backCursor);
          },
          SKIPRIGHT: function (prim, tokenRows) {
            prim.cursorSkipRight(tokenRows, prim.backCursor);
          },
          UPARROW: function (prim, tokenRows) {
            prim.cursorUp(tokenRows, prim.backCursor);
          },
          DOWNARROW: function (prim, tokenRows) {
            prim.cursorDown(tokenRows, prim.backCursor);
          },
          PAGEUP: function (prim, tokenRows) {
            prim.cursorPageUp(tokenRows, prim.backCursor);
          },
          PAGEDOWN: function (prim, tokenRows) {
            prim.cursorPageDown(tokenRows, prim.backCursor);
          },
          HOME: function (prim, tokenRows) {
            prim.cursorHome(tokenRows, prim.backCursor);
          },
          END: function (prim, tokenRows) {
            prim.cursorEnd(tokenRows, prim.backCursor);
          },
          DELETE: function (prim, tokenRows) {
            if (prim.frontCursor.i === prim.backCursor.i) {
              prim.frontCursor.home(tokenRows);
              prim.backCursor.end(tokenRows);
            }
            prim.selectedText = "";
            prim.scrollIntoView(prim.frontCursor);
          },
        },

        CTRL: {
          HOME: function (prim, tokenRows) {
            prim.cursorFullHome(tokenRows, prim.frontCursor);
          },
          END: function (prim, tokenRows) {
            prim.cursorFullEnd(tokenRows, prim.frontCursor);
          }
        },

        CTRLSHIFT: {
          HOME: function (prim, tokenRows) {
            prim.cursorFullHome(tokenRows, prim.backCursor);
          },
          END: function (prim, tokenRows) {
            prim.cursorFullEnd(tokenRows, prim.backCursor);
          }
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
        },

        WINDOW_SCROLL_DOWN: function (prim, tokenRows) {
          if (prim.scroll.y < tokenRows.length) {
            ++prim.scroll.y;
          }
        },
        WINDOW_SCROLL_UP: function (prim, tokenRows) {
          if (prim.scroll.y > 0) {
            --prim.scroll.y;
          }
        }
      };

      var allCommands = {};
      copyObject(allCommands, codePage);

      for (var type in commands) {
        var codes = commands[type];
        if (typeof (codes) === "object") {
          if (!allCommands[type]) {
            allCommands[type] = {};
          }
          for (var code in codes) {
            allCommands[type + "_" + code] = codes[code];
          }
        }
        else {
          allCommands[type] = codes;
        }
      }

      function overwriteText(ed, txt) {
        ed.selectedText = txt;
      }

      for (var key in allCommands) {
        if (allCommands.hasOwnProperty(key)) {
          var func = allCommands[key];
          if (typeof func !== "function") {
            func = overwriteText.bind(null, editor, func);
          }
          allCommands[key] = func;
        }
      }

      super("Text editor commands", allCommands);
    }
  }
  return TextEditor;
})();

pliny.issue("Primrose.Text.CommandPacks.TextEditor", {
  name: "document TextEditor",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CommandPacks.TextEditor](#Primrose_Text_CommandPacks_TextEditor) class in the command_packs/ directory"
});
