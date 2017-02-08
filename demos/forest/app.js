var env = new Primrose.BrowserEnvironment({
  font: "../shared_assets/fonts/helvetiker_regular.typeface.json",
  backgroundColor: 0x07001f,
  groundTexture: "../shared_assets/images/grass.png",
  useFog: true,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  progress: Preloader.thunk
});

var treeReady = Primrose.Graphics.ModelFactory.loadModel("tree.obj");

env.addEventListener("ready", function() {
  treeReady.then(function(treeModel) {
    for(var i = 0; i < 100; ++i) {
      treeModel.clone()
        .named("tree" + i)
        .addTo(env.scene)
        .at(
          Primrose.Random.number(-25, 25),
          0,
          Primrose.Random.number(-25, 25));
    }
    Preloader.hide();
  });
});
