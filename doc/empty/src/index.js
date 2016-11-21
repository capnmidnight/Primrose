import randNum from "../../../src/Primrose/Random/number";
import BrowserEnvironment from "../../../src/Primrose/BrowserEnvironment";
import ModelLoader from "../../../src/Primrose/Graphics/ModelLoader";

var dim = 100,
  hDim = dim / 2,
  rand = () => randNum(0, dim),
  randDegree = () => randNum(-Math.PI, Math.PI),
  env = new BrowserEnvironment({
    backgroundColor: 0x000000,
    groundTexture: "../images/deck.png",
    useFog: true,
    drawDistance: hDim + 1,
    fullScreenButtonContainer: "#fullScreenButtonContainer"
  });

export { env };

env.addEventListener("ready", function(){
  ModelLoader.loadModel("../models/cardboard.obj")
    .then(buildScene);
});

function buildScene(gc) {
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
  }
}