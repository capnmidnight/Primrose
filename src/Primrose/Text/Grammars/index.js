pliny.namespace({
  parent: "Primrose.Text",
  name: "Grammars",
  description: "The Grammars namespace contains grammar parsers for different types of programming languages, to enable syntax highlighting."
});

import { default as Basic } from "./Basic";
import { default as Grammar } from "./Grammar";
import { default as JavaScript } from "./JavaScript";
import { default as PlainText } from "./PlainText";
import { default as TestResults } from "./TestResults";

import * as Grammars from ".";
export default Grammars;