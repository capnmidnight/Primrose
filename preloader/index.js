function get(file, done) {
  const x = new XMLHttpRequest();
  x.onload = () => done(x.response);
  x.onprogress = prog.thunk;
  x.open("GET", file);
  x.send();
}

const prog = {
  bar: null,
  files: {},
  loaded: 0,
  total: 0,

  hide: () => {
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
      else{
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
    for(const key in prog.files){
      const f = prog.files[key];
      loaded += f.loaded;
      total += f.total;
    }

    prog.loaded = loaded;
    prog.total = total;

    if(!prog.bar){
      prog.bar = document.querySelector("progress");
    }

    if(prog.bar && total){
      prog.bar.max = total;
      prog.bar.value = loaded;
    }
  }
},

  curScripts = document.querySelectorAll("script"),
  curScript = curScripts[curScripts.length - 1];

function getNextScript(files) {
  if(files.length > 0){
    const file = files.shift();
    get(file, (contents) => {
      const s = document.createElement("script");
      s.type = "text/javascript";
      if(window.DEBUG) {
        s.src = file;
        s.onload = getNextScript.bind(null, files);
      }
      else{
        s.innerHTML = contents;
        setTimeout(getNextScript, 0, files);
      }
      document.body.appendChild(s);
    });
  }
}


if(curScript && curScript.dataset.files) {
  getNextScript(curScript.dataset.files.split(","));
}

export default prog;