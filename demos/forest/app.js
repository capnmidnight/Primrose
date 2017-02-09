var env = new Primrose.BrowserEnvironment({
  font: "../shared_assets/fonts/helvetiker_regular.typeface.json",
  backgroundColor: 0xC9E6EE,
  groundTexture: "../shared_assets/images/grass.png",
  useFog: true,
  enableShadows: true,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  progress: Preloader.thunk
});

var treeReady = Primrose.Graphics.ModelFactory.loadModel("tree.obj");

env.addEventListener("ready", function() {
  treeReady.then(function(treeModel) {
    treeModel.template.castShadow = true;
    treeModel.template.receiveShadow = true;
    for(var i = 0; i < 100; ++i) {
      treeModel.clone()
        .named("tree" + i)
        .addTo(env.scene)
        .at(
          Primrose.Random.number(-25, 25),
          0,
          Primrose.Random.number(-25, 25))
        .rot(
          0,
          Primrose.Random.number(0, Math.PI),
          0)
        .scl(
          1,
          Primrose.Random.number(0.7, 1.3),
          1);
    }
    Preloader.hide();
  });
});
