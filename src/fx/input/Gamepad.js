/* global Primrose */

Primrose.Input.Gamepad = ( function () {
  function GamepadInput ( name, commands, socket, oscope, gpid ) {
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, oscope, 1,
        GamepadInput.AXES, true );
    var connectedGamepads = [ ],
        listeners = {
          gamepadconnected: [ ],
          gamepaddisconnected: [ ]
        };

    this.superUpdate = this.update;

    this.checkDevice = function ( pad ) {
      var i;
      for ( i = 0; i < pad.buttons.length; ++i ) {
        this.setButton( i, pad.buttons[i].pressed );
      }
      for ( i = 0; i < pad.axes.length; ++i ) {
        this.setAxis( GamepadInput.AXES[i], pad.axes[i] );
      }
    };

    this.update = function ( dt ) {
      var pads,
          currentPads = [ ],
          i;

      if ( navigator.getGamepads ) {
        pads = navigator.getGamepads();
      }
      else if ( navigator.webkitGetGamepads ) {
        pads = navigator.webkitGetGamepads();
      }

      if ( pads ) {
        for ( i = 0; i < pads.length; ++i ) {
          var pad = pads[i];
          if ( pad ) {
            if ( connectedGamepads.indexOf( pad.id ) === -1 ) {
              connectedGamepads.push( pad.id );
              onConnected( pad.id );
            }
            if ( pad.id === gpid ) {
              this.checkDevice( pad );
            }
            currentPads.push( pad.id );
          }
        }
      }

      for ( i = connectedGamepads.length - 1; i >= 0; --i ) {
        if ( currentPads.indexOf( connectedGamepads[i] ) === -1 ) {
          onDisconnected( connectedGamepads[i] );
          connectedGamepads.splice( i, 1 );
        }
      }

      this.superUpdate( dt );
    };

    function add ( arr, val ) {
      if ( arr.indexOf( val ) === -1 ) {
        arr.push( val );
      }
    }

    function remove ( arr, val ) {
      var index = arr.indexOf( val );
      if ( index > -1 ) {
        arr.splice( index, 1 );
      }
    }

    function sendAll ( arr, id ) {
      for ( var i = 0; i < arr.length; ++i ) {
        arr[i]( id );
      }
    }

    function onConnected ( id ) {
      sendAll( listeners.gamepadconnected, id );
    }

    function onDisconnected ( id ) {
      sendAll( listeners.gamepaddisconnected, id );
    }

    this.getErrorMessage = function () {
      return errorMessage;
    };

    this.setGamepad = function ( id ) {
      gpid = id;
      this.inPhysicalUse = true;
    };

    this.clearGamepad = function () {
      gpid = null;
      this.inPhysicalUse = false;
    };

    this.isGamepadSet = function () {
      return !!gpid;
    };

    this.getConnectedGamepads = function () {
      return connectedGamepads.slice();
    };

    this.addEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        listeners[event].push( handler );
      }
      if ( event === "gamepadconnected" ) {
        connectedGamepads.forEach( onConnected );
      }
    };

    this.removeEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        remove( listeners[event], handler );
      }
    };

    try {
      this.update( 0 );
      available = true;
    }
    catch ( err ) {
      avaliable = false;
      errorMessage = err;
    }
  }

  GamepadInput.AXES = [ "LSX", "LSY", "RSX", "RSY" ];
  Primrose.Input.ButtonAndAxis.inherit( GamepadInput );
  return GamepadInput;
} )();

Primrose.Input.Gamepad.XBOX_BUTTONS = {
    'A': 1,
    'B': 2,
    'X': 3,
    'Y': 4,
    'leftBumper': 5,
    'rightBumper': 6,
    'leftTrigger': 7,
    'rightTrigger': 8,
    'back': 9,
    'start': 10,
    'leftStick': 11,
    'rightStick': 12,
    'up': 13,
    'down': 14,
    'left': 15,
    'right': 16
};
