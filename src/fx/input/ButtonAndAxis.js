/* global Primrose, THREE, pliny */

Primrose.Input.ButtonAndAxis = ( function () {

  pliny.theElder.class( "Primrose.Input", {
    name: "ButtonAndAxis",
    author: "Sean T. McBeth",
    description: "",
    parameters: [
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""}
    ]
  } );
  function ButtonAndAxisInput ( name, commands, socket, axes ) {
    Primrose.NetworkedInput.call( this, name, commands, socket );
    this.inputState.axes = [ ];
    this.inputState.buttons = [ ];
    this.axisNames = axes || [ ];

    for ( var i = 0; i < this.axisNames.length; ++i ) {
      this.inputState.axes[i] = 0;
    }

    this.setDeadzone = this.setProperty.bind( this, "deadzone" );
    this.setScale = this.setProperty.bind( this, "scale" );
    this.setDT = this.setProperty.bind( this, "dt" );
    this.setMin = this.setProperty.bind( this, "min" );
    this.setMax = this.setProperty.bind( this, "max" );

    this.addMetaKey = this.addToArray.bind( this, "metaKeys" );
    this.addAxis = this.addToArray.bind( this, "axes" );
    this.addButton = this.addToArray.bind( this, "buttons" );

    this.removeMetaKey = this.removeFromArray.bind( this, "metaKeys" );
    this.removeAxis = this.removeFromArray.bind( this, "axes" );
    this.removeButton = this.removeFromArray.bind( this, "buttons" );

    this.invertAxis = this.invertInArray.bind( this, "axes" );
    this.invertButton = this.invertInArray.bind( this, "buttons" );
    this.invertMetaKey = this.invertInArray.bind( this, "metaKeys" );
  }

  inherit( ButtonAndAxisInput, Primrose.NetworkedInput );

  ButtonAndAxisInput.inherit = function ( classFunc ) {
    inherit( classFunc, ButtonAndAxisInput );
    if ( classFunc.AXES ) {
      classFunc.AXES.forEach( function ( name, i ) {
        classFunc[name] = i + 1;
        Object.defineProperty( classFunc.prototype, name, {
          get: function () {
            return this.getAxis( name );
          },
          set: function ( v ) {
            this.setAxis( name, v );
          }
        } );
      } );
    }
  };

  ButtonAndAxisInput.prototype.getAxis = function ( name ) {
    var i = this.axisNames.indexOf( name );
    if ( i > -1 ) {
      var value = this.inputState.axes[i] || 0;
      return value;
    }
    return null;
  };

  ButtonAndAxisInput.prototype.setAxis = function ( name, value ) {
    var i = this.axisNames.indexOf( name );
    if ( i > -1 ) {
      this.inPhysicalUse = true;
      this.inputState.axes[i] = value;
    }
  };

  ButtonAndAxisInput.prototype.setButton = function ( index, pressed ) {
    this.inPhysicalUse = true;
    this.inputState.buttons[index] = pressed;
  };

  ButtonAndAxisInput.prototype.getValue = function ( name ) {
    return ( ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        this.isEnabled( name ) &&
        this.commands[name].state.value ) ||
        this.getAxis( name ) || 0;
  };

  ButtonAndAxisInput.prototype.setValue = function ( name, value ) {
    var j = this.axisNames.indexOf( name );
    if ( !this.commands[name] && j > -1 ) {
      this.setAxis( name, value );
    }
    else if ( this.commands[name] && !this.commands[name].disabled ) {
      this.commands[name].state.value = value;
    }
  };

  ButtonAndAxisInput.prototype.getVector3 = function ( x, y, z, value ) {
    value = value || new THREE.Vector3();
    value.set(
        this.getValue( x ),
        this.getValue( y ),
        this.getValue( z ) );
    return value;
  };

  ButtonAndAxisInput.prototype.addVector3 = function ( x, y, z, value ) {
    value.x += this.getValue( x );
    value.y += this.getValue( y );
    value.z += this.getValue( z );
    return value;
  };

  ButtonAndAxisInput.prototype.isDown = function ( name ) {
    return ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        this.isEnabled( name ) &&
        this.commands[name].state.pressed;
  };

  ButtonAndAxisInput.prototype.isUp = function ( name ) {
    return ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        this.isEnabled( name ) &&
        this.commands[name].state.pressed;
  };

  ButtonAndAxisInput.prototype.maybeClone = function ( arr ) {
    var output = [ ];
    if ( arr ) {
      for ( var i = 0; i < arr.length; ++i ) {
        output[i] = {
          index: Math.abs( arr[i] ) - 1,
          toggle: arr[i] < 0,
          sign: ( arr[i] < 0 ) ? -1 : 1
        };
      }
    }
    return output;
  };

  ButtonAndAxisInput.prototype.cloneCommand = function ( cmd ) {
    return {
      name: cmd.name,
      disabled: !!cmd.disabled,
      dt: cmd.dt || 0,
      deadzone: cmd.deadzone || 0,
      threshold: cmd.threshold || 0,
      repetitions: cmd.repetitions || 1,
      scale: cmd.scale,
      offset: cmd.offset,
      min: cmd.min,
      max: cmd.max,
      integrate: cmd.integrate || false,
      delta: cmd.delta || false,
      axes: this.maybeClone( cmd.axes ),
      commands: cmd.commands && cmd.commands.slice() || [ ],
      buttons: this.maybeClone( cmd.buttons ),
      metaKeys: this.maybeClone( cmd.metaKeys && cmd.metaKeys.map( function ( k ) {
        for ( var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i ) {
          var m = Primrose.Keys.MODIFIER_KEYS[i];
          if ( Math.abs( k ) === Primrose.Keys[m.toLocaleUpperCase()] ) {
            return Math.sign( k ) * ( i + 1 );
          }
        }
      }.bind( this ) ) ),
      commandDown: cmd.commandDown,
      commandUp: cmd.commandUp
    };
  };

  ButtonAndAxisInput.prototype.evalCommand = function ( cmd, metaKeysSet, dt ) {
    if ( metaKeysSet ) {
      var pressed = true,
          value = 0,
          n, v;

      if ( cmd.buttons ) {
        for ( n = 0; n < cmd.buttons.length; ++n ) {
          var b = cmd.buttons[n];
          var p = !!this.inputState.buttons[b.index + 1];
          v = p ? b.sign : 0;
          pressed = pressed && ( p && !b.toggle || !p && b.toggle );
          if ( Math.abs( v ) > Math.abs( value ) ) {
            value = v;
          }
        }
      }

      if ( cmd.axes ) {
        for ( n = 0; n < cmd.axes.length; ++n ) {
          var a = cmd.axes[n];
          v = a.sign * this.inputState.axes[a.index];
          if ( Math.abs( v ) > Math.abs( value ) ) {
            value = v;
          }
        }
      }

      for ( n = 0; n < cmd.commands.length; ++n ) {
        v = this.getValue( cmd.commands[n] );
        if ( Math.abs( v ) > Math.abs( value ) ) {
          value = v;
        }
      }

      if ( cmd.scale !== undefined ) {
        value *= cmd.scale;
      }

      if ( cmd.offset !== undefined ) {
        value += cmd.offset;
      }

      if ( cmd.deadzone && Math.abs( value ) < cmd.deadzone ) {
        value = 0;
      }

      if ( cmd.integrate ) {
        value = this.getValue( cmd.name ) + value * dt;
      }
      else if ( cmd.delta ) {
        var ov = value;
        if ( cmd.state.lv !== undefined ) {
          value = ( value - cmd.state.lv ) / dt;
        }
        cmd.state.lv = ov;
      }

      if ( cmd.min !== undefined ) {
        value = Math.max( cmd.min, value );
      }

      if ( cmd.max !== undefined ) {
        value = Math.min( cmd.max, value );
      }

      if ( cmd.threshold ) {
        pressed = pressed && ( value > cmd.threshold );
      }

      cmd.state.pressed = pressed;
      cmd.state.value = value;
    }
  };

  return ButtonAndAxisInput;
} )();
