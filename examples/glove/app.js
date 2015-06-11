/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */

var DEBUG_VR = false;

function StartDemo ( ) {
  "use strict";
  var application = new Primrose.VRApplication(
      "glove demo",
      "../models/scene.json",
      "../images/bg2.jpg",
      "../models/button.json", {
        maxThrow: 0.1,
        minDeflection: 10,
        colorUnpressed: 0x7f0000,
        colorPressed: 0x007f00,
        toggle: true
      },
  "../models/bear.json", 1.75, 1.3,
      "../audio/click.mp3",
      "../audio/ocean.mp3", {
        backgroundColor: 0xafbfff
      }
  );

  application.addEventListener( "ready", function () {

  } );

  application.addEventListener( "update", function ( dt ) {

  } );

  application.start();

}
