pliny.class({
  parent: "Primrose.Replay",
  name: "Automator",
  description: "| [under construction]"
});

import AbstractEventEmitter from "../AbstractEventEmitter";

export default class Automator extends AbstractEventEmitter {
  constructor(root = window) {
    super();
    this.root = root;
    this.frames = [];
    this.startT = null;
  }

  update(t) {
    if (this.startT === null) {
      this.startT = t;
    }
  }

  reset() {
    this.frames.splice(0);
    this.startT = null;
  }

  get length() {
    return this.frames.length;
  }
};