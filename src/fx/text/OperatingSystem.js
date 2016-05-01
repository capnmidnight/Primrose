Primrose.Text.OperatingSystem = (function () {
  "use strict";

  function setCursorCommand(obj, mod, key, func, cur) {
    var name = mod + "_" + key;
    obj[name] = function (prim, tokenRows) {
      prim["cursor" + func](tokenRows, prim[cur + "Cursor"]);
    };
  }

  function makeCursorCommand(obj, baseMod, key, func) {
    setCursorCommand(obj, baseMod || "NORMAL", key, func, "front");
    setCursorCommand(obj, baseMod + "SHIFT", key, func, "back");
  }

  pliny.class({
    parent: "Primrose.Text",
    name: "OperatingSystem",
    description: "| [under construction]"
  });
  class OperatingSystem {
    constructor(name, pre1, pre2, redo, pre3, home, end, pre5, fullHome, fullEnd) {
      var pre4 = pre3;
      pre3 = pre3.length > 0 ? pre3 : "NORMAL";

      this[pre1 + "_a"] = "SELECT_ALL";
      this[pre1 + "_c"] = "COPY";
      this[pre1 + "_x"] = "CUT";
      this[pre1 + "_v"] = "PASTE";
      this[redo] = "REDO";
      this[pre1 + "_z"] = "UNDO";
      this[pre1 + "_DOWNARROW"] = "WINDOW_SCROLL_DOWN";
      this[pre1 + "_UPARROW"] = "WINDOW_SCROLL_UP";
      this[pre2 + "_LEFTARROW"] = "NORMAL_SKIPLEFT";
      this[pre2 + "SHIFT_LEFTARROW"] = "SHIFT_SKIPLEFT";
      this[pre2 + "_RIGHTARROW"] = "NORMAL_SKIPRIGHT";
      this[pre2 + "SHIFT_RIGHTARROW"] = "SHIFT_SKIPRIGHT";
      this[pre3 + "_HOME"] = "NORMAL_HOME";
      this[pre4 + "SHIFT_HOME"] = "SHIFT_HOME";
      this[pre3 + "_END"] = "NORMAL_END";
      this[pre4 + "SHIFT_END"] = "SHIFT_END";
      this[pre5 + "_HOME"] = "CTRL_HOME";
      this[pre5 + "SHIFT_HOME"] = "CTRLSHIFT_HOME";
      this[pre5 + "_END"] = "CTRL_END";
      this[pre5 + "SHIFT_END"] = "CTRLSHIFT_END";

      this._deadKeyState = "";
    }

    makeCommandName(evt, codePage) {
      var key = evt.keyCode;
      if (key !== Primrose.Keys.CTRL &&
        key !== Primrose.Keys.ALT &&
        key !== Primrose.Keys.META_L &&
        key !== Primrose.Keys.META_R &&
        key !== Primrose.Keys.SHIFT) {

        var oldDeadKeyState = this._deadKeyState,
          commandName = this._deadKeyState;

        if (evt.ctrlKey) {
          commandName += "CTRL";
        }
        if (evt.altKey) {
          commandName += "ALT";
        }
        if (evt.metaKey) {
          commandName += "META";
        }
        if (evt.shiftKey) {
          commandName += "SHIFT";
        }
        if (commandName === this._deadKeyState) {
          commandName += "NORMAL";
        }

        commandName += "_" + codePage.keyNames[key];
        
        return this[commandName] || commandName;
      }
    }
  }
  return OperatingSystem;
})();

