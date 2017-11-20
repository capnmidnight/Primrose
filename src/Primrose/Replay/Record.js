/*
pliny.class({
  parent: "Primrose.Replay",
  name: "Record",
  description: "| [under construction]"
});
*/

import Obj from "./Obj";

export default class Record extends Obj {

  constructor(path, value, root) {
    super(path, root);
    this.value = value;
  }

  write() {
    if (this.value !== this.get()) {
      this.set(this.value);
    }
  }
};
