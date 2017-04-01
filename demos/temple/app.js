var GRASS = "../shared_assets/images/grass.png",
  ROCK = "../shared_assets/images/rock.png",
  SAND = "../shared_assets/images/sand.png",
  WATER = "../shared_assets/images/water.png",
  DECK = "../shared_assets/images/deck.png",
  WIDTH = 100,
  HEIGHT = 11,
  DEPTH = 100,
  MIDX = WIDTH / 2,
  MIDY = HEIGHT / 2,
  MIDZ = DEPTH / 2,
  ball = null,
  t = 0,
  dx = 7,
  dy = 2.5,
  dz = 4,
  env = new Primrose.BrowserEnvironment({
    skyTexture: "../shared_assets/images/bg.jpg",
    groundTexture: DECK,
    useFog: true,
    fullScreenButtonContainer: "#fullScreenButtonContainer"
  });

env.addEventListener("ready", function () {

  var start = hub()
    .addTo(this.scene)
    .at(-MIDX, 0, -MIDZ);

  var ceiling = brick(DECK, WIDTH, 0.1, DEPTH)
    .named("Ceiling")
    .addTo(start)
    .at(WIDTH / 2, 12.5, DEPTH / 2);

  var verts = [];

  ball = brick(ROCK, 1, 1, 1)
    .named("Ball")
    .addTo(start)
    .at(0, 0, 0);

  for (var i = 0; i < 5000; ++i) {
    verts.push(v3(Primrose.Random.number(-0.5 * WIDTH, 0.5 * WIDTH),
      Primrose.Random.number(-0.5 * HEIGHT, 0.5 * HEIGHT),
      Primrose.Random.number(-0.5 * DEPTH, 0.5 * DEPTH)));
  }

  cloud(verts, this.options.backgroundColor, 0.05)
    .addTo(start)
    .at(MIDX, MIDY, MIDZ);


  function makeSphere(r, p) {
    verts.splice(0);
    var rr = r * r;
    for (var x = -r; x <= r; x += p) {
      var dx = x * x;
      for (var y = -r; y <= r; y += p) {
        var dy = y * y;
        if ((dx + dy) < rr) {
          var z = Math.sqrt(rr - dx - dy);
          verts.push(v3(x, z, y));
          verts.push(v3(x, -z, y));
        }
      }
    }
    cloud(verts, 0xff0000, p * Math.sqrt(2))
      .addTo(start)
      .at(MIDX - r, r, MIDZ - r);
  }

  makeSphere(10, 0.1);

  function column(a, b, h, x, y, z) {
    var obj = cylinder(a, b, h, 6, 1)
      .textured(SAND)
      .addTo(start)
      .at(x, y, z);
  }

  for (var i = 0; i < 100; ++i) {
    var x = Primrose.Random.int(WIDTH),
      z = Primrose.Random.int(DEPTH);
    column(0.5, 1, 1, x, 0, z);
    column(0.5, 0.5, 11, x, 6, z);
    column(2, 0.5, 1, x, 12, z);
  }

  Preloader.hide();
}.bind(env));

env.addEventListener("update", function (dt) {
  t += dt;

  ball.position.x += dx * dt;
  ball.position.y += dy * dt;
  ball.position.z += dz * dt;
  if (ball.position.x < 0 && dx < 0 ||
    WIDTH <= ball.position.x && dx > 0) {
    dx *= -1;
  }
  if (ball.position.y < 1 && dy < 0 ||
    HEIGHT <= ball.position.y && dy > 0) {
    dy *= -1;
  }
  if (ball.position.z < 0 && dz < 0 ||
    DEPTH <= ball.position.z && dz > 0) {
    dz *= -1;
  }
});
