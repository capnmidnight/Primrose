const env = new Primrose.BrowserEnvironment({
  backgroundColor: 0x000000,
  groundTexture: "../images/deck.png",
  useFog: true,
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  nonstandardNeckLength: 0.15,
  nonstandardNeckDepth: 0.075,
  progress: Preloader.thunk
});

env.addEventListener("ready", Preloader.hide);
