const env = new Primrose.BrowserEnvironment({
    useGaze: isMobile,
    useFog: true,
    enableShadows: true,
    groundTexture: 0x606060,
    backgroundColor: 0xd0d0d0,
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    progress: Preloader.thunk
  }).on("ready", function() {

    for(var i = 0; i < 10; ++i) {
      box(0.125)
        .colored(Primrose.Random.color(), {
          shadow: true
        })
        .named("box" + i)
        .addTo(env.scene)
        .at(
          Primrose.Random.number(-1, 1),
          Primrose.Random.number(0, 2),
          Primrose.Random.number(-1, -3))
        .on("select", function() {
          this.visible = false;
        });
    }

    Preloader.hide();
  });
