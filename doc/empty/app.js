"use strict";
var dim = 25,
  hDim = dim / 2,
  rand = () => Primrose.Random.number(0, dim),
  randDegree = () => Primrose.Random.number(-Math.PI, Math.PI),
  env = new Primrose.BrowserEnvironment({
    backgroundColor: 0x000000,
    groundTexture: "../images/deck.png",
    font: "../fonts/helvetiker_regular.typeface.json",
    useFog: true,
    drawDistance: hDim + 1
});

env.addEventListener("ready", function(){
  env.insertFullScreenButtons("body");
  Primrose.ModelLoader.loadModel("../models/cardboard.obj")
    .then(buildScene);
});

function buildScene(gc) {
  let last = null;
  for(let i = 0; i < 100; ++i){
    const m = gc.clone();
    m.position.set(
      rand() - hDim,
      rand() / 2,
      rand() - hDim
    );
    m.rotation.set(
      randDegree(),
      randDegree(),
      randDegree()
    );
    env.scene.add(m);
    last = m;
  }
}