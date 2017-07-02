var env = new Primrose.BrowserEnvironment({
  backgroundColor: 0x000000,
  groundTexture: "../shared_assets/images/deck.png",
  useFog: true,
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  nonstandardNeckLength: 0.15,
  nonstandardNeckDepth: 0.075
});

for(var i = 0; i < 50; ++i){
  box(Primrose.Random.number(0.1, 0.2))
    .colored(Primrose.Random.color())
    .phys({ mass: 1 })
    .at(
      Primrose.Random.number(-0.5, 0.5),
      Primrose.Random.number(1, 2),
      Primrose.Random.number(-1.5, -2.5))
    .linearDamping(0.5)
    .angularDamping(0.75)
    .on("enter", function() {
      this.velocity.y = Primrose.Random.number(5, 10);
    })
    .addTo(env.scene);
}
