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
      3, 1.3, {
        backgroundColor: 0xafbfff
      }
  );

  var btns = [];
  application.addEventListener( "ready", function () {
    for(var i = 0; i < 5; ++i){
      btns.push(application.makeButton());
      btns[i].moveBy((i - 2) * 2, 0, -2);
    }
  } );

  var t = 0;
  application.addEventListener( "update", function ( dt ) {
    t += dt;
  } );

  application.start();

}
