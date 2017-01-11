const env = new Primrose.BrowserEnvironment({
  backgroundColor: 0x000000,
  groundTexture: "../images/deck.png",
  useFog: true,
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  nonstandardNeckLength: 15,
  nonstandardNeckDepth: 7.5,
  progress: Preloader.thunk
}),
  logger = bareBonesLogger.http("/logger");

var videos = [
  "candles",
  "fireplace",
  "kettle",
  "ocean"
].map(function(v) {
  var file = "/notion-node/" + v + ".mp4";
  console.log("loading " + file);
  return new Primrose.Controls.Video(file, {
    progress: Preloader.thunk
  });
});

videos.forEach(function(v, i){
  v.latLon(0, (i - (videos.length - 1) / 2) * 30, 1)
    .addTo(env.vicinity)
    .at(v.position.x, v.position.y + 1.5, v.position.z);
});

env.addEventListener("ready", function() {
  Promise.all(videos.map(function(v) {
    return v.ready.catch(function(err) {
      console.error(err);
      throw err;
    });
  }))
  .then(function(){
    console.log("All good");
  })
  .catch(function(err){
    axis(1, 0.01)
      .addTo(env.vicinity)
      .at(0, 1.5, -2);
  }).then(Preloader.hide);
});
