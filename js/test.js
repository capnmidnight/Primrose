function testDemo(scene) {
    // 🐔🥚🥚🥚
    // 🥚🐔🥚🥚
    // 🥚🥚🐔🥚
    // 🥚🥚🥚🐔
    var GRASS = "../shared_assets/images/grass.png",
        ROCK = "../shared_assets/images/rock.png",
        SAND = "../shared_assets/images/sand.png",
        WATER = "../shared_assets/images/water.png",
        DECK = "../shared_assets/images/deck.png",
        WIDTH = 5,
        HEIGHT = 5,
        DEPTH = 5,
        MIDX = WIDTH / 2 - 5,
        MIDY = HEIGHT / 2,
        MIDZ = DEPTH / 2,
        start = hub()
            .addTo(scene)
            .at(-MIDX, 0, -DEPTH - 2);

    const balls = [];

    for (var i = 0; i < 10; ++i) {
        balls.push(brick(DECK)
            .addTo(start)
            .at(number(WIDTH),
                number(HEIGHT),
                number(DEPTH)));

        balls[i].velocity = v3(
            number(WIDTH),
            number(HEIGHT),
            number(DEPTH));
    }

    function update(dt) {
        for (var i = 0; i < balls.length; ++i) {
            var ball = balls[i],
                p = ball.position,
                v = ball.velocity;
            p.add(v.clone()
                .multiplyScalar(dt));
            if (p.x < 0 && v.x < 0 || WIDTH <= p.x && v.x > 0) {
                v.x *= -1;
            }
            if (p.y < 1 && v.y < 0 || HEIGHT <= p.y && v.y > 0) {
                v.y *= -1;
            }
            if (p.z < 0 && v.z < 0 || DEPTH <= p.z && v.z > 0) {
                v.z *= -1;
            }
        }
    }
}