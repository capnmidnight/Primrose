"use strict";

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.TextEditor = function () {
  "use strict";

  pliny.record({
    parent: "Primrose.Text.CommandPacks",
    name: "TextEditor",
    description: "| [under construction]"
  });
  return new Primrose.Text.CommandPacks.BasicTextInput("Text Area input commands", {
    NORMAL_UPARROW: function NORMAL_UPARROW(prim, tokenRows) {
      prim.cursorUp(tokenRows, prim.frontCursor);
    },
    NORMAL_DOWNARROW: function NORMAL_DOWNARROW(prim, tokenRows) {
      prim.cursorDown(tokenRows, prim.frontCursor);
    },
    NORMAL_PAGEUP: function NORMAL_PAGEUP(prim, tokenRows) {
      prim.cursorPageUp(tokenRows, prim.frontCursor);
    },
    NORMAL_PAGEDOWN: function NORMAL_PAGEDOWN(prim, tokenRows) {
      prim.cursorPageDown(tokenRows, prim.frontCursor);
    },
    NORMAL_ENTER: function NORMAL_ENTER(prim, tokenRows, currentToken) {
      var indent = "";
      var tokenRow = tokenRows[prim.frontCursor.y];
      if (tokenRow.length > 0 && tokenRow[0].type === "whitespace") {
        indent = tokenRow[0].value;
      }
      prim.selectedText = "\n" + indent;
      prim.scrollIntoView(prim.frontCursor);
    },

    SHIFT_UPARROW: function SHIFT_UPARROW(prim, tokenRows) {
      prim.cursorUp(tokenRows, prim.backCursor);
    },
    SHIFT_DOWNARROW: function SHIFT_DOWNARROW(prim, tokenRows) {
      prim.cursorDown(tokenRows, prim.backCursor);
    },
    SHIFT_PAGEUP: function SHIFT_PAGEUP(prim, tokenRows) {
      prim.cursorPageUp(tokenRows, prim.backCursor);
    },
    SHIFT_PAGEDOWN: function SHIFT_PAGEDOWN(prim, tokenRows) {
      prim.cursorPageDown(tokenRows, prim.backCursor);
    },

    WINDOW_SCROLL_DOWN: function WINDOW_SCROLL_DOWN(prim, tokenRows) {
      if (prim.scroll.y < tokenRows.length) {
        ++prim.scroll.y;
      }
    },
    WINDOW_SCROLL_UP: function WINDOW_SCROLL_UP(prim, tokenRows) {
      if (prim.scroll.y > 0) {
        --prim.scroll.y;
      }
    }
  });
}();