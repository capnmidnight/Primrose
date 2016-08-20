"use strict";

pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "PlainText",
  description: "| [under construction]"
});
const PlainText = new Primrose.Text.Grammar("PlainText", [
  ["newlines", /(?:\r\n|\r|\n)/]
]);