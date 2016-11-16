pliny.namespace({
  parent: "Primrose",
  name: "Text",
  description: "The Text namespace contains classes everything regarding the Primrose source code editor."
});

import { default as CodePages } from "./CodePages";
import { default as CommandPacks } from "./CommandPacks";
import { default as Controls } from "./Controls";
import { default as Grammars } from "./Grammars";
import { default as OperatingSystems } from "./OperatingSystems";
import { default as Themes } from "./Themes";
import { default as Cursor } from "./Cursor";
import { default as Point } from "./Point";
import { default as Rectangle } from "./Rectangle";
import { default as Rule } from "./Rule";
import { default as Size } from "./Size";
import { default as Terminal } from "./Terminal";
import { default as Token } from "./Token";

import * as Text from ".";
export default Text;