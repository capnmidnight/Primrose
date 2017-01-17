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
    skyTexture: "../images/bg.jpg",
    groundTexture: "../images/grass.png",
    font: "../fonts/helvetiker_regular.typeface.json",
    useFog: true,
    drawDistance: 100,
    enableShadows: true,
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    progress: Preloader.thunk
  });

// and clicking on the objects in the scene
function makeJabJump(evt) {
  if(evt.hit && jabs[evt.hit.object.uuid]) {
    jabs[evt.hit.object.uuid].jump(evt.hit.face.normal);
  }
}
env.addEventListener("gazecomplete", makeJabJump);
env.addEventListener("pointerend", makeJabJump);

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
    body = sphere(0.2, 14, 7)
      .colored(skin, {
        shadow: true
      })
      .at(R.number(-w, w), 1, R.number(-h, h)),

    velocity = v3(
      R.number(-s, s),
      0,
      R.number(-s, s)),
    v = v3(0, 0, 0);

  eye(-1, body);
  eye(1, body);

  body.rotation.y = Math.PI;
  body.update = function (dt) {
    velocity.y -= env.options.gravity * dt;
    body.position.add(v.copy(velocity)
      .multiplyScalar(dt));
    if (velocity.x > 0 && body.position.x >= w ||
      velocity.x < 0 && body.position.x <= -w) {
      velocity.x *= -1;
    }
    if (velocity.z > 0 && body.position.z >= h ||
      velocity.z < 0 && body.position.z <= -h) {
      velocity.z *= -1;
    }
    if (velocity.y < 0 && body.position.y < 1) {
      velocity.y = 0;
      body.position.y = 1;
    }
    v.copy(body.position)
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
      body.position.add(v);
      body.lookAt(env.input.head.position);
    }
    else {
      body.lookAt(
        v.copy(velocity).add(body.position));
    }
  };

  body.jump = function (normal) {
    v.copy(normal);
    v.y = env.options.gravity / 2;
    velocity.add(v);
  };

  return body;
}

// Once Primrose has setup the WebGL context, setup Three.js,
// downloaded and validated all of model files, and constructed
// the basic scene hierarchy out of it, the "ready" event is fired,
// indicating that we may make additional changes to the scene now.

var lastTime = 0;
env.addEventListener("ready", function () {
  lastTime = env.currentTime;
  for (var i = 0; i < 100; ++i) {
    var jab = Jabber(
      MIDX / 5,
      MIDZ / 5, 1);
    jabs[jab.uuid] = jab;
    env.appendChild(jab);
    env.registerPickableObject(jab);
  }

  Preloader.hide();
});

env.addEventListener("update", function () {
  var dt = env.currentTime - lastTime;
  lastTime = env.currentTime;
  for (var id in jabs) {
    jabs[id].update(dt);
  }
});