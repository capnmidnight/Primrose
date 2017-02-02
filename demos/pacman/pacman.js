var R = Primrose.Random.int,
  L = Primrose.ModelLoader.loadObject,
  T = 3,
  W = 30,
  H = 30,
  colors = [
    0xff0000,
    0xffff00,
    0xff00ff,
    0x00ffff
  ],
  ghosts,
  map = [
    "12222222221",
    "10000000001",
    "10222022201",
    "10001000001",
    "10101022201",
    "10100010101",
    "10222220101",
    "10000000001",
    "12222222221"
  ];

function C(n, x, y) {
  if (n !== 0) {
    put(colored(cylinder(0.5, 0.5, T), 0x0000ff))
      .on(scene)
      .rot(0, n * Math.PI / 2, Math.PI / 2)
      .at(T * x - W / 2, env.options.avatarHeight, T * y - H / 2);
  }
}

for (var y = 0; y < map.length; ++y) {
  var row = map[y];
  for (var x = 0; x < row.length; ++x) {
    C(row[x] | 0, x, y);
  }
}

L("../models/ghost.obj")
  .then(function (ghost) {
    ghosts = colors.map(function (color, i) {
      var g = ghost.clone(),
        body = g.children[0];
      colored(body, color);
      scene.appendChild(g);
      g.position.set(i * 3 - 4, 0, -5);
      g.velocity = v3(0, 0, 0);
      g.velocity.x = R(-1, 2);
      if (g.velocity.x === 0 && g.velocity.z === 0) {
        g.velocity.z = R(-1, 2);
      }
      return g;
    });
  });

function collisionCheck(dt, a, t) {
  var x = Math.floor((a.position.x + W / 2 + 1) / T),
    y = Math.floor((a.position.z + H / 2 + 1) / T),
    row = map[y],
    tile = row && row[x] | 0;
  var v = a.velocity.clone()
    .multiplyScalar(-dt * 1.5);
  if (tile > 0) {
    if (t || a.isOnGround) {
      a.position.add(v);
    }
    if (t) {
      a.velocity.set(
        a.velocity.z,
        0, -a.velocity.x
      );
    }
  }
}

return function (dt) {
  if (ghosts) {
    ghosts.forEach(function (g) {
      g.position.add(g.velocity.clone()
        .multiplyScalar(dt));
      collisionCheck(dt, g, env.head);
    });
  }
  collisionCheck(dt, env.head, null);
}