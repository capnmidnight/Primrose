/* global Primrose */

Primrose.Input.Keyboard = ( function () {

  function KeyboardInput ( name, DOMElement, commands, socket ) {
    DOMElement = DOMElement || window;

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket );

    function execute ( stateChange, event ) {
      this.setButton( event.keyCode, stateChange );
    }

    DOMElement.addEventListener( "keydown", execute.bind( this, true ),
        false );
    DOMElement.addEventListener( "keyup", execute.bind( this, false ), false );
  }

  Primrose.Input.ButtonAndAxis.inherit( KeyboardInput );
  return KeyboardInput;
} )();
