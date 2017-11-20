/*
pliny.class({
  parent: "Primrose.Output",
    name: "Speech",
    description: "| [under construction]"
});
*/

const DEFAULT_SPEECH_SETTINGS = {
  remoteVoices: true,
  volume: 1,
  rate: 1,
  pitch: 1,
  voice: 0
};

export default class Speech {
  constructor (options) {
    this.options = Object.assign({}, DEFAULT_SPEECH_SETTINGS, options);
    if(Speech.isAvailable) {
      const getVoices = () => {
        this.voices = speechSynthesis
          .getVoices()
          .filter((v) => this.options.remoteVoices || v.default || v.localService);
        this.voiceNames = this.voices.map((voice) => voice.name);
      };

      getVoices();
      speechSynthesis.onvoiceschanged = getVoices;
    }
  }

  static get isAvailable () {
    return !!window.speechSynthesis;
  }

  get speaking(){
    return Speech.isAvailable && speechSynthesis.speaking;
  }

  speak(txt, opts) {
    if(Speech.isAvailable) {
      return new Promise((resolve, reject) => {
        var msg = new SpeechSynthesisUtterance();
        msg.voice = this.voices[opts && opts.voice || this.options.voice];
        msg.volume = opts && opts.volume || this.options.volume;
        msg.rate = opts && opts.rate || this.options.rate;
        msg.pitch = opts && opts.pitch || this.options.pitch;
        msg.text = txt;
        msg.onend = resolve;
        msg.onerror = reject;
        speechSynthesis.speak(msg);
      });
    }
    else{
      return Promise.reject();
    }
  }
};
