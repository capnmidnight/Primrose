/* polyfill */
Window.prototype.AudioContext =
  Window.prototype.AudioContext ||
  Window.prototype.webkitAudioContext ||
  function () {};

var PIANO_BASE = Math.pow(2, 1 / 12),
  MAX_NOTE_COUNT = (navigator.maxTouchPoints || 10) + 1;

function piano(n) {
  return 440 * Math.pow(PIANO_BASE, n - 49);
}

pliny.class({
  parent: "Primrose.Output",
    name: "Music",
    description: "| [under construction]"
});
class Music {
  constructor(audio, type, numNotes) {
    if (numNotes === undefined) {
      numNotes = MAX_NOTE_COUNT;
    }
    this._type = type || "sawtooth";
    this.isAvailable = false;
    this.audio = audio;
    this.audio.ready.then(() => {
      const ctx = this.audio.context;
      this.mainVolume = ctx.createGain();
      this.mainVolume.connect(this.audio.mainVolume);
      this.mainVolume.gain.value = 1;
      this.numNotes = numNotes;
      this.oscillators = [];

      for (var i = 0; i < this.numNotes; ++i) {
        var g = ctx.createGain(),
          o = ctx.createOscillator();
        g.connect(this.mainVolume);
        g.gain.value = 0;
        o.type = this.type;
        o.frequency.value = 0;
        o.connect(g);
        o.start();
        this.oscillators.push({
          osc: o,
          gn: g,
          timeout: null
        });
      }
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

  noteOn (volume, i, n) {
    if (this.isAvailable) {
      if (n === undefined) {
        n = 0;
      }
      var o = this.oscillators[n % this.numNotes],
        f = piano(parseFloat(i) + 1);
      o.gn.gain.value = volume;
      o.osc.frequency.setValueAtTime(f, this.audio.context.currentTime);
      return o;
    }
  }

  noteOff (n) {
    if (this.isAvailable) {
      if (n === undefined) {
        n = 0;
      }
      var o = this.oscillators[n % this.numNotes];
      o.osc.frequency.setValueAtTime(0, this.audio.context.currentTime);
      o.gn.gain.value = 0;
    }
  }

  play (i, volume, duration, n) {
    if (this.isAvailable) {
      if (typeof n !== "number") {
        n = 0;
      }
      var o = this.noteOn(volume, i, n);
      if (o.timeout) {
        clearTimeout(o.timeout);
        o.timeout = null;
      }
      o.timeout = setTimeout((function (n, o) {
          this.noteOff(n);
          o.timeout = null;
        })
        .bind(this, n, o), duration * 1000);
    }
  }
}