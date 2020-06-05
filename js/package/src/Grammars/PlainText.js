/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "PlainText",
  description: "A grammar that makes displaying plain text work with the text editor designed for syntax highlighting."
});
*/

import { Grammar } from "./Grammar.js";
export const PlainText = new Grammar("PlainText", [
    ["newlines", /(?:\r\n|\r|\n)/],
    ["whitespace", /(?:\s+)/]
]);
