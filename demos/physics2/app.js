var env = new Primrose.BrowserEnvironment({
    backgroundColor: 0x000000,
    groundTexture: "../shared_assets/images/deck.png",
    useFog: true,
    drawDistance: 100,
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    nonstandardNeckLength: 0.15,
    nonstandardNeckDepth: 0.075,
    gravity: 0,
  }),

  spheres = [],
  springs = [],
  repellers = [];

var TEMP = v3();

env.physics.addEventListener("preStep", function(event) {
  for(var i = 0; i < repellers.length; ++i){
    var r = repellers[i],
      a = r[0],
      b = r[1],
      o = r[2];

    TEMP.copy(b.rigidBody.position).sub(a.rigidBody.position);
    var d = TEMP.length();
    TEMP.multiplyScalar(o.force / Math.pow(d, 3));
    b.rigidBody.force.vadd(TEMP, b.rigidBody.force);
    TEMP.negate();
    a.rigidBody.force.vadd(TEMP, a.rigidBody.force);
  }
});

env.physics.addEventListener("postStep", function(event) {
  for(var i = 0; i < springs.length; ++i){
    springs[i].applyForce();
  }
});

for(var i = 0; i < 50; ++i){
  var a = sphere(Primrose.Random.number(0.1, 0.2), 20, 20)
    .colored(Primrose.Random.color())
    .phys({ mass: i })
    .addTo(env.scene)
    .at(
      Primrose.Random.number(-0.5, 0.5),
      Primrose.Random.number(1, 2),
      Primrose.Random.number(-1.5, -2.5))
    .vel(
      Primrose.Random.number(-1, 1),
      Primrose.Random.number(-1, 1),
      Primrose.Random.number(-1, 1))
    .linearDamping(0.5)
    .angularDamping(0.75)
    .on("enter", function() {
      this.velocity.y = Primrose.Random.number(5, 10);
    });

  spheres.push(a);
  env.scene.add(a);
  if(i > 0) {
    for(var j = 0; j < i; ++j) {
      var b = spheres[j];

      if(j === 0) {
        springs.push(new CANNON.Spring(a.rigidBody, b.rigidBody, {
          restLength: 1,
          stiffness: 500,
          damping: 5
        }));
      }
      repellers.push([a, b, { force: Primrose.Random.number(0, 0.2) }]);
    }
  }
}
