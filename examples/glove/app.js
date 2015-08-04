/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */

var DEBUG_VR = false, app;

function StartDemo ( ) {
  "use strict";
  app = new Primrose.VRApplication(
      "glove demo",
      "../models/scene2.json",
      "../models/smallbutton.json", {
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

  function play(i){
    noteDown[i] = true;
  }

  var noteDown = [];
  var btns = [];
  app.addEventListener( "ready", function () {
    var n = 8;
    var d = (n - 1) / 2;
    for(var i = 0; i < n; ++i){
      noteDown[i] = false;
      btns.push(app.makeButton());
      var x = (i - d) * 0.25;
      btns[i].moveBy(x, 2, -1.5 * Math.cos(x) + 1 );
      btns[i].addEventListener("click", play.bind(this, i));
    }
  }.bind(this) );

  var t = 0;
  app.addEventListener( "update", function ( dt ) {
    t += dt;
    var j = Math.floor(t * 10) % noteDown.length;
    var i = Math.floor(t * 40) % noteDown.length;;
    if(noteDown[i]){
      app.audio.sawtooth(35 + i * 5, 0.30, 0.03);
    }
    if(j === 0){
      app.audio.sawtooth(10, 0.50, 0.03);
    }
    for(i = 0; i < noteDown.length; ++i){
      noteDown[i] = false;
    }
  }.bind(this) );

  app.start();

}
