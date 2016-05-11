# Primrose VR: Productive Virtual Reality
The Primrose Framework helps web developers create virtual reality experiences within standard web browsers on desktop and mobile devices alike. Through its common interaction space, design tools, interface objects, and user experience best-practices, users and developers collaborate to create interactive multimedia and productivity applications.

## Example
    // different operating systems have different keyboard shortcuts.
    var modA = isOSX ? "metaKey" : "ctrlKey",
        modB = isOSX ? "altKey" : "shiftKey",
        execKey = isOSX ? "E" : "SPACE",

        // a place to stow an object we will modify out of the loaded scene file
        terminal = null,

        // setup the VR environment
        app = new Primrose.BrowserEnvironment( "Commodore", {
          sceneModel: "commodore_pet.json",
          skyTexture: "images/bg2.jpg",
          groundTexture: "images/deck.png"
        } );

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
