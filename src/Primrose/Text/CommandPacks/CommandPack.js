/*
pliny.class({
  parent: "Primrose.Text",
    name: "CommandPack",
    description: "A CommandPack is a collection of key sequences and text editor commands. It provides a means of using a single text rendering control to create a variety of text-controls that utilize the text space differently.",
    parameters: [{
      name: "commandPackName",
      type: "String",
      description: "A friendly name for the command pack."
    }, {
      name: "commands",
      type: "Object",
      description: "An object literal of key-value pairs describing the commands.\n\
\n\
* The object key elements are strings describing the key sequence that activates the command.\n\
* The value elements are the action that occurs when the command is activated."
    }]
});
*/
export default class CommandPack {
  constructor (commandPackName, commands) {
    this.name = commandPackName;
    Object.assign(this, commands);
  }
};
