"use strict";

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.TextInput = function () {
  "use strict";

  pliny.record({
    parent: "Primrose.Text.CommandPacks",
    name: "TextInput",
    description: "| [under construction]"
  });
  return new Primrose.Text.CommandPacks.BasicTextInput("Text Line input commands");
}();