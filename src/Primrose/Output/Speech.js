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
          remoteVoices: true,
          volume: 1,
          rate: 1,
          pitch: 1,
          voice: 0
        });

        const getVoices = () => {
          this.voices = speechSynthesis
            .getVoices()
            .filter((v) => this.options.remoteVoices || v.default || v.localService);
          this.voiceNames = this.voices.map((voice) => voice.name);
        };

        getVoices();
        speechSynthesis.onvoiceschanged = getVoices;
      }

      get speaking(){
        return speechSynthesis.speaking;
      }

      speak(txt, opts) {
        return new Promise((resolve, reject) => {
          var msg = new SpeechSynthesisUtterance();
          msg.voice = this.voices[opts && opts.voice || this.options.voice];
          msg.volume = opts && opts.volume || this.options.volume;
          msg.rate = opts && opts.rate || this.options.rate;
          msg.pitch = opts && opts.pitch || this.options.pitch;
          msg.text = txt;
          msg.onend = resolve;
          msg.onerror = reject;
          msg.onboundary = console.log.bind(console, "boundary");
          speechSynthesis.speak(msg);
        });
      }
    };
  }
  else {
    // in case of error, return a shim that lets us continue unabated
    return class {
      speak() {}
    };
  }
})();