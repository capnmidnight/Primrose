(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Preloader = factory());
}(this, (function () { 'use strict';

function get(file, done) {
  const x = new XMLHttpRequest();
  x.onload = done && function(){ done(x.response); };
  x.onprogress = prog && prog.thunk;
  x.open("GET", file);
  x.send();
}

if(!window.PRIMROSE_TELEMETRY_OPT_OUT) {
  get("https://www.primrosevr.com/telemetry");
}

function findProgressBar() {
  if(!prog.bar){
    prog.bar = document.querySelector("progress");
  }
}

const prog = {
  bar: null,
  files: {},
  loaded: 0,
  total: 0,

  shrink: (size) => {
    findProgressBar();
    if(prog.bar) {
      prog.bar.style.height = size;
    }
  },

  hide: () => {
    findProgressBar();
    if(prog.bar) {
      prog.bar.style.display = "none";
    }
  },

  thunk: (evt) => {
    const file = evt.target.responseURL || evt.target.currentSrc;
    if(file){
      if(!prog.files[file]){
        prog.files[file] = {};
      }
      const f = prog.files[file];
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
    for(var key in prog.files){
      const f = prog.files[key];
      loaded += f.loaded;
      total += f.total;
    }

    prog.loaded = loaded;
    prog.total = total;

    findProgressBar();

    if(prog.bar && total){
      prog.bar.max = total;
      prog.bar.value = loaded;
    }
  }
};
const curScripts = document.querySelectorAll("script");
const curScript = curScripts[curScripts.length - 1];
const scripts = [];

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

let loaded = 0;
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


if(curScript && curScript.dataset.files) {
  curScript.dataset.files.split(",").forEach(getNextScript);
}

return prog;

})));
//# sourceMappingURL=preloader.js.map
