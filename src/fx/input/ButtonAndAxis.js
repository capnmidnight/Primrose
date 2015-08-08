/* global Primrose */

Primrose.Input.ButtonAndAxis = ( function () {
  function ButtonAndAxisInput ( name, commands, socket, oscope, offset,
      axes ) {
    this.offset = offset || 0;
    Primrose.NetworkedInput.call( this, name, commands, socket, oscope );
    this.inputState.axes = [ ];
    this.inputState.buttons = [ ];
    this.axisNames = axes || [ ];
    this.commandNames = this.commands.map( function ( c ) {
      return c.name;
    } );

    for ( var i = 0; i < this.axisNames.length; ++i ) {
      this.inputState.axes[i] = 0;
    }

    this.setDeadzone = this.setProperty.bind( this, "deadzone" );
    this.setScale = this.setProperty.bind( this, "scale" );
    this.setDT = this.setProperty.bind( this, "dt" );
    this.setMin = this.setProperty.bind( this, "min" );
    this.setMax = this.setProperty.bind( this, "max" );
    this.setOffset = this.setProperty.bind( this, "offset" );

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
    var i = this.commandNames.indexOf( name );
    return ( ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        i > -1 &&
        !this.commands[i].disabled &&
        this.commandState[name] &&
        this.commandState[name].value ) || 0;
  };

  ButtonAndAxisInput.prototype.isDown = function ( name ) {
    var i = this.commandNames.indexOf( name );
    return ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        i > -1 &&
        !this.commands[i].disabled &&
        this.commandState[name] &&
        this.commandState[name].pressed;
  };

  ButtonAndAxisInput.prototype.isUp = function ( name ) {
    var i = this.commandNames.indexOf( name );
    return ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        i > -1 &&
        !this.commands[i].disabled &&
        this.commandState[name] &&
        !this.commandState[name].pressed;
  };

  ButtonAndAxisInput.prototype.maybeClone = function ( arr ) {
    var output = [ ];
    if ( arr ) {
      for ( var i = 0; i < arr.length; ++i ) {
        output[i] = {
          index: Math.abs( arr[i] ) - this.offset,
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
      metaKeys: this.maybeClone( cmd.metaKeys ),
      commandDown: cmd.commandDown,
      commandUp: cmd.commandUp
    };
  };

  ButtonAndAxisInput.prototype.evalCommand = function ( cmd, cmdState,
      metaKeysSet, dt ) {
    if ( metaKeysSet ) {
      var pressed = true,
          value = 0,
          n, v;

      if ( cmd.buttons ) {
        for ( n = 0; n < cmd.buttons.length; ++n ) {
          var b = cmd.buttons[n];
          var p = !!this.inputState.buttons[b.index];
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

      if ( cmd.commands ) {
        for ( n = 0; n < cmd.commands.length; ++n ) {
          v = this.getValue( cmd.commands[n] );
          if ( Math.abs( v ) > Math.abs( value ) ) {
            value = v;
          }
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
        if ( cmdState.lv !== undefined ) {
          value = value - cmdState.lv;
        }
        cmdState.lv = ov;
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

      cmdState.pressed = pressed;
      cmdState.value = value;
    }
  };

  return ButtonAndAxisInput;
} )();
