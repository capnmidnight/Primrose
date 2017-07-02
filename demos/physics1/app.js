var env = new Primrose.BrowserEnvironment({
    backgroundColor: 0x000000,
    groundTexture: "../shared_assets/images/deck.png",
    useFog: true,
    drawDistance: 100,
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    nonstandardNeckLength: 0.15,
    nonstandardNeckDepth: 0.075
  }),

  groundMaterial = new CANNON.Material("groundMaterial"),
  groundShape = new CANNON.Plane(),
  ground = new CANNON.Body({ mass: 0, material: groundMaterial }),

  boxes = [];

function SolidBox(w, h, d) {

  if(h === undefined) {
    h = w;
  }

  if(d === undefined) {
    d = h;
  }

  var shape = new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2));
  this.body = new CANNON.Body({ mass: 1, material: groundMaterial });
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

  this.mesh = box(w, h, d)
    .colored(Primrose.Random.color())
    .on("enter", this.jump.bind(this));

  env.physics.addBody(this.body);
  env.scene.add(this.mesh);
}

SolidBox.prototype.jump = function() {
  this.body.velocity.y = Primrose.Random.number(5, 10);
};

SolidBox.prototype.update = function() {
  this.mesh.position.copy(this.body.position);
  this.mesh.quaternion.copy(this.body.quaternion);
};

env.addEventListener("update", function() {
  for(var i = 0; i < boxes.length; ++i){
    boxes[i].update();
  }
});

env.addEventListener("ready", function() {

  ground.quaternion.setFromVectors(
    CANNON.Vec3.UNIT_Z,
    CANNON.Vec3.UNIT_Y);

  ground.addShape(groundShape);
  env.physics.addBody(ground);

  for(var i = 0; i < 50; ++i){
    var a = new SolidBox(Primrose.Random.number(0.1, 0.2));
    boxes.push(a);
  }
});
