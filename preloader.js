(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Preloader = factory());
}(this, (function () { 'use strict';

const prog = {
  bar: null,
  files: {},
  loaded: 0,
  total: 0,

  findProgressBar() {
    if(!this.bar){
      this.bar = document.querySelector("progress");
    }
  },

  shrink(size){
    this.findProgressBar();
    if(this.bar) {
      this.bar.style.height = size;
    }
  },

  hide() {
    this.findProgressBar();
    if(this.bar) {
      this.bar.style.display = "none";
    }
  },

  thunk(evt) {
    const file = evt.target.responseURL || evt.target.currentSrc;
    if(file){
      if(!this.files[file]){
        this.files[file] = {};
      }
      const f = this.files[file];
      if(typeof evt.loaded === "number") {
        f.loaded = evt.loaded;
        f.total = evt.total;
      }
      else if(evt.srcElement) {
        const bs = evt.srcElement.buffered;
        let min = Number.MAX_VALUE,
          max = Number.MIN_VALUE;
        for(let i = 0; i < bs.length; ++i){
          min = Math.min(min, bs.start(i));
          max = Math.max(max, bs.end(i));
        }
        f.loaded = 1000 * max;
        f.total = 1000 * evt.srcElement.duration;
      }
    }

    let total = 0, loaded = 0;
    for(var key in this.files){
      const f = this.files[key];
      loaded += f.loaded;
      total += f.total;
    }

    this.loaded = loaded;
    this.total = total;

    this.findProgressBar();

    if(this.bar && total){
      this.bar.max = total;
      this.bar.value = loaded;
    }
  }
};
const curScripts = document.querySelectorAll("script");
const curScript = curScripts[curScripts.length - 1];
const scripts = [];

["findProgressBar", "shrink", "hide", "thunk"].forEach((n) => prog[n] = prog[n].bind(prog));

let loaded = 0;

function get(file, done) {
  const x = new XMLHttpRequest();
  x.onload = done && function(){ done(x.response); };
  x.onprogress = prog && prog.thunk;
  x.open("GET", file);
  x.send();
}

function installScripts() {
  if(!document.body){
    setTimeout(installScripts, 0);
  }
  else if(window.DEBUG) {
    if(scripts.length > 0) {
      const file = scripts.shift(),
        s = document.createElement("script");
      s.src = file;
      s.onload = installScripts;
      document.body.appendChild(s);
    }
  }
  else{
    const s = document.createElement("script");
    s.innerHTML = scripts.join("\n");
    document.body.appendChild(s);
  }
}

function getNextScript(file, i, arr) {
  get(file, (contents) => {
    if(window.DEBUG) {
      scripts[i] = file;
    }
    else{
      scripts[i] = contents;
    }
    ++loaded;
    if(loaded === arr.length) {
      installScripts();
    }
  });
}

if(!window.PRIMROSE_TELEMETRY_OPT_OUT) {
  get("https://www.primrosevr.com/telemetry");
}

if(curScript && curScript.dataset.files) {
  curScript.dataset.files.split(",").forEach(getNextScript);
}

return prog;

})));
//# sourceMappingURL=preloader.js.map
