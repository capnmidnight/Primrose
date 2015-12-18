/* global Primrose, THREE */

Primrose.Input.FPSInput = ( function ( ) {
  function FPSInput ( DOMElement ) {
    DOMElement = DOMElement || window;
    this.managers = [
      // keyboard should always run on the window
      new Primrose.Input.Keyboard( "keyboard", window, [
        {name: "strafeLeft", buttons: [
            -Primrose.Input.Keyboard.A,
            -Primrose.Input.Keyboard.LEFTARROW ]},
        {name: "strafeRight", buttons: [
            Primrose.Input.Keyboard.D,
            Primrose.Input.Keyboard.RIGHTARROW ]},
        {name: "strafe", commands: [ "strafeLeft", "strafeRight" ]},
        {name: "driveForward", buttons: [
            -Primrose.Input.Keyboard.W,
            -Primrose.Input.Keyboard.UPARROW ]},
        {name: "driveBack", buttons: [
            Primrose.Input.Keyboard.S,
            Primrose.Input.Keyboard.DOWNARROW ]},
        {name: "drive", commands: [ "driveForward", "driveBack" ]},
        {name: "jump", buttons: [
            Primrose.Input.Keyboard.SPACEBAR ],
          metaKeys: [
            -Primrose.Input.Keyboard.SHIFT ],
          commandDown: function ( ) {
            this.jump( );
          }.bind( this ), dt: 0.5},
        {name: "zero", buttons: [
            Primrose.Input.Keyboard.Z ],
          metaKeys: [
            Primrose.Input.Keyboard.SHIFT ],
          commandUp: function ( ) {
            this.zero( );
          }.bind( this )}
      ] ),
      new Primrose.Input.Mouse( "mouse", DOMElement, [
        {name: "buttons", axes: [ Primrose.Input.Mouse.BUTTONS ]},
        {name: "dButtons", axes: [ Primrose.Input.Mouse.BUTTONS ], delta: true},
        {name: "dx", axes: [ -Primrose.Input.Mouse.X ], delta: true, scale: 0.5},
        {name: "heading", commands: [ "dx" ], integrate: true},
        {name: "dy", axes: [ -Primrose.Input.Mouse.Y ], delta: true, scale: 0.5},
        {name: "pitch", commands: [ "dy" ], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5},
        {name: "pointerPitch", commands: [ "dy" ], integrate: true, min: -Math.PI * 0.25, max: Math.PI * 0.25}
      ] ),
      new Primrose.Input.Touch( "touch", DOMElement, [
        {name: "buttons", axes: [ Primrose.Input.Touch.FINGERS ]},
        {name: "dButtons", axes: [ Primrose.Input.Touch.FINGERS ], delta: true}
      ] ),
      new Primrose.Input.Gamepad( "gamepad", [
        {name: "strafe", axes: [ Primrose.Input.Gamepad.LSX ]},
        {name: "drive", axes: [ Primrose.Input.Gamepad.LSY ]},
        {name: "heading", axes: [ -Primrose.Input.Gamepad.RSX ], integrate: true},
        {name: "dheading", commands: [ "heading" ], delta: true},
        {name: "pitch", axes: [ Primrose.Input.Gamepad.RSY ], integrate: true}
      ] ),
      new Primrose.Input.VR( "vr" ) ];
    this.managers.reduce( function ( inst, mgr ) {
      inst[mgr.name] = mgr;
      return inst;
    }, this );
    this.connectGamepad = function ( id ) {
      if ( !this.gamepad.isGamepadSet( ) && confirm( fmt(
          "Would you like to use this gamepad? \"$1\"", id ) ) ) {
        this.gamepad.setGamepad( id );
      }
    };
    this.gamepad.addEventListener( "gamepadconnected", this.connectGamepad.bind( this ), false );
  }

  FPSInput.prototype.update = function ( dt ) {
    for ( var i = 0; i < this.managers.length; ++i ) {
      this.managers[i].update( dt );
    }
  };
  FPSInput.prototype.addEventListener = function ( evt, thunk, bubbles ) {
    this.managers.forEach( function ( mgr ) {
      if ( mgr.addEventListener ) {
        mgr.addEventListener( evt, thunk, bubbles );
      }
    } );
  };
  FPSInput.prototype.getValue = function ( name ) {
    var value = 0;
    for ( var i = 0; i < this.managers.length; ++i ) {
      value += this.managers[i].getValue( name );
    }
    return value;
  };
  FPSInput.prototype.getVector3 = function ( x, y, z, value ) {
    value = value || new THREE.Vector3( );
    value.set( 0, 0, 0 );
    for ( var i = 0; i < this.managers.length; ++i ) {
      this.managers[i].addVector3( x, y, z, value );
    }
    return value;
  };
  FPSInput.prototype.getVector3s = function ( x, y, z, values ) {
    values = values || [ ];
    for ( var i = 0; i < this.managers.length; ++i ) {
      values[i] = this.managers[i].getVector3( x, y, z, values[i] );
    }
    return values;
  };

  var temp = new THREE.Quaternion( );
  FPSInput.prototype.getQuaternion = function ( x, y, z, w, value ) {
    value = value || new THREE.Quaternion( );
    value.set( 0, 0, 0, 1 );
    for ( var i = 0; i < this.managers.length; ++i ) {
      var mgr = this.managers[i];
      if ( mgr.getQuaternion ) {
        mgr.getQuaternion( x, y, z, w, temp );
        value.multiply( temp );
      }
    }
    return value;
  };

  return FPSInput;
} )( );