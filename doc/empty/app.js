"use strict";
var env = new Primrose.BrowserEnvironment("My Primrose VR Application", {
  skyTexture: "../images/bg.jpg",
  ambientSound: "../audio/wind.ogg",
  groundTexture: "../images/deck.png",
  fullScreenIcon: "../models/monitor.obj",
  VRIcon: "../models/cardboard.obj",
  font: "../fonts/helvetiker_regular.typeface.js"
});

env.addEventListener("ready", function () {
  // Perform any post-initialization setup. Once this event fires, the Primrose
  // framework is ready and will start animation as soon as this function returns.
});

env.addEventListener("gazecomplete", function (evt) {
  // You can respond to "intended stare" events here, i.e. when the user gazes
  // at a particular object for an extended period of time. Usually, about three
  // seconds.
});

env.addEventListener("pointerend", function (evt) {
  // You can respond to the user "clicking" an object here. This could be by using
  // a mouse on their desktop PC or by touching the screen while looking at an
  // object on a mobile device.
});

env.addEventListener("update", function (dt) {
  // Perform per-frame updates here, like moving objects around according to your
  // own rules.
});