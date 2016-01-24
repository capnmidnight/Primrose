/* global Primrose */

Primrose.Text.Themes.Default = ( function ( ) {
  "use strict";
  return {
    name: "Light",
    fontFamily: "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace",
    cursorColor: "black",
    fontSize: 16,
    lineNumbers: {
      foreColor: "black"
    },
    regular: {
      backColor: "white",
      foreColor: "black",
      currentRowBackColor: "#f0f0f0",
      selectedBackColor: "#c0c0c0",
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
      foreColor: "grey",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "blue"
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
} )();

pliny.issue( "Primrose.Text.Themes.Default", {
  name: "document Default",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Themes.Default](#Primrose_Text_Themes_Default) class in the themes/ directory"
} );
