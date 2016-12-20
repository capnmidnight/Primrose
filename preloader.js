(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Preloader = factory());
}(this, (function () { 'use strict';

function get(file, done) {
  var x = new XMLHttpRequest();
  x.onload = function () {
    return done(x.response);
  };
  x.onprogress = prog.thunk;
  x.open("GET", file);
  x.send();
}

var prog = {
  bar: null,
  files: {},
  loaded: 0,
  total: 0,

  hide: function hide() {
    if (prog.bar) {
      prog.bar.style.display = "none";
    }
  },

  thunk: function thunk(evt) {
    var file = evt.target.responseURL || evt.target.currentSrc;
    if (file) {
      if (!prog.files[file]) {
        prog.files[file] = {};
      }
      var f = prog.files[file];
      if (typeof evt.loaded === "number") {
        f.loaded = evt.loaded;
        f.total = evt.total;
      } else {
        var bs = evt.srcElement.buffered;
        var min = Number.MAX_VALUE,
            max = Number.MIN_VALUE;
        for (var i = 0; i < bs.length; ++i) {
          min = Math.min(min, bs.start(i));
          max = Math.max(max, bs.end(i));
        }
        f.loaded = 1000 * max;
        f.total = 1000 * evt.srcElement.duration;
      }
    }

    var total = 0,
        loaded = 0;
    for (var key in prog.files) {
      var _f = prog.files[key];
      loaded += _f.loaded;
      total += _f.total;
    }

    prog.loaded = loaded;
    prog.total = total;

    if (!prog.bar) {
      prog.bar = document.querySelector("progress");
    }

    if (prog.bar && total) {
      prog.bar.max = total;
      prog.bar.value = loaded;
    }
  }
};
var curScripts = document.querySelectorAll("script");
var curScript = curScripts[curScripts.length - 1];

function getNextScript(files) {
  if (files.length > 0) {
    (function () {
      var file = files.shift();
      get(file, function (contents) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        if (window.DEBUG) {
          s.src = file;
          s.onload = getNextScript.bind(null, files);
        } else {
          s.innerHTML = contents;
          setTimeout(getNextScript, 0, files);
        }
        document.body.appendChild(s);
      });
    })();
  }
}

if (curScript && curScript.dataset.files) {
  getNextScript(curScript.dataset.files.split(","));
}

return prog;

})));
