(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

var height = 8;
var width = 4;
var numButtons = width * height;
var midWidth = (width - 1) / 2;
var midHeight = (height - 1) / 2;
var colorOn = 0xffffff;
var colorOff = 0xff0000;
var colorPlay = 0xffff00;
var boards = [];
var t = 0;
var measure = 0;
var lastMeasure = null;
var padSize = 0.22;
var padDepth = 0.02;
var textSize = 0.05;
var skipOne = false;
var perMeasure = 2 / height;
var DIST = v3();
var env = new Primrose.BrowserEnvironment({
  groundTexture: "https://www.primrosevr.com/doc/images/deck.png",
  font: "https://primrosevr.com/doc/fonts/helvetiker_regular.typeface.json",
  backgroundColor: 0x000000,
  useFog: true,
  useGaze: isMobile,
  drawDistance: 10,
  fullScreenButtonContainer: "body"
});

function Board(type) {
  this.object = hub();
  this.title = put(text3D(0.15, type).center().colored(colorPlay).named("text" + type)).on(this.object).at(0, 0.7, -1.3).obj();
  this.btns = [];
  this.btnState = [];
  this.type = type;
  range(numButtons, function (i) {
    var x = Math.floor(i / height),
        y = i % height,
        lon = (midWidth - x) * 10,
        lat = (y - midHeight) * 10,
        btn = box(padSize, padSize, padDepth).colored(colorOff).named("btn" + i).latLon(lat, lon);
    put(box(padSize * 1.1, padSize * 1.1, padDepth * 0.9).colored(colorPlay).named("bevel" + i)).on(btn);
    env.registerPickableObject(btn);
    btn.onselect = this.select.bind(this, i);
    btn.onenter = this.play.bind(this, i, 0);
    this.object.add(btn);
    this.btns.push(btn);
  }.bind(this));
}

Board.prototype.play = function (i, dt) {
  this.highlight(i, colorPlay);
  this.object.getWorldDirection(DIST);
  var duration = perMeasure * 0.85;
  env.music.play(this.type, 25 - numButtons + i * 3, 0.25, duration, dt).at(this.object.x, this.object.y, this.object.z, DIST.x, DIST.y, DIST.z);
  setTimeout(this.highlight.bind(this, i), duration * 1000);
};

Board.prototype.update = function () {
  if (measure !== lastMeasure) {
    var time = env.audio.context.currentTime,
        measureTime = perMeasure * Math.ceil(time / perMeasure),
        dt = measureTime - time;
    for (var y = 0; y < width; ++y) {
      var i = y * height + measure;
      if (this.btnState[i]) {
        this.play(i, dt);
      }
    }
  }
  DIST.set(this.object.position.x, env.input.head.position.y, this.object.position.z);
  this.object.position.lerp(DIST, 0.01);
};

Board.prototype.highlight = function (i, color) {
  color = color || this.btnState[i] && colorOn || colorOff;
  var btn = this.btns[i];
  btn.colored(color).named(btn.name);
};

Board.prototype.select = function (i, evt) {
  if (!env.input.hasMouse || evt.pointer.name === "MousePointer") {
    this.btnState[i] = !this.btnState[i];
    this.highlight(i);
  }
};

env.addEventListener("ready", function () {
  var types = Primrose.Audio.Music.TYPES,
      nTypes = types.length;
  types.forEach(function (type, t) {
    var board = new Board(type);
    boards.push(board);
    env.scene.add(board.object);
    board.object.latLon(0, (t - (nTypes - 1) / 2) * 100 / nTypes);
  });
});

env.addEventListener("update", function (dt) {
  if (!skipOne) {
    t += dt;
    if (t > perMeasure) {
      t -= perMeasure;
      measure = (measure + 1) % height;
    }
    boards.forEach(function (board) {
      return board.update();
    });
    lastMeasure = measure;
  }
  skipOne = false;
});

window.addEventListener("focus", function () {
  return skipOne = true;
});

})));
