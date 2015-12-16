/* global isOSX, Primrose, THREE, isMobile, requestFullScreen, put */
console.clear();

var app;
function PrimroseDemo () {
  var keyState = {},
      modA = isOSX ? "metaKey" : "ctrlKey",
      modB = isOSX ? "altKey" : "shiftKey",
      execKey = isOSX ? "E" : "SPACE",
      skyGeom = shell( 50, 8, 4, Math.PI * 2, Math.PI ),
      sky = textured( skyGeom, "../images/bg2.jpg", true ),
      floor = textured( box( 25, 1, 25 ), "../images/deck.png", false, 1, 25, 25 ),
      terminal = null,
      app = new Primrose.VRApplication( "Commodore", {
        sceneModel: "commodore_pet.json",
        regularFullScreenButton: document.getElementById( "goRegular" ),
        vrFullScreenButton: document.getElementById( "goVR" )
      } );

  window.addEventListener( "keydown", keyDown.bind( this ) );
  window.addEventListener( "keyup", function ( evt ) {
    keyState[evt.keyCode] = false;
  } );

  function keyDown ( evt ) {
    if ( !this.currentEditor ||
        !this.currentEditor.focused ) {
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

  app.addEventListener( "ready", function () {

    this.scene.traverse( function ( obj ) {
      if ( obj.name && obj.parent && obj.parent.uuid === this.scene.uuid ) {
        obj.position.y += this.avatarHeight * 0.9;
        obj.position.z -= 1;
      }
    }.bind( this ) );

    put( light( 0xffffff ) ).on( this.scene ).at( 0, 20, 0 );
    put( sky ).on( this.scene ).at( 0, 0, 0 );
    put( floor ).on( this.scene ).at( 0, 0, 0 );

    this.convertToEditor( this.scene.Screen );
    terminal = new Primrose.Text.Terminal( this.scene.Screen.textarea );
    terminal.loadFile( "../oregon.bas" );
  } );

  app.addEventListener( "update", function ( ) {
    sky.position.copy( this.currentUser.position );
  } );

  app.start();
}