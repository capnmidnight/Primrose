/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */
function StartDemo () {

  var app = new Primrose.VRApplication(
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
    app.music.play( 35 + i * 4, 0.30, 0.2 );
  }

  app.addEventListener( "ready", function () {
    var n = 8;
    var d = ( n - 1 ) / 2;
    for ( var i = 0; i < n; ++i ) {
      var btn = app.createElement( "button" );
      var x = ( i - d ) * 0.25;
      btn.moveBy( x, 0, -1.5 * Math.cos( x ) + 1 );
      btn.addEventListener( "click", play.bind( this, i ) );
    }
  }.bind( this ) );

  app.start();
}