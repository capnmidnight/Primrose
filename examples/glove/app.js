/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */

var DEBUG_VR = false;

function StartDemo ( ) {
  "use strict";
  var application = new Primrose.VRApplication(
      "glove demo",
      "../models/scene2.json",
      "../models/button.json", {
        maxThrow: 0.1,
        minDeflection: 10,
        colorUnpressed: 0x7f0000,
        colorPressed: 0x007f00,
        toggle: true
      },
      1.7, 1.3, {
        backgroundColor: 0xafbfff
      }
  );

  application.addEventListener( "ready", function () {

  } );

  application.addEventListener( "update", function ( dt ) {

  } );

  application.start();

}
