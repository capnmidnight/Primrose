"use strict";

/* global Primrose, pliny */

Primrose.Text.Themes.Dark = function () {
  "use strict";

  pliny.record("Primrose.Text.Themes", {
    name: "Dark",
    description: "| [under construction]"
  });
  return {
    name: "Dark",
    fontFamily: "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace",
    cursorColor: "white",
    fontSize: 16,
    lineNumbers: {
      foreColor: "white"
    },
    regular: {
      backColor: "black",
      foreColor: "#c0c0c0",
      currentRowBackColor: "#202020",
      selectedBackColor: "#404040",
      unfocused: "rgba(0, 0, 255, 0.25)"
    },
    strings: {
      foreColor: "#aa9900",
      fontStyle: "italic"
    },
    regexes: {
      foreColor: "#aa0099",
      fontStyle: "italic"
    },
    numbers: {
      foreColor: "green"
    },
    comments: {
      foreColor: "yellow",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "cyan"
    },
    functions: {
      foreColor: "brown",
      fontWeight: "bold"
    },
    members: {
      foreColor: "green"
    },
    error: {
      foreColor: "red",
      fontStyle: "underline italic"
    }
  };
}();

pliny.issue("Primrose.Text.Themes.Dark", {
  name: "document Dark",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Themes.Dark](#Primrose_Text_Themes_Dark) class in the themes/ directory"
});
