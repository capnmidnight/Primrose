/*
pliny.class({
  parent: "Primrose.Output",
    name: "Music",
    description: "| [under construction]"
});
*/

var MAX_NOTE_COUNT = (navigator.maxTouchPoints || 10) + 1,
  TYPES = ["sine",
    "square",
    "sawtooth",
    "triangle"
  ];

import Note from "./Note";
export default class Music {

  constructor(audio, numNotes) {
    if (numNotes === undefined) {
      numNotes = MAX_NOTE_COUNT;
    }

    this.oscillators = {};
    this.isAvailable = false;
    this.audio = audio;
    this.audio.ready.then(() => {
      const ctx = this.audio.context;
      this.mainVolume = ctx.createGain();
      this.mainVolume.connect(this.audio.mainVolume);
      this.mainVolume.gain.value = 1;
      this.numNotes = numNotes;
      TYPES.forEach((type) => {
        const oscs = this.oscillators[type] = [];
        this[type] = this.play.bind(this, type);
        for (var i = 0; i < this.numNotes; ++i) {
          oscs.push(new Note(ctx, this.mainVolume, type));
        }
      });
      this.isAvailable = true;
    });
  }

  get type() {
    return this._type;
  }

  set type(v){
    if(this.isAvailable){
      this._type = v;
      this.oscillators.forEach((o) => o.osc.type = this._type);
    }
  }

  getOsc(type){
    const osc = this.oscillators[type];
    let n;
    for(n = 0; n < osc.length; ++n){
      if(osc[n].ready){
        break;
      }
    }

    return osc[n % this.numNotes];
  }

  play (type, i, volume, duration, dt) {
    if(dt === undefined){
      dt = 0;
    }
    const o = this.getOsc(type)
      .on(i, volume, dt);
    dt += duration;
    o.off(dt);
    dt = this.audio.context.currentTime + dt - performance.now() / 1000;
    return o;
  }
}

Music.TYPES = TYPES;
