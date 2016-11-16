pliny.namespace({
  parent: "Primrose.Text",
  name: "CommandPacks",
  description: "The CommandPacks namespace contains sets of keyboard shortcuts for different types of text-oriented controls."
});

import { default as BasicTextInput } from "./BasicTextInput";
import { default as CommandPack } from "./CommandPack";
import { default as TextEditor } from "./TextEditor";
import { default as TextInput } from "./TextInput";

import * as CommandPacks from ".";
export default CommandPacks;