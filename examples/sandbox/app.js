/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */
function StartDemo () {

  var app = new Primrose.VRApplication(
      "sandbox", {
        // This file references a THREE.js JSON-formatted scene
        // file, which basically describes a room or level in 
        // which the user will walk around, on which we can 
        // create additional objects.
        sceneModel: "../models/scene3.json",
        button: {
          // This file references another THREE.js JSON-formatted
          // model file, which will be cloned anytime a user
          // calls createElement("button").
          model: "../models/smallbutton.json",
          options: {
            colorUnpressed: 0x7f0000,
            colorPressed: 0x007f00
          }
        }
      } );

  app.addEventListener( "ready", function () {
    var n = 8,
        d = ( n - 1 ) / 2;
    for ( var i = 0; i < n; ++i ) {
      var btn = app.createElement( "button" ),
          x = ( i - d ) * 0.25;
      btn.moveBy( x, 0, -1.5 * Math.cos( x ) + 1 );
      btn.addEventListener(
          "click",
          app.music.play.bind(
              app.music,
              35 + i * 4,
              0.30,
              0.2 ) );
    }
  }.bind( this ) );

  app.start();
}