/*
pliny.class({
  parent: "Primrose.Output",
    name: "Note",
    description: "| [under construction]"
});
*/

const PIANO_BASE = Math.pow(2, 1 / 12);

import PositionalSound from "./PositionalSound";
export default class Note extends PositionalSound {

  static piano(n) {
    return 440 * Math.pow(PIANO_BASE, n - 49);
  }

  constructor(ctx, mainVolume, type){
    super(ctx, mainVolume);
    this.osc = ctx.createOscillator(),
    this.osc.type = type;
    this.osc.frequency.value = 0;
    this.osc.connect(this.gn);
    this.osc.start();
  }

  get ready(){
    return this.gn.gain.value === 0;
  }

  on(i, volume, dt, ramp) {
    if(dt === undefined){
      dt = 0;
    }
    const f = Note.piano(parseFloat(i) + 1),
      t = this.ctx.currentTime + dt;
    this.gn.gain.setValueAtTime(volume, t);
    if(ramp){
      this.osc.frequency.exponentialRampToValueAtTime(f, t);
    }
    else {
      this.osc.frequency.setValueAtTime(f, t);
    }
    return this;
  }

  off(dt) {
    if(dt === undefined){
      dt = 0;
    }
    const t = this.ctx.currentTime + dt;
    this.gn.gain.setValueAtTime(0, t);
    this.osc.frequency.setValueAtTime(0, t);
    return this;
  }
}
