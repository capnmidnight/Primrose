/* polyfill */
Window.prototype.AudioContext =
  Window.prototype.AudioContext ||
  Window.prototype.webkitAudioContext ||
  function () {};

var PIANO_BASE = Math.pow(2, 1 / 12),
  MAX_NOTE_COUNT = (navigator.maxTouchPoints || 10) + 1,
  TYPES = ["sine",
    "square",
    "sawtooth",
    "triangle"
  ];

pliny.class({
  parent: "Primrose.Output",
    name: "Music",
    description: "| [under construction]"
});
class Music {
  static piano(n) {
    return 440 * Math.pow(PIANO_BASE, n - 49);
  }

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
          var g = ctx.createGain(),
            o = ctx.createOscillator(),
            p = ctx.createPanner();
          g.connect(p);
          p.connect(this.mainVolume);
          g.gain.value = 0;
          o.type = type;
          o.frequency.value = 0;
          o.connect(g);
          o.start();
          oscs.push({
            osc: o,
            gn: g,
            pnr: p,
            timeout: null,
            index: oscs.length
          });
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

  play (type, i, volume, duration, x, y, z, dx, dy, dz, dt, n) {
    if (this.isAvailable) {
      x = x || 0;
      y = y || 0;
      z = z || 0;
      if(dx === undefined || dx === null) {
        dx = 0;
      }
      dy = dy || 0;
      dz = dz || 0;
      dt = dt || 0;

      const osc = this.oscillators[type];
      if(n === undefined || n === null){
        for(n = 0; n < osc.length; ++n){
          if(!osc[n].timeout){
            break;
          }
        }
      }

      const o = osc[n % this.numNotes],
        f = Music.piano(parseFloat(i) + 1);
      let t = this.audio.context.currentTime + dt;
      o.gn.gain.setValueAtTime(volume, t);
      o.osc.frequency.setValueAtTime(f, t);
      o.pnr.setPosition(x, y, z);
      o.pnr.setOrientation(dx, dy, dz);
      t += duration;
      o.gn.gain.setValueAtTime(0, t);
      o.osc.frequency.setValueAtTime(0, t);
      dt = t - performance.now() / 1000;
      return new Promise((resolve, reject) => setTimeout(resolve, dt * 1000));
    }
  }
}

Music.TYPES = TYPES;