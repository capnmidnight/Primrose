/*
pliny.class({
  parent: "Primrose.Replay",
  name: "Watcher",
  description: "| [under construction]"
});
*/

import Obj from "./Obj";
import Record from "./Record";

export default class Watcher extends Obj {
  constructor(path, root) {
    super(path, root);

    let lastValue = null;
    this.read = () => {
      const value = this.get();
      if (value !== this.lastValue) {
        this.lastValue = value;
        return new Record(this.path, value, root);
      }
      else {
        return null;
      }
    };
  }
};
