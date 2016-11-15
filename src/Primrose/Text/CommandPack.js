pliny.class({
  parent: "Primrose.Text",
    name: "CommandPack",
    description: "| [under construction]"
});
export default class CommandPack {
  constructor (name, commands) {
    this.name = name;
    Object.assign(this, commands);
  }
};