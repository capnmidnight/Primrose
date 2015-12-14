/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */
console.clear();

var app;
function PrimroseDemo () {
  app = new Primrose.VRApplication( "Commodore", {
    regularFullScreenButton: document.getElementById( "goRegular" ),
    vrFullScreenButton: document.getElementById( "goVR" )
  } );

  app.addEventListener( "ready", function () {
    console.log("ready");
    var keyState = {},
        modA = isOSX ? "metaKey" : "ctrlKey",
        modB = isOSX ? "altKey" : "shiftKey",
        execKey = isOSX ? "E" : "SPACE",
        skyGeom = shell( 50, 8, 4, Math.PI * 2, Math.PI ),
        sky = textured( skyGeom, "../images/bg2.jpg" ),
        floor = textured( box( 25, 1, 25 ), "../images/deck.png", 25, 25 ),
        loader = new THREE.ObjectLoader(),
        editor = new Primrose.Text.Controls.TextBox( "textEditor", {
          size: new Primrose.Text.Size( 1024, 1024 ),
          fontSize: 30,
          tokenizer: Primrose.Text.Grammars.Basic,
          theme: Primrose.Text.Themes.Dark,
          hideLineNumbers: true,
          hideScrollBars: true
        } ),
        terminal = new Primrose.Text.Terminal( editor );

    loader.load( "commodore_pet.json", function ( f ) {
      app.scene.add( f );
      f.position.set( -0.1, -0.1, 0 );
      f.traverse( function ( obj ) {
        if ( obj.material && obj.material.name === "ScreenMaterial" ) {
          textured( obj, editor );
        }
      } );
    } );

    app.scene.add( sky );
    app.scene.add( floor );

    window.addEventListener( "keydown", keyDown );
    window.addEventListener( "keyup", function ( evt ) {
      keyState[evt.keyCode] = false;
    } );

    terminal.loadFile( "../oregon.bas" );

    function keyDown ( evt ) {
      if ( !app.currentEditor ||
          !app.currentEditor.focused ) {
        keyState[evt.keyCode] = true;
      }
      else if ( terminal.running &&
          terminal.waitingForInput &&
          evt.keyCode === Primrose.Text.Keys.ENTER ) {
        terminal.sendInput( evt );
      }
      else if ( !terminal.running &&
          isExecuteCommand( evt ) ) {
        terminal.execute();
      }
    }

    function isExecuteCommand ( evt ) {
      return evt[modA] && evt[modB] && evt.keyCode === Primrose.Text.Keys[execKey];
    }

  } );
  
  app.start();
}