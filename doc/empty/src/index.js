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

env.addEventListener("ready", function(){
});

env.addEventListener("update", function(){
});