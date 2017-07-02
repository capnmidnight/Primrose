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

  groundMaterial = new CANNON.Material("groundMaterial"),
  groundShape = new CANNON.Plane(),
  ground = new CANNON.Body({ mass: 0, material: groundMaterial }),

  spheres = [],
  springs = [],
  repellers = [];

function SolidSphere(m, r) {

  var shape = new CANNON.Sphere(r);
  this.body = new CANNON.Body({ mass: m, material: groundMaterial });
  this.body.addShape(shape);

  this.body.position.set(
    Primrose.Random.number(-0.5, 0.5),
    Primrose.Random.number(1, 2),
    Primrose.Random.number(-1.5, -2.5));

  this.body.velocity.set(
    Primrose.Random.number(-1, 1),
    Primrose.Random.number(-1, 1),
    Primrose.Random.number(-1, 1));

  this.body.angularVelocity.set(
    Primrose.Random.number(-5, 5),
    Primrose.Random.number(-5, 5),
    Primrose.Random.number(-5, 5));

  this.body.angularDamping = 0.75;
  this.body.linearDamping = 0.5;

  this.mesh = sphere(r, 20, 20)
    .colored(Primrose.Random.color())
    .on("enter", this.jump.bind(this));

  env.physics.addBody(this.body);
  env.scene.add(this.mesh);
}

SolidSphere.prototype.jump = function() {
  this.body.velocity.y = Primrose.Random.number(5, 10);
};

SolidSphere.prototype.update = function() {
  this.mesh.position.copy(this.body.position);
  this.mesh.quaternion.copy(this.body.quaternion);
};


var TEMP = v3();

env.physics.addEventListener("preStep", function(event) {
  for(var i = 0; i < repellers.length; ++i){
    var r = repellers[i],
      a = r[0],
      b = r[1],
      o = r[2];

    TEMP.copy(b.body.position).sub(a.body.position);
    var d = TEMP.length();
    TEMP.multiplyScalar(o.force / Math.pow(d, 3));
    b.body.force.vadd(TEMP, b.body.force);
    TEMP.negate();
    a.body.force.vadd(TEMP, a.body.force);
  }
});

env.physics.addEventListener("postStep", function(event) {
  for(var i = 0; i < springs.length; ++i){
    springs[i].applyForce();
  }
});

env.addEventListener("update", function() {
  for(var i = 0; i < spheres.length; ++i){
    spheres[i].update();
  }
});

env.addEventListener("ready", function() {

  ground.quaternion.setFromVectors(
    new CANNON.Vec3(0, 0, -1),
    new CANNON.Vec3(0, -1, 0));


  ground.addShape(groundShape);
  env.physics.addBody(ground);

  for(var i = 0; i < 50; ++i){
    var a = new SolidSphere(i, Primrose.Random.number(0.1, 0.2));
    spheres.push(a);
    if(i > 0) {
      for(var j = 0; j < i; ++j) {
        var b = spheres[j];

        if(j === 0) {
          springs.push(new CANNON.Spring(a.body, b.body, {
            restLength: 1,
            stiffness: 500,
            damping: 5
          }));
        }
        repellers.push([a, b, { force: Primrose.Random.number(0, 0.2) }]);
      }
    }
  }
});
