"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.BasicTextInput = function () {
  "use strict";

  pliny.record({
    parent: "Primrose.Text.CommandPacks",
    name: "TextInput",
    baseClass: "Primrose.Text.CommandPack",
    description: "| [under construction]"
  });

  var BasicTextInput = function (_Primrose$Text$Comman) {
    _inherits(BasicTextInput, _Primrose$Text$Comman);

    function BasicTextInput(additionalName, additionalCommands) {
      _classCallCheck(this, BasicTextInput);

      var commands = {
        NORMAL_LEFTARROW: function NORMAL_LEFTARROW(prim, tokenRows) {
          prim.cursorLeft(tokenRows, prim.frontCursor);
        },
        NORMAL_SKIPLEFT: function NORMAL_SKIPLEFT(prim, tokenRows) {
          prim.cursorSkipLeft(tokenRows, prim.frontCursor);
        },
        NORMAL_RIGHTARROW: function NORMAL_RIGHTARROW(prim, tokenRows) {
          prim.cursorRight(tokenRows, prim.frontCursor);
        },
        NORMAL_SKIPRIGHT: function NORMAL_SKIPRIGHT(prim, tokenRows) {
          prim.cursorSkipRight(tokenRows, prim.frontCursor);
        },
        NORMAL_HOME: function NORMAL_HOME(prim, tokenRows) {
          prim.cursorHome(tokenRows, prim.frontCursor);
        },
        NORMAL_END: function NORMAL_END(prim, tokenRows) {
          prim.cursorEnd(tokenRows, prim.frontCursor);
        },
        NORMAL_BACKSPACE: function NORMAL_BACKSPACE(prim, tokenRows) {
          if (prim.frontCursor.i === prim.backCursor.i) {
            prim.frontCursor.left(tokenRows);
          }
          prim.selectedText = "";
          prim.scrollIntoView(prim.frontCursor);
        },
        NORMAL_ENTER: function NORMAL_ENTER(prim, tokenRows, currentToken) {
          emit.call(prim, "change", { target: prim });
        },
        NORMAL_DELETE: function NORMAL_DELETE(prim, tokenRows) {
          if (prim.frontCursor.i === prim.backCursor.i) {
            prim.backCursor.right(tokenRows);
          }
          prim.selectedText = "";
          prim.scrollIntoView(prim.frontCursor);
        },
        NORMAL_TAB: function NORMAL_TAB(prim, tokenRows) {
          prim.selectedText = prim.tabString;
        },

        SHIFT_LEFTARROW: function SHIFT_LEFTARROW(prim, tokenRows) {
          prim.cursorLeft(tokenRows, prim.backCursor);
        },
        SHIFT_SKIPLEFT: function SHIFT_SKIPLEFT(prim, tokenRows) {
          prim.cursorSkipLeft(tokenRows, prim.backCursor);
        },
        SHIFT_RIGHTARROW: function SHIFT_RIGHTARROW(prim, tokenRows) {
          prim.cursorRight(tokenRows, prim.backCursor);
        },
        SHIFT_SKIPRIGHT: function SHIFT_SKIPRIGHT(prim, tokenRows) {
          prim.cursorSkipRight(tokenRows, prim.backCursor);
        },
        SHIFT_HOME: function SHIFT_HOME(prim, tokenRows) {
          prim.cursorHome(tokenRows, prim.backCursor);
        },
        SHIFT_END: function SHIFT_END(prim, tokenRows) {
          prim.cursorEnd(tokenRows, prim.backCursor);
        },
        SHIFT_DELETE: function SHIFT_DELETE(prim, tokenRows) {
          if (prim.frontCursor.i === prim.backCursor.i) {
            prim.frontCursor.home(tokenRows);
            prim.backCursor.end(tokenRows);
          }
          prim.selectedText = "";
          prim.scrollIntoView(prim.frontCursor);
        },
        CTRL_HOME: function CTRL_HOME(prim, tokenRows) {
          prim.cursorFullHome(tokenRows, prim.frontCursor);
        },
        CTRL_END: function CTRL_END(prim, tokenRows) {
          prim.cursorFullEnd(tokenRows, prim.frontCursor);
        },

        CTRLSHIFT_HOME: function CTRLSHIFT_HOME(prim, tokenRows) {
          prim.cursorFullHome(tokenRows, prim.backCursor);
        },
        CTRLSHIFT_END: function CTRLSHIFT_END(prim, tokenRows) {
          prim.cursorFullEnd(tokenRows, prim.backCursor);
        },

        SELECT_ALL: function SELECT_ALL(prim, tokenRows) {
          prim.frontCursor.fullhome(tokenRows);
          prim.backCursor.fullend(tokenRows);
        },

        REDO: function REDO(prim, tokenRows) {
          prim.redo();
          prim.scrollIntoView(prim.frontCursor);
        },
        UNDO: function UNDO(prim, tokenRows) {
          prim.undo();
          prim.scrollIntoView(prim.frontCursor);
        }
      };

      if (additionalCommands) {
        for (var key in additionalCommands) {
          commands[key] = additionalCommands[key];
        }
      }

      return _possibleConstructorReturn(this, Object.getPrototypeOf(BasicTextInput).call(this, additionalName || "Text editor commands", commands));
    }

    return BasicTextInput;
  }(Primrose.Text.CommandPack);

  return BasicTextInput;
}();