"use strict";

Primrose.Text.Grammars.PlainText = function () {
  "use strict";

  pliny.value({
    parent: "Primrose.Text.Grammars",
    name: "PlainText",
    description: "| [under construction]"
  });
  return new Primrose.Text.Grammar("PlainText", [["newlines", /(?:\r\n|\r|\n)/]]);
}();