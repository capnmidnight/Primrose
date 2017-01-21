var skyColor = 0xffff7f,
  env = new Primrose.BrowserEnvironment({
    backgroundColor: skyColor,
    groundTexture: "../images/sand.png",
    useFog: true,
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    enableShadows: true,
    shadowMapSize: 2048,
    progress: Preloader.thunk
  }),

  sunDistance = 20,
  sun = circle(1, 45)
    .colored(0xffffff, { unshaded: true })
    .named("sun"),

  t = function(name, rt, rb, h, sr){
    return cylinder(rt, rb, h, sr, 1)
      .textured("../images/rock.png", { shadow: true, progress: Preloader.thunk })
      .named(name);
  },

  sunDialColor = 0xd0d0c0,
  dial = t("dial", 0.333, 0.333, 0.03, 45),

  handHeight = 0.25,
  hand = t("hand", 0.01, 0.02, handHeight, 3),

  standHeight = 1,
  stand = t("stand", 0.1, 0.3, standHeight, 4),

  baseHeight = 0.10,
  base = t("base", 0.35, 0.35, baseHeight, 4);

env.sky.add(sun);
sun.material.fog = false;
sun.material.needsUpdate = true;

env.scene.add(stand);
stand.position.y += standHeight / 2;
stand.position.z += -1.5;
stand.rotation.y = Math.PI / 4;

stand.add(dial);
dial.position.y += standHeight / 2;

stand.add(base);
base.position.y += (baseHeight - standHeight) / 2;

dial.add(hand);
hand.position.y += handHeight / 2;


env.addEventListener("ready", Preloader.hide);

env.addEventListener("update", function() {
  env.sky.sun.latLon(10 - env.currentTime, 30, sunDistance);
  sun.position.copy(env.sky.sun.position);
  sun.lookAt(env.sky.position);
  var s = (1 + sun.position.y / sunDistance) / 2;
  env.sky.ambient.intensity = 0.5 * s;
  env.scene.fog.color
    .setHex(skyColor)
    .multiplyScalar(s);
  env.renderer.setClearColor(env.scene.fog.color.getHex());
});