function wrap(thunk) {
  return function(evt) {
    this.speaking = false;
    thunk(evt);
  };
}

pliny.class({
  parent: "Primrose.Output",
    name: "Speech",
    description: "| [under construction]"
});
const Speech = (function(){
  if(window.speechSynthesis !== undefined) {
    return class {
      constructor (options) {
        this.options = patch(options, {
          remoteVoices: false,
          volume: 1,
          rate: 2,
          pitch: 2,
          voice: 0
        });
        this.voices = speechSynthesis
          .getVoices()
          .filter((v) => this.options.remoteVoices || v.default || v.localService);
        this.speaking = false;
      }

      speak(txt, opts) {
        return new Promise((resolve, reject) => {
          this.speaking = true;
          var msg = new SpeechSynthesisUtterance();
          msg.voice = this.voices[opts && opts.voice || this.options.voice];
          msg.volume = opts && opts.volume || this.options.volume;
          msg.rate = opts && opts.rate || this.options.rate;
          msg.pitch = opts && opts.pitch || this.options.pitch;
          msg.text = txt;
          msg.onend = wrap(resolve).bind(this);
          msg.onerror = wrap(reject).bind(this);
          speechSynthesis.speak(msg);
        });
      }
    }
  }
  else {
    // in case of error, return a shim that lets us continue unabated
    return function () {
      this.speak = function () {};
    };
  }
})();