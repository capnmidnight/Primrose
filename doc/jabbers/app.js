var WIDTH = 100,
  HEIGHT = 6,
  DEPTH = 100,
  MIDX = WIDTH / 2,
  MIDY = HEIGHT / 2,
  MIDZ = DEPTH / 2,
  t = 0,
  jabs = {},
  R = Primrose.Random,
  app = new Primrose.BrowserEnvironment("Jabber Yabs", {
    skyTexture: "images/bg2.jpg",
    groundTexture: "images/grass.png",
    fullScreenIcon: "models/monitor.obj",
    VRIcon: "models/cardboard.obj",
    font: "fonts/helvetiker_regular.typeface.js"
  });

// and clicking on the objects in the scene
function makeJabJump(evt) {
  if (jabs[evt.objectID]) {
    jabs[evt.objectID].jump(evt.faceNormal);
  }
}
app.addEventListener("gazecomplete", makeJabJump);
app.addEventListener("pointerend", makeJabJump);

function eye(side, body) {
  var ball = put(textured(sphere(0.05, 6, 3), 0xffffff))
    .on(body).at(side * 0.07, 0.05, 0.16);
  put(textured(sphere(0.01, 3, 2), 0))
    .on(ball)
    .at(0, 0, 0.045);
  return ball;
}

function Jabber(w, h, s) {
  var obj = hub(),
    skin = R.item(Primrose.SKIN_VALUES),
    body = put(textured(sphere(0.2, 14, 7), skin)).on(obj).at(
      R.number(-w, w),
      1,
      R.number(-h, h)),
    velocity = v3(
      R.number(-s, s),
      0,
      R.number(-s, s)),
    v = v3(0, 0, 0);

  eye(-1, body);
  eye(1, body);

  obj.body = body;

  body.rotation.y = Math.PI;
  obj.update = function (dt) {
    velocity.y -= app.options.gravity * dt;
    body.position.add(v.copy(velocity).multiplyScalar(dt));
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
    v.copy(body.position).sub(app.player.position);
    var d = v.length();
    if (d < 3) {
      body.lookAt(app.player.position);
      obj.position.set(
        R.number(-0.01, 0.01),
        R.number(-0.01, 0.01),
        R.number(-0.01, 0.01));
      v.divideScalar(d);
      v.y = 0;
      velocity.add(v.multiplyScalar((3 - d) / 100));
    }
    else {
      body.lookAt(v.copy(velocity).add(body.position));
    }
  };
  obj.jump = function (normal) {
    v.fromArray(normal);
    v.y = app.options.gravity / 2;
    velocity.add(v);
  };
  return obj;
}

// Once Primrose has setup the WebGL context, setup Three.js, 
// downloaded and validated all of model files, and constructed
// the basic scene hierarchy out of it, the "ready" event is fired,
// indicating that we may make additional changes to the scene now.
app.addEventListener("ready", function () {
  for (var i = 0; i < 25; ++i) {
    var jab = put(Jabber(
      MIDX / 5,
      MIDZ / 5, 1)).on(app.scene).at(0, 0, 0);
    jabs[jab.body.uuid] = jab;
    app.registerPickableObject(jab.body);
  }
});

app.addEventListener("update", function (dt) {
  for (var id in jabs) {
    jabs[id].update(dt);
  }
});