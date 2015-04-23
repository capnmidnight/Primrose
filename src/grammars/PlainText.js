/* global Primrose */
Primrose.Grammars.PlainText = (function () {
  "use strict";

  return new Primrose.Grammar("PlainText", [
    ["newlines", /(?:\r\n|\r|\n)/]
  ]);
})();
