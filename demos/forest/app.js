var env = new Primrose.BrowserEnvironment({
  font: "../shared_assets/fonts/helvetiker_regular.typeface.json",
  backgroundColor: 0xC9E6EE,
  groundModel: "Ground.obj",
  useFog: true,
  enableShadows: true,
  shadowRadius: 3,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  progress: Preloader.thunk
});

var MF = Primrose.Graphics.ModelFactory;

env.addEventListener("ready", function() {
  Promise.all([

    MF.loadObject("Water.obj").then(function(waterModel) {
      waterModel.addTo(env.scene);
    }),

    MF.loadModel("tree.obj").then(function(treeFactory) {
      treeFactory.template.castShadow = true;
      treeFactory.template.receiveShadow = true;
      for(var i = 0; i < 100; ++i) {

        var tree = treeFactory.clone()
          .named("tree" + i)
          .addTo(env.scene)
          .rot(
            0,
            Primrose.Random.number(0, Math.PI),
            0)
          .scl(
            1,
            Primrose.Random.number(0.7, 1.3),
            1);


        do {
          tree.position.set(
            Primrose.Random.number(-25, 25),
            0,
            Primrose.Random.number(-25, 25));
          tree.position.y = env.ground.getHeightAt(tree.position);
        } while(tree.position.y === undefined);

      }
    })]).then(Preloader.hide);
});
