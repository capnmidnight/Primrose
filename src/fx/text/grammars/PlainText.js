/* global Primrose */

Primrose.Text.Grammars.PlainText = (function () {
  "use strict";

  return new Primrose.Text.Grammar("PlainText", [
    ["newlines", /(?:\r\n|\r|\n)/]
  ]);
})();
