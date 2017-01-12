const env = new Primrose.BrowserEnvironment({
  forceStereo: true,
  avatarHeight: 1.5,
  backgroundColor: 0x000000,
  groundTexture: "../images/deck.png",
  useFog: true,
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  nonstandardNeckLength: 0.15,
  nonstandardNeckDepth: 0.075,
  progress: Preloader.thunk
}),
  logger = bareBonesLogger.http("/logger");

var img = new Primrose.Controls.Image([
  "/Legend3D/images/468_MC_0003_v006_COMP_left.001.jpg",
  "/Legend3D/images/468_MC_0003_v006_COMP_right.001.jpg"
], {
  width: 4,
  height: 1
}).addTo(env.vicinity)
  .at(0, 1.5, -2);

env.addEventListener("ready", function() {
  img.ready
    .then(function(){
      console.log("All good");
    })
    .catch(function(err){
      axis(1, 0.01)
        .addTo(env.vicinity)
        .at(0, 1.5, -2);
    })
    .then(Preloader.hide);
});
