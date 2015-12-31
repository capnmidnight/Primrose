/* global isOSX, Primrose, THREE, requestFullScreen, put */

var keyState = {},
    modA = isOSX ? "metaKey" : "ctrlKey",
    modB = isOSX ? "altKey" : "shiftKey",
    execKey = isOSX ? "E" : "SPACE",
    terminal = null,
    app = new Primrose.VRApplication( "Commodore", {
      disableAutoFullScreen: true,
      sceneModel: "commodore_pet.json",
      skyTexture: "../images/bg2.jpg",
      groundTexture: "../images/deck.png"
    } );

app.setFullScreenButton( "goVR", "click", true );
app.setFullScreenButton( "goRegular", "click", false );

window.addEventListener( "keyup", function ( evt ) {
  keyState[evt.keyCode] = false;
} );

function isExecuteCommand ( evt ) {
  return evt[modA] && evt[modB] && evt.keyCode === Primrose.Keys[execKey];
}

window.addEventListener( "keydown", function ( evt ) {
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
}.bind( this ) );

app.addEventListener( "ready", function () {

  this.scene.traverse( function ( obj ) {
    if ( obj.name && obj.parent && obj.parent.uuid === this.scene.uuid ) {
      obj.position.y += this.avatarHeight * 0.9;
      obj.position.z -= 1;
    }
  }.bind( this ) );

  put( light( 0xffffff ) ).on( this.scene ).at( 0, 20, 0 );

  var editor = this.convertToEditor( this.scene.Screen );
  editor.padding = 10;
  terminal = new Primrose.Text.Terminal( this.scene.Screen.textarea );
  terminal.loadFile( "../oregon.bas" );
}.bind( app ) );