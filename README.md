# Primrose

Primrose is a webVR framework that allows web developers to create virtual reality experiences for standard web browsers on desktop and mobile devices alike.

webVR is an [experimental Javascript API](https://developer.mozilla.org/en-US/docs/Web/API/WebVR_API) that provides access to Virtual Reality devices and peripherals in the browser. See [webVR.info](https://webvr.info/) for more information and resources.


# Getting started with Primrose

### Contributing

If you're interested in contributing to the framework, we'd love to have you involved. Please [read the guidelines](https://github.com/NotionTheory/Primrose/blob/master/CONTRIBUTING.md) for contributing before doing so.

### Project Setup

1. You first want to setup a new project using `npm init`, and then follow the prompts.

2. Once you have created your new project, install Primrose using the following command: `npm install --save primrose`

3. Next create a basic `index.html` file in your project directory and include the `node_modules/primrose/Primrose.min.js` script, like so:

        // index.html
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script type="text/javascript" src="node_modules/primrose/Primrose.min.js"></script>
            <title>My Primrose VR Application</title>
          <body>
            <h2>hello world</h2>
          </body>
        </html>

4. Then create an `app.js` script page that creates a new `Primrose.BrowserEnvironment`, like so:

        // app.js
        "use strict";
        var env = new Primrose.BrowserEnvironment({
          autoScaleQuality: false,
          skyTexture: "../images/bg.jpg",
          groundTexture: "../images/deck.png",
          font: "../fonts/helvetiker_regular.typeface.json"
        });

        env.addEventListener("ready", function () {
          // Perform any post-initialization setup. Once this event fires, the Primrose
          // framework is ready and will start animation as soon as this function returns.
        });

        env.addEventListener("gazecomplete", function (evt) {
          // You can respond to "intended stare" events here, i.e. when the user gazes
          // at a particular object for an extended period of time. Usually, about three
          // seconds.
        });

        env.addEventListener("pointerend", function (evt) {
          // You can respond to the user "clicking" an object here. This could be by using
          // a mouse on their desktop PC or by touching the screen while looking at an
          // object on a mobile device.
        });

        env.addEventListener("update", function (dt) {
          // Perform per-frame updates here, like moving objects around according to your
          // own rules.
        });


5. Finally, to get our project up and running live in the browser, we need to set up a server. For the purposes of this basic demo, we're going to be using a [static HTML server](https://github.com/NotionTheory/notion-node) which can be included by running the command `npm install --save notion-node` (you can replace with Express or equivalent). Then make a `server.js` file and include the following:

        // server.js
        var startServer = require("notion-node");
        startServer();

Run `node server.js --mode=dev` in your terminal to see your application live. If your browser doesn't automatically open, just navigate to [localhost](http://localhost/) and you should see your page.




## Example
    // different operating systems have different keyboard shortcuts.
    var modA = isOSX ? "metaKey" : "ctrlKey",
        modB = isOSX ? "altKey" : "shiftKey",
        execKey = isOSX ? "E" : "SPACE",

        // a place to stow an object we will modify out of the loaded scene file
        terminal = null,

        // setup the VR environment
        app = new Primrose.BrowserEnvironment({
          sceneModel: "commodore_pet.json",
          skyTexture: "images/bg2.jpg",
          groundTexture: "images/deck.png"
        });

    function isExecuteCommand ( evt ) {
      return evt[modA] && evt[modB] && evt.keyCode === Primrose.Keys[execKey];
    }

    app.addEventListener( "keydown", function ( evt ) {
      if ( terminal.running &&
          terminal.waitingForInput &&
          evt.keyCode === Primrose.Keys.ENTER ) {
        terminal.sendInput( evt );
      }
      else if ( !terminal.running &&
          isExecuteCommand( evt ) ) {
        terminal.execute();
      }
    } );

    app.addEventListener( "ready", function () {

      // A hack to reposition the objects in the scene because the model file is a little janky
      app.scene.traverse( function ( obj ) {
        if ( obj.name && obj.parent && obj.parent.uuid === app.scene.uuid ) {
          obj.position.y += app.avatarHeight * 0.9;
          obj.position.z -= 1;
        }
      } );

      // the `convertToEditor` method makes an editor out of existing geometry.
      var editor = app.convertToEditor( app.scene.Screen );
      editor.padding = 10;
      terminal = new Primrose.Text.Terminal( app.scene.Screen.textarea );
      terminal.loadFile( "oregon.bas" );
    } );

## Issues
The issues list is not here on Github, it's on [Trello](https://trello.com/b/NVZsaC1P/primrosevr).

## Licensing
Primrose is free, open source software (GPLv3) and may readily bewith other FOSS projects.

## Contributions
To simplify licensing issues, contributions to Primrose require a copyright assignment to me, Sean T. McBeth. Please include your name and email address in the CONTRIBUTORS.md file with your pull request. This will serve as your copyright assignment.
