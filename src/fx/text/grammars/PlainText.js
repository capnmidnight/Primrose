/* global Primrose, pliny */

Primrose.Text.Grammars.PlainText = (function () {
  "use strict";

  pliny.value( "Primrose.Text.Grammars", {
    name: "PlainText",
    description: "| [under construction]"
  } );
  return new Primrose.Text.Grammar("PlainText", [
    ["newlines", /(?:\r\n|\r|\n)/]
  ]);
})();

pliny.issue( "Primrose.Text.Grammars.PlainText", {
  name: "document PlainText",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Grammars.PlainText](#Primrose_Text_Grammars_PlainText) class in the grammars/ directory"
} );
