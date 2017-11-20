/*
pliny.record({
  parent: "Primrose.Text.CommandPacks",
  name: "TextEditor",
  description: "A set of commands for a multi-line text editing, extending single-line text editing."
});
*/

import BasicTextInput from "./BasicTextInput";
export default new BasicTextInput(
  "Text Area input commands", {
    NORMAL_UPARROW: function (prim, tokenRows) {
      prim.cursorUp(tokenRows, prim.frontCursor);
    },
    NORMAL_DOWNARROW: function (prim, tokenRows) {
      prim.cursorDown(tokenRows, prim.frontCursor);
    },
    NORMAL_PAGEUP: function (prim, tokenRows) {
      prim.cursorPageUp(tokenRows, prim.frontCursor);
    },
    NORMAL_PAGEDOWN: function (prim, tokenRows) {
      prim.cursorPageDown(tokenRows, prim.frontCursor);
    },
    NORMAL_ENTER: function (prim, tokenRows, currentToken) {
      var indent = "";
      var tokenRow = tokenRows[prim.frontCursor.y];
      if (tokenRow.length > 0 && tokenRow[0].type === "whitespace") {
        indent = tokenRow[0].value;
      }
      prim.selectedText = "\n" + indent;
      prim.scrollIntoView(prim.frontCursor);
    },

    SHIFT_UPARROW: function (prim, tokenRows) {
      prim.cursorUp(tokenRows, prim.backCursor);
    },
    SHIFT_DOWNARROW: function (prim, tokenRows) {
      prim.cursorDown(tokenRows, prim.backCursor);
    },
    SHIFT_PAGEUP: function (prim, tokenRows) {
      prim.cursorPageUp(tokenRows, prim.backCursor);
    },
    SHIFT_PAGEDOWN: function (prim, tokenRows) {
      prim.cursorPageDown(tokenRows, prim.backCursor);
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
  });
