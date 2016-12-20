const env = new Primrose.BrowserEnvironment({
  backgroundColor: 0x000000,
  groundTexture: "../images/deck.png",
  useFog: true,
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  progress: Preloader.thunk
});

env.addEventListener("ready", Preloader.hide);
