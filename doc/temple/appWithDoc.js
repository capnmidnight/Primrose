(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

var GRASS = "../images/grass.png";
var ROCK = "../images/rock.png";
var SAND = "../images/sand.png";
var WATER = "../images/water.png";
var DECK = "../images/deck.png";
var WIDTH = 100;
var HEIGHT = 11;
var DEPTH = 100;
var MIDX = WIDTH / 2;
var MIDY = HEIGHT / 2;
var MIDZ = DEPTH / 2;
var ball = null;
var t = 0;
var dx = 7;
var dy = 2.5;
var dz = 4;
var env = new Primrose.BrowserEnvironment({
  skyTexture: "../images/bg.jpg",
  groundTexture: DECK,
  useFog: true
});

env.addEventListener("ready", function () {

  var start = put(hub()).on(this.scene).at(-MIDX, 0, -MIDZ).obj();

  var ceiling = brick(DECK, WIDTH, 0.1, DEPTH, {
    resolve: function resolve() {
      put(ceiling).on(start).at(WIDTH / 2, 12.5, DEPTH / 2);
    }
  }).named("Ceiling");

  var verts = [];

  ball = brick(ROCK, 1, 1, 1, {
    resolve: function resolve() {
      put(ball).on(start).at(0, 0, 0);
    }
  }).named("Ball");

  for (var i = 0; i < 5000; ++i) {
    verts.push(v3(Primrose.Random.number(-0.5 * WIDTH, 0.5 * WIDTH), Primrose.Random.number(-0.5 * HEIGHT, 0.5 * HEIGHT), Primrose.Random.number(-0.5 * DEPTH, 0.5 * DEPTH)));
  }

  put(cloud(verts, this.options.backgroundColor, 0.05)).on(start).at(MIDX, MIDY, MIDZ);

  function makeSphere(r, p) {
    verts.splice(0);
    var rr = r * r;
    for (var x = -r; x <= r; x += p) {
      var dx = x * x;
      for (var y = -r; y <= r; y += p) {
        var dy = y * y;
        if (dx + dy < rr) {
          var z = Math.sqrt(rr - dx - dy);
          verts.push(v3(x, z, y));
          verts.push(v3(x, -z, y));
        }
      }
    }
    put(cloud(verts, 0xff0000, p * Math.sqrt(2))).on(start).at(MIDX - r, r, MIDZ - r);
  }

  makeSphere(10, 0.1);

  function column(a, b, h, x, y, z) {
    var obj = textured(cylinder(a, b, h, 6, 1), SAND, {
      resolve: function resolve() {
        put(obj).on(start).at(x, y, z);
      }
    });
  }

  for (var i = 0; i < 100; ++i) {
    var x = Primrose.Random.int(WIDTH),
        z = Primrose.Random.int(DEPTH);
    column(0.5, 1, 1, x, 0, z);
    column(0.5, 0.5, 11, x, 6, z);
    column(2, 0.5, 1, x, 12, z);
  }
}.bind(env));

env.addEventListener("update", function (dt) {
  t += dt;

  ball.position.x += dx * dt;
  ball.position.y += dy * dt;
  ball.position.z += dz * dt;
  if (ball.position.x < 0 && dx < 0 || WIDTH <= ball.position.x && dx > 0) {
    dx *= -1;
  }
  if (ball.position.y < 1 && dy < 0 || HEIGHT <= ball.position.y && dy > 0) {
    dy *= -1;
  }
  if (ball.position.z < 0 && dz < 0 || DEPTH <= ball.position.z && dz > 0) {
    dz *= -1;
  }
});

})));
