/* global Primrose, THREE, emit, isMobile, pliny */

Primrose.Input.FPSInput = ( function ( ) {
  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.FPSInput](#Primrose_Input_FPSInput) class in the input/ directory"
  } );
  
  pliny.class("Primrose.Input", {
    name: "FPSInput",
    description: "<under construction>"
  });
  function FPSInput ( DOMElement, near, far ) {
    DOMElement = DOMElement || window;

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.listeners",
      type: "open",
      description: ""
    } );
    this.listeners = {
      jump: [ ],
      zero: [ ]
    };

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.managers",
      type: "open",
      description: ""
    } );
    this.managers = [
      // keyboard should always run on the window
      new Primrose.Input.Keyboard( "keyboard", window, {
        strafeLeft: {
          buttons: [
            -Primrose.Keys.A,
            -Primrose.Keys.LEFTARROW ]},
        strafeRight: {
          buttons: [
            Primrose.Keys.D,
            Primrose.Keys.RIGHTARROW ]},
        strafe: {commands: [ "strafeLeft", "strafeRight" ]},
        driveForward: {
          buttons: [
            -Primrose.Keys.W,
            -Primrose.Keys.UPARROW ]},
        driveBack: {
          buttons: [
            Primrose.Keys.S,
            Primrose.Keys.DOWNARROW ]},
        drive: {commands: [ "driveForward", "driveBack" ]},
        select: {buttons: [ Primrose.Keys.ENTER ]},
        dSelect: {buttons: [ Primrose.Keys.ENTER ], delta: true},
        jump: {
          buttons: [ Primrose.Keys.SPACE ],
          metaKeys: [ -Primrose.Keys.SHIFT ],
          commandDown: emit.bind( this, "jump" ), dt: 0.5
        },
        zero: {
          buttons: [ Primrose.Keys.Z ],
          metaKeys: [
            -Primrose.Keys.CTRL,
            -Primrose.Keys.ALT,
            -Primrose.Keys.SHIFT,
            -Primrose.Keys.META
          ],
          commandUp: emit.bind( this, "zero" )
        }
      } ),
      new Primrose.Input.Mouse( "mouse", DOMElement, {
        buttons: {axes: [ Primrose.Input.Mouse.BUTTONS ]},
        dButtons: {axes: [ Primrose.Input.Mouse.BUTTONS ], delta: true},
        dx: {axes: [ -Primrose.Input.Mouse.X ], delta: true, scale: 0.005, min: -5, max: 5},
        heading: {commands: [ "dx" ], integrate: true},
        dy: {axes: [ -Primrose.Input.Mouse.Y ], delta: true, scale: 0.005, min: -5, max: 5},
        pitch: {commands: [ "dy" ], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5},
        pointerPitch: {commands: [ "dy" ], integrate: true, min: -Math.PI * 0.25, max: Math.PI * 0.25}
      } ),
      new Primrose.Input.Touch( "touch", DOMElement, {
        buttons: {axes: [ Primrose.Input.Touch.FINGERS ]},
        dButtons: {axes: [ Primrose.Input.Touch.FINGERS ], delta: true}
      } ),
      new Primrose.Input.Gamepad( "gamepad", {
        strafe: {axes: [ Primrose.Input.Gamepad.LSX ]},
        drive: {axes: [ Primrose.Input.Gamepad.LSY ]},
        heading: {axes: [ -Primrose.Input.Gamepad.RSX ], integrate: true},
        dheading: {commands: [ "heading" ], delta: true},
        pitch: {axes: [ Primrose.Input.Gamepad.RSY ], integrate: true}
      } ) ];
    
    if ( isVR ) {
      this.managers.push( new Primrose.Input.VR( "vr", near, far ) );
    }
    else if ( isMobile ) {
      this.managers.push(
          new Primrose.Input.Motion( "motion", {
            headVX: {axes: [ Primrose.Input.Motion.headAX ], integrate: true},
            headVY: {axes: [ Primrose.Input.Motion.headAY ], integrate: true},
            headVZ: {axes: [ Primrose.Input.Motion.headAZ ], integrate: true},
            headX: {commands: [ Primrose.Input.Motion.headVX ], integrate: true},
            headY: {commands: [ Primrose.Input.Motion.headVY ], integrate: true},
            headZ: {commands: [ Primrose.Input.Motion.headVZ ], integrate: true}
          } ) );
    }

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.keyboard",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.mouse",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.touch",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.gamepad",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.vr",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.motion",
      type: "open",
      description: ""
    } );

    this.managers.reduce( function ( inst, mgr ) {
      inst[mgr.name] = mgr;
      return inst;
    }, this );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.connectGamepad",
      type: "open",
      description: ""
    } );
    this.connectGamepad = function ( id ) {
      if ( !this.gamepad.isGamepadSet( ) && confirm( fmt(
          "Would you like to use this gamepad? \"$1\"", id ) ) ) {
        this.gamepad.setGamepad( id );
      }
    };
    this.gamepad.addEventListener( "gamepadconnected", this.connectGamepad.bind( this ), false );
  }

  var SETTINGS_TO_ZERO = [ "heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ" ];

  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput.zero",
    type: "open",
    description: ""
  } );
  FPSInput.prototype.zero = function () {
    if ( this.vr ) {
      this.vr.sensor.resetSensor( );
    }
    if ( this.motion ) {
      this.motion.zeroAxes();
    }
    for ( var i = 0; i < this.managers.length; ++i ) {
      var mgr = this.managers[i];
      for ( var j = 0; mgr.enabled && j < SETTINGS_TO_ZERO.length; ++j ) {
        mgr.setValue( SETTINGS_TO_ZERO[j], 0 );
      }
    }
  };

  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput.update",
    type: "open",
    description: ""
  } );
  FPSInput.prototype.update = function ( dt ) {
    for ( var i = 0; i < this.managers.length; ++i ) {
      var mgr = this.managers[i];
      if ( mgr.enabled ) {
        mgr.update( dt );
      }
    }
  };

  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput.addEventListener",
    type: "open",
    description: ""
  } );
  FPSInput.prototype.addEventListener = function ( evt, thunk, bubbles ) {
    if ( this.listeners[evt] ) {
      this.listeners[evt].push( thunk );
    }
    else {
      this.managers.forEach( function ( mgr ) {
        if ( mgr.addEventListener ) {
          mgr.addEventListener( evt, thunk, bubbles );
        }
      } );
    }
  };

  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput.getValue",
    type: "open",
    description: ""
  } );
  FPSInput.prototype.getValue = function ( name ) {
    var value = 0;
    for ( var i = 0; i < this.managers.length; ++i ) {
      var mgr = this.managers[i];
      if ( mgr.enabled ) {
        value += mgr.getValue( name );
      }
    }
    return value;
  };

  if ( window.THREE ) {
    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.getVector3",
      type: "open",
      description: ""
    } );
    FPSInput.prototype.getVector3 = function ( x, y, z, value ) {
      value = value || new THREE.Vector3( );
      value.set( 0, 0, 0 );
      for ( var i = 0; i < this.managers.length; ++i ) {
        var mgr = this.managers[i];
        if ( mgr.enabled ) {
          mgr.addVector3( x, y, z, value );
        }
      }
      return value;
    };

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.getVector3s",
      type: "open",
      description: ""
    } );
    FPSInput.prototype.getVector3s = function ( x, y, z, values ) {
      values = values || [ ];
      for ( var i = 0; i < this.managers.length; ++i ) {
        var mgr = this.managers[i];
        if ( mgr.enabled ) {
          values[i] = mgr.getVector3( x, y, z, values[i] );
        }
      }
      return values;
    };

    var temp = new THREE.Quaternion( );
    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.getQuaternion",
      type: "open",
      description: ""
    } );
    FPSInput.prototype.getQuaternion = function ( x, y, z, w, value, accumulate ) {
      value = value || new THREE.Quaternion( );
      value.set( 0, 0, 0, 1 );
      for ( var i = 0; i < this.managers.length; ++i ) {
        var mgr = this.managers[i];
        if ( mgr.enabled && mgr.getQuaternion ) {
          mgr.getQuaternion( x, y, z, w, temp );
          value.multiply( temp );
          if ( !accumulate ) {
            break;
          }
        }
      }
      return value;
    };

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.transforms",
      type: "open",
      description: ""
    } );
    Object.defineProperties( FPSInput.prototype, {
      transforms: {
        get: function () {
          if ( this.vr && this.vr.transforms ) {
            return this.vr.transforms;
          }
          else {
            return Primrose.Input.Motion.DEFAULT_TRANSFORMS;
          }
        }
      }
    } );

    return FPSInput;
  }
} )( );