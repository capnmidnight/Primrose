/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */
var app;
function StartDemo () {

  app = new Primrose.VRApplication(
      "sandbox",
      {
        sceneModel: "../models/scene3.json",
        button: {
          model: "../models/smallbutton.json",
          options: {
            maxThrow: 0.1,
            minDeflection: 10,
            colorUnpressed: 0x7f0000,
            colorPressed: 0x007f00,
            toggle: true
          }
        }
      } );

  function play ( i ) {
    console.log( "play " + i );
    noteDown[i] = true;
    console.log( noteDown.join() );
  }

  var noteDown = [ ];
  var btns = [ ];
  app.addEventListener( "ready", function () {
    var n = 8;
    var d = ( n - 1 ) / 2;
    for ( var i = 0; i < n; ++i ) {
      noteDown[i] = false;
      btns.push( app.createElement( "button" ) );
      var x = ( i - d ) * 0.25;
      btns[i].moveBy( x, 0, -1.5 * Math.cos( x ) + 1 );
      btns[i].addEventListener( "click", play.bind( this, i ) );
    }
  }.bind( this ) );

  var t = 0;
  app.addEventListener( "update", function ( dt ) {
    t += dt;
    for ( var i = 0; i < noteDown.length; ++i ) {
      if ( noteDown[i] ) {
        app.music.play( 35 + i * 5, 0.30, 0.1 );
        noteDown[i] = false;
      }
    }
  }.bind( this ) );

  app.start();
}