var env = new Primrose.BrowserEnvironment({
  // This file references a Three.js JSON-formatted scene
  // file, which basically describes a room or level in
  // which the user will walk around, on which we can
  // create additional objects.
  sceneModel: "../models/holodeck.json",
  font: "../fonts/helvetiker_regular.typeface.js",
  // One of our GUI controls is configured here.
  button: {
    // This file references another Three.js JSON-formatted
    // model file, which will be cloned anytime a user
    // calls createElement("button").
    model: "../models/smallbutton.json",
    // Display settings for different states of the button.
    options: {
      colorUnpressed: 0x7f0000,
      colorPressed: 0x007f00
    }
  }
});

// Once Primrose has setup the WebGL context, setup Three.js,
// downloaded and validated all of model files, and constructed
// the basic scene hierarchy out of it, the "ready" event is fired,
// indicating that we may make additional changes to the scene now.
env.addEventListener("ready", function () {

  var numButtons = 8,
    middle = (numButtons - 1) / 2;

  for (var i = 0; i < numButtons; ++i) {

    var btn = env.createElement("button");

    // We can wire up event handlers on the button just like it was
    // a DOM element.
    btn.addEventListener(
      "click",
      // Primrose already has a basic sound API setup, so you
      // can hook directly into it to create basic, procedurally
      // generated music.
      env.music.play.bind(
        env.music,
        // The play method understands Piano key indices, so
        // we just need to calculate the note we want to play,
        // understanding Middle C to be note 44.
        35 + i * 4,
        // Volume, on the range [0, 1]. Full volume is quite loud.
        0.30,
        // Duration to play, in seconds.
        0.2));

    // Spacing the buttons out in a rough arc around the origin.
    var x = (i - middle) * 0.25,
      z = -1.5 * Math.cos(x) + 1,
      // Put the element into the scene
      btnBase = env.appendChild(btn);
    btnBase.position.set(x, 0, z);
  }
});