/* global isOSX, Primrose, THREE, isMobile, requestFullScreen, put */
console.clear();

var app;
function PrimroseDemo () {
  var keyState = {},
      modA = isOSX ? "metaKey" : "ctrlKey",
      modB = isOSX ? "altKey" : "shiftKey",
      execKey = isOSX ? "E" : "SPACE",
      terminal = null,
      app = new Primrose.VRApplication( "Commodore", {
        sceneModel: "commodore_pet.json",
        skyTexture: "../images/bg2.jpg",
        groundTexture: "../images/deck.png"
      } );


  app.ctrls.goVR.addEventListener( "click", app.goFullScreen.bind( app, false ), false );
  app.ctrls.goRegular.addEventListener( "click", app.goFullScreen.bind( app, true ), false );

  function connectVR ( ) {
    if ( app.input.vr.deviceIDs.length > 0 ) {
      if ( app.ctrls.goVR ) {
        app.ctrls.goVR.style.display = "inline-block";
      }
    }
    else if ( app.ctrls.goVR ) {
      app.ctrls.goVR.style.display = "none";
    }
  }

  app.input.addEventListener( "vrdeviceconnected", connectVR, false );
  app.input.addEventListener( "vrdevicelost", connectVR, false );

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
        evt.keyCode === Primrose.Keys.ENTER ) {
      terminal.sendInput( evt );
    }
    else if ( !terminal.running &&
        isExecuteCommand( evt ) ) {
      terminal.execute();
    }
  }

  function isExecuteCommand ( evt ) {
    return evt[modA] && evt[modB] && evt.keyCode === Primrose.Keys[execKey];
  }

  app.addEventListener( "ready", function () {

    this.scene.traverse( function ( obj ) {
      if ( obj.name && obj.parent && obj.parent.uuid === this.scene.uuid ) {
        obj.position.y += this.avatarHeight * 0.9;
        obj.position.z -= 1;
      }
    }.bind( this ) );

    put( light( 0xffffff ) ).on( this.scene ).at( 0, 20, 0 );

    this.convertToEditor( this.scene.Screen );
    terminal = new Primrose.Text.Terminal( this.scene.Screen.textarea );
    terminal.loadFile( "../oregon.bas" );
  }.bind( app ) );
}