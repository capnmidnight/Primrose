/* global Primrose */
Primrose.UI.Text.Grammars.PlainText = (function () {
  "use strict";

  return new Primrose.UI.Text.Grammar("PlainText", [
    ["newlines", /(?:\r\n|\r|\n)/]
  ]);
})();
