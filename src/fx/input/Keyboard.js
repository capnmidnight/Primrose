/* global Primrose, pliny */

Primrose.Input.Keyboard = ( function () {

  pliny.class( "Primrose.Input", {
    name: "Keyboard",
    baseClass: "Primrose.Input.ButtonAndAxis",
    description: "",
    parameters: [
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""}
    ]
  } );
  function KeyboardInput ( name, DOMElement, commands, socket ) {
    DOMElement = DOMElement || window;

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket );

    function execute ( stateChange, event ) {
      this.setButton( event.keyCode, stateChange );
    }

    DOMElement.addEventListener( "keydown", execute.bind( this, true ), false );
    DOMElement.addEventListener( "keyup", execute.bind( this, false ), false );
  }

  Primrose.Input.ButtonAndAxis.inherit( KeyboardInput );
  return KeyboardInput;
} )();

pliny.issue( "Primrose.Input.Keyboard", {
  name: "document Keyboard",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.Keyboard](#Primrose_Input_Keyboard) class in the input/ directory"
} );
