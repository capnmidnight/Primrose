var app = new Primrose.VRApplication(
    // We give the application a name here, in case we ever
    // hook it up to the Multiplayer Server.
    "sandbox", {
      // This file references a Three.js JSON-formatted scene
      // file, which basically describes a room or level in 
      // which the user will walk around, on which we can 
      // create additional objects.
      sceneModel: "/models/holodeck.json",
      // We're going to use HTML buttons on the screen to
      // control fullscreen view.
      disableAutoFullScreen: true,
      // One of our GUI controls is configured here.
      button: {
        // This file references another Three.js JSON-formatted
        // model file, which will be cloned anytime a user
        // calls createElement("button").
        model: "/models/smallbutton.json",
        // Display settings for different states of the button.
        options: {
          colorUnpressed: 0x7f0000,
          colorPressed: 0x007f00
        }
      }
    } );

// we setup the event handlers for going full-screen
app.setFullScreenButton( "goVR", "click", true );
app.setFullScreenButton( "goRegular", "click", false );
app.ctrls.viewSource.addEventListener("click", function () {
  var path = "https://github.com/capnmidnight/Primrose/tree/master" + document.location.pathname;
  path = path.replace("index.html", "app.js");
  window.open(path);
}, false);

// Once Primrose has setup the WebGL context, setup Three.js, 
// downloaded and validated all of model files, and constructed
// the basic scene hierarchy out of it, the "ready" event is fired,
// indicating that we may make additional changes to the scene now.
app.addEventListener( "ready", function () {

  var numButtons = 8,
      middle = ( numButtons - 1 ) / 2;
  for ( var i = 0; i < numButtons; ++i ) {

    // Primrose uses an object model that is layered on top of
    // DOM, to get users up to speed quickly and to integrate
    // easily with other tools.
    var btn = document.createElement( "button" );
    btn.type = "button";

    // Spacing the buttons out in a rough arc around the origin.
    var x = ( i - middle ) * 0.25,
        z = -1.5 * Math.cos( x ) + 1;

    // Though this is the CSS transform syntax, the only units that
    // are supported at this time are Ems, and they are treated as
    // meters.
    btn.style.transform = "translate3d(" + x + "em, 0, " + z + "em)";

    // We can wire up event handlers on the button just like it was
    // a DOM element.
    btn.addEventListener(
        "click",
        // Primrose already has a basic sound API setup, so you
        // can hook directly into it to create basic, procedurally
        // generated music.
        app.music.play.bind(
            app.music,
            // The play method understands Piano key indices, so
            // we just need to calculate the note we want to play,
            // understanding Middle C to be note 44.
            35 + i * 4,
            // Volume, on the range [0, 1]. Full volume is quite loud.
            0.30,
            // Duration to play, in seconds.
            0.2 ) );

    // Put the element into the scene
    app.appendChild( btn );
  }
} );