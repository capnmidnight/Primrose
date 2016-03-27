"use strict";

/* global Primrose, pliny */

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.TextInput = function () {
  "use strict";

  pliny.record("Primrose.Text.CommandPacks", {
    name: "TextInput",
    description: "| [under construction]"
  });
  return new Primrose.Text.CommandPacks.BasicTextInput("Text Line input commands");
}();

pliny.issue("Primrose.Text.CommandPacks.TextInput", {
  name: "document TextInput",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CommandPacks.TextInput](#Primrose_Text_CommandPacks_TextInput) class in the command_packs/ directory"
});
