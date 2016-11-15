pliny.class({
  parent: "Primrose.Text",
    name: "CommandPack",
    description: "| [under construction]"
});
import copyObject from "../../util/copyObject";
export default class CommandPack {
  constructor (name, commands) {
    this.name = name;
    copyObject(this, commands);
  }
};