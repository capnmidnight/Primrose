var app;
function StartDemo () {
  app = new Primrose.VRApplication(
      "Codevember", {
        disablePhysics: true,
        sceneModel: "../models/scene4.json",
        avatarHeight: 0
      }
  );

  app.addEventListener( "ready", function () {
    with(app.scene){
      Light1.intensity *= 2;
      Light2.intensity *= 2;
      Light3.intensity *= 2;
      Light1.distance *= 2;
      Light2.distance *= 2;
      Light3.distance *= 2;
      Text.material.emissive.setRGB(1, 1, 1);
      remove(app.pointer.graphics);
    }
  }.bind( this ) );

  var t = 0;
  app.addEventListener( "update", function ( dt ) {
    t += dt * 0.001;
    app.scene.Ground.rotation.x = t * 100;
  }.bind( this ) );

  app.start();

  function isFullScreenMode () {
    var value = ( document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement );
    return value;
  }

  function nothing () {
  }

  document.getElementById( "frontBuffer" )
      .addEventListener( "mousedown", function () {
        if ( !isFullScreenMode() ) {
          if ( this.webkitRequestFullscreen ) {
            this.webkitRequestFullscreen( window.Element.ALLOW_KEYBOARD_INPUT );
          } else {
            ( this.requestFullscreen ||
                this.mozRequestFullScreen ||
                this.msRequestFullscreen ||
                nothing )();
          }

          ( window.requestPointerLock ||
              window.webkitRequestPointerLock ||
              window.mozRequestPointerLock ||
              nothing )();
        }
      }, false );

}