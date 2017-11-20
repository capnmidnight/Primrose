/*
pliny.record({
  parent: "Primrose.Text.CommandPacks",
  name: "TextInput",
  description: "A concrete instantiation of the single-line text editor commands provided by BasicTextInput."
});
*/

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front".
// If SHIFT is held, then "back"
//
import BasicTextInput from "./BasicTextInput";
export default new BasicTextInput("Text Line input commands");
