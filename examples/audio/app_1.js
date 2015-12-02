var app;
function StartDemo () {
  app = new Primrose.VRApplication(
      "Codevember", {
        disablePhysics: true,
        sceneModel: "../models/scene.json"
      }
  );

  app.addEventListener( "ready", function () {
//    app.scene.Light1.intensity *= 2;
//    app.scene.Light1.distance *= 2;
//    app.scene.Light2.intensity *= 2;
//    app.scene.Light2.distance *= 2;
//    app.scene.Light3.intensity *= 2;
//    app.scene.Light3.distance *= 2;
//    app.scene.Ground.material.shading = THREE.FlatShading;
//    app.scene.Ground.material.needsUpdate = true;
//    app.scene.Text.material.emissive.setRGB(1, 1, 1);
//    app.scene.remove(app.pointer.graphics);
app.currentUser.position.x = 4;
app.currentUser.position.y = 0;
app.currentUser.position.z = 7;
  }.bind( this ) );

  var t = 0;
  app.addEventListener( "update", function ( dt ) {
    t += dt * 0.001;
    //app.scene.Ground.rotation.x = t * 100;
  }.bind( this ) );

  app.start();
}