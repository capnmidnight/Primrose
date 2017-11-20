/*
pliny.class({
  parent: "Primrose.Replay",
  name: "Player",
  description: "| [under construction]"
});
*/

import Automator from "./Automator";
import Frame from "./Frame";

export default class Player extends Automator {

  constructor(root) {
    super(root);
    this.frameIndex = -1;
  }

  parse(json) {
    this.load(JSON.parse(json));
  }

  load(objs) {
    const frames = [];

    for (var t in objs) {
      frames.push(Frame.parse(t, objs[t], this.root));
    }

    this.append(frames);
  }

  reset() {
    super.reset();
    this.frameIndex = -1;
  }

  update(t) {
    super.update(t);

    t += this.minT - this.startT;

    const oldFrameIndex = this.frameIndex;
    while (this.frameIndex < this.frames.length - 1 &&
      t >= this.frames[this.frameIndex + 1].t) {
      ++this.frameIndex;
    }

    if (this.frameIndex !== oldFrameIndex && 0 <= this.frameIndex && this.frameIndex < this.frames.length) {
      const frame = this.frames[this.frameIndex];
      frame.write();
      this.emit("frame", frame);
    }
  }

  append(frames) {
    if (frames) {
      this.frames.push.apply(this.frames, frames);
      this.minT = this.frames.map((f) => f.t)
        .reduce((a, b) => Math.min(a, b), Number.MAX_VALUE);
    }
  }

  reverse() {
    const maxT = this.frames.map((f) => f.t)
      .reduce((a, b) => Math.max(a, b), Number.MIN_VALUE);
    this.frames.reverse();
    for (var i = 0; i < this.frames.length; ++i) {
      var frame = this.frames[i];
      frame.t = maxT - frame.t + this.minT;
    }
  }

  get done() {
    return this.frameIndex >= this.frames.length - 1;
  }
};
