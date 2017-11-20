/*
pliny.class({
  parent: "Primrose.Text",
    name: "OperatingSystem",
    description: "A description of how a specific operating system handles keyboard shortcuts.",
    parameters: [{
      name: "osName",
      type: "String",
      description: "A friendly name for the operating system."
    }, {
      name: "pre1",
      type: "String",
      description: "Standard keyboard modifier."
    }, {
      name: "pre2",
      type: "String",
      description: "Key modifier for moving the cursor by whole words."
    }, {
      name: "redo",
      type: "String",
      description: "Key sequence to redo changes in text that were undone."
    }, {
      name: "pre3",
      type: "String",
      description: "Key modifier for home and end."
    }, {
      name: "home",
      type: "String",
      description: "Key sequence to send cursor to the beginning of the current line."
    }, {
      name: "end",
      type: "String",
      description: "Key sequence to send cursor to the end of the current line."
    }, {
      name: "pre5",
      type: "String",
      description: "Modifiers for the fullHome and fullEnd commands."
    }]
});
*/

import Keys from "../../Keys";

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

export default class OperatingSystem {
  constructor(osName, pre1, pre2, redo, pre3, home, end, pre5) {
    this.name = osName;

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
  }

  makeCommandName(evt, codePage) {
    const key = evt.keyCode;
    if (key !== Keys.CTRL &&
      key !== Keys.ALT &&
      key !== Keys.META_L &&
      key !== Keys.META_R &&
      key !== Keys.SHIFT) {

      let commandName = codePage.deadKeyState;

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
      if (commandName === codePage.deadKeyState) {
        commandName += "NORMAL";
      }

      commandName += "_" + codePage.keyNames[key];

      return this[commandName] || commandName;
    }
  }
};
