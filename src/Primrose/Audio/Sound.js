/*
pliny.class({
  parent: "Primrose.Output",
    name: "Sound",
    description: "| [under construction]"
});
*/

import PositionalSound from "./PositionalSound";
export default class Sound extends PositionalSound {
  constructor(audio3D, sources, loop){
    super(audio3D.context, audio3D.mainVolume);
    this.audio = document.createElement("audio");
    this.audio.autoplay = true;
    this.audio.preload = "auto";
    this.audio["webkit-playsinline"] = true;
    this.audio.playsinline = true;
    this.audio.loop = loop;
    this.audio.crossOrigin = "anonymous";
    console.log("Loading " + sources);
    if (!(sources instanceof Array)) {
      sources = [sources];
    }
    sources.map((src) => {
        var source = document.createElement("source");
        source.src = src;
        return source;
      })
      .forEach(this.audio.appendChild.bind(this.audio));
    this.ready = new Promise((resolve, reject) => {
      this.audio.onerror = reject;
      this.audio.oncanplay = () => {
        this.audio.oncanplay = null;
        this.node = this.ctx.createMediaElementSource(this.audio);
        this.node.connect(this.gn);
        this.gn.gain.setValueAtTime(0, this.ctx.currentTime);
        resolve(this);
      };
      this.audio.play();
    });

    document.body.appendChild(this.audio);
  }

  play(){
    this.gn.gain.setValueAtTime(1, this.ctx.currentTime);
    this.audio.play();
    return this;
  }
};
