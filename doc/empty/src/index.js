import BrowserEnvironment from "../../../src/Primrose/BrowserEnvironment";
import Image from "../../../src/Primrose/Controls/Image";
import * as liveAPI from "../../../src/live-api";

Object.assign(window, liveAPI);

const env = new BrowserEnvironment({
    backgroundColor: 0x000000,
    groundTexture: "../images/deck.png",
    useFog: true,
    drawDistance: 100,
    fullScreenButtonContainer: "#fullScreenButtonContainer"
  });

window.env = env;
window.cam = null;

env.addEventListener("ready", function(){
  cam = put(camera(1))
    .on(env.input.head)
    .at(0, -0.125, -0.75)
    .rot(-Math.PI / 8, 0, 0)
    .obj();
  cam.ready.then(console.log.bind(console, "camera ready"));
});

env.addEventListener("update", function(){
  if(cam && cam.image){
    cam.image.update();
  }
});