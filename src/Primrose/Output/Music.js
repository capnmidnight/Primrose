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

  noteOn (type, volume, i, x, y, z, dx, dy, dz, n) {
    if (this.isAvailable) {
      x = x || 0;
      y = y || 0;
      z = z || 0;
      if(dx === undefined || dx === null) {
        dx = 0;
      }
      dy = dy || 0;
      dz = dz || 0;
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
      o.gn.gain.value = volume;
      o.osc.frequency.setValueAtTime(f, this.audio.context.currentTime);
      o.pnr.setPosition(x, y, z);
      o.pnr.setOrientation(dx, dy, dz);
      return o;
    }
  }

  noteOff (type, n) {
    if (this.isAvailable) {
      if (n === undefined) {
        n = 0;
      }
      var o = this.oscillators[type][n % this.numNotes];
      o.osc.frequency.setValueAtTime(0, this.audio.context.currentTime);
      o.gn.gain.value = 0;
    }
  }

  play (type, i, volume, duration, x, y, z, dx, dy, dz, n) {
    if (this.isAvailable) {
      return new Promise((resolve, reject) => {
        var o = this.noteOn(type, volume, i, x, y, z, dx, dy, dz, n);
        if (o.timeout) {
          clearTimeout(o.timeout);
          o.timeout = null;
          resolve();
        }
        o.timeout = setTimeout((function (o) {
            this.noteOff(type, o.index);
            o.timeout = null;
            resolve();
          })
          .bind(this, o), duration * 1000);
      });
    }
    else{
      return Promise.reject("No audio");
    }
  }
}

Music.TYPES = TYPES;