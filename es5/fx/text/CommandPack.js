"use strict";

/* global Primrose, pliny */

Primrose.Text.CommandPack = function () {
  "use strict";

  pliny.class("Primrose.Text", {
    name: "CommandPack",
    description: "| [under construction]"
  });
  function CommandPack(name, commands) {
    this.name = name;
    copyObject(this, commands);
  }

  return CommandPack;
}();

pliny.issue("Primrose.Text.CommandPack", {
  name: "document CommandPack",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CommandPack](#Primrose_Text_CommandPack) class in the text/ directory"
});

pliny.issue("Primrose.Text.CommandPack", {
  name: "Merge controls and command packs",
  type: "open",
  description: "The concept of an individual command pack doesn't make sense outside of the context of any particular control that uses it. The two are fundamentally linked, so they should be a part of the same class."
});
