var WIDTH = 100,
  HEIGHT = 6,
  DEPTH = 100,
  MIDX = WIDTH / 2,
  MIDY = HEIGHT / 2,
  MIDZ = DEPTH / 2,
  t = 0,
  jabs = {},
  R = Primrose.Random,
  env = new Primrose.BrowserEnvironment({
    backgroundColor: 0xC9E6EE,
    skyTexture: "../shared_assets/images/bg.jpg",
    groundTexture: "../shared_assets/images/grass.png",
    font: "../shared_assets/fonts/helvetiker_regular.typeface.json",
    useFog: true,
    drawDistance: 100,
    enableShadows: true,
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    progress: Preloader.thunk
  });


function eye(side, body) {
  var ball = sphere(0.05, 6, 3)
    .colored(0xffffff)
    .addTo(body)
    .at(side * 0.07, 0.05, 0.16);
  sphere(0.01, 3, 2)
    .colored(0)
    .addTo(ball)
    .at(0, 0, 0.045);
  return ball;
}

function Jabber(w, h, s) {
  var skin = R.item(Primrose.Constants.SKINS),
    root = hub()
      .at(R.number(-w, w), 0, R.number(-h, h));


  var body = sphere(0.2, 14, 7)
    .colored(skin, {
      shadow: true
    })
    .addTo(root)
    .at(0, 0.125, 0);

  var velocity = v3(
      R.number(-s, s),
      0,
      R.number(-s, s)),
    v = v3(0, 0, 0);

  eye(-1, body);
  eye(1, body);

  root.rotation.y = Math.PI;
  root.update = function (dt) {
    velocity.y -= env.options.gravity * dt;
    root.position.add(v.copy(velocity)
      .multiplyScalar(dt));
    if (velocity.x > 0 && root.position.x >= w ||
      velocity.x < 0 && root.position.x <= -w) {
      velocity.x *= -1;
    }
    if (velocity.z > 0 && root.position.z >= h ||
      velocity.z < 0 && root.position.z <= -h) {
      velocity.z *= -1;
    }
    if (velocity.y < 0 && root.position.y < 0) {
      velocity.y = 0;
      root.position.y = 0;
    }
    v.copy(root.position)
      .sub(env.input.head.position);
    var d = v.length();
    if (d < 3) {
      v.divideScalar(d);
      v.y = 0;
      velocity.add(v.multiplyScalar((3 - d) / 100));
      v.set(
        R.number(-0.01, 0.01),
        R.number(-0.01, 0.01),
        R.number(-0.01, 0.01));
      root.position.add(v);
      root.lookAt(env.input.head.position);
    }
    else {
      root.lookAt(
        v.copy(velocity).add(root.position));
    }
  };


  body.addEventListener("select", function(evt) {
    v.copy(evt.hit.face.normal);
    v.y = env.options.gravity / 2;
    velocity.add(v);
  });

  return root;
}

// Once Primrose has setup the WebGL context, setup Three.js,
// downloaded and validated all of model files, and constructed
// the basic scene hierarchy out of it, the "ready" event is fired,
// indicating that we may make additional changes to the scene now.
env.addEventListener("ready", function () {
  for (var i = 0; i < 10; ++i) {
    var jab = Jabber(
      MIDX / 5,
      MIDZ / 5, 1);
    jabs[jab.uuid] = jab;
    env.scene.add(jab);
  }

  Preloader.hide();
});

env.addEventListener("update", function () {
  for (var id in jabs) {
    jabs[id].update(env.deltaTime);
  }
});
