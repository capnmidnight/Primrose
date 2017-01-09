var env = new Primrose.BrowserEnvironment({
  font: "../fonts/helvetiker_regular.typeface.json",
  backgroundColor: 0x07001f,
  groundTexture: "../images/water.png",
  useFog: true,
  drawDistance: 25,
  gazeLength: 0.25,
  showHeadPointer: isMobile,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  progress: Preloader.thunk
}),

  moon = textured(circle(1, 45), "moon.jpg", {
    unshaded: true,
    useFog: false,
    color: 0xffef9f,
    progress: Preloader.thunk
  }),

  pod = hub();

env.scene.add(pod);
pod.position.set(0, 0, -5);

env.sky.add(moon);
moon.latLon(-30, 30, 7);
moon.lookAt(env.scene.position);

modelPromise = Promise.all(range(3, function(i) {
  var dolphin = new Primrose.Controls.Model("../models/dolphin.obj", {
    progress: Preloader.thunk
  });
  dolphin.rotation.set(0, 0, i * 1.1, "ZYX");
  dolphin.position.set(0, 0, -i);
  pod.add(dolphin);
  return dolphin.ready;
}));

env.addEventListener("ready", function(){
  modelPromise.then(Preloader.hide);
});

env.addEventListener("update", function(dt) {
  pod.rotation.set(0, 0, performance.now() / 1000, "ZYX");
});