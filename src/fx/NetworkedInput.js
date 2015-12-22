/* global Primrose */

Primrose.NetworkedInput = ( function () {
  function NetworkedInput ( name, commands, socket ) {
    this.name = name;
    this.commandState = {};
    this.commands = [ ];
    this.socket = socket;
    this.enabled = true;
    this.paused = false;
    this.ready = true;
    this.transmitting = true;
    this.receiving = true;
    this.socketReady = false;
    this.inPhysicalUse = true;
    this.inputState = {};
    this.lastState = "";

    function readMetaKeys ( event ) {
      for ( var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i ) {
        var m = Primrose.Keys.MODIFIER_KEYS[i];
        this.inputState[m] = event[m + "Key"];
      }
    }

    window.addEventListener( "keydown", readMetaKeys.bind( this ), false );
    window.addEventListener( "keyup", readMetaKeys.bind( this ), false );

    if ( socket ) {
      socket.on( "open", function () {
        this.socketReady = true;
        this.inPhysicalUse = !this.receiving;
      }.bind( this ) );
      socket.on( name, function ( cmdState ) {
        if ( this.receiving ) {
          this.inPhysicalUse = false;
          this.decodeStateSnapshot( cmdState );
          this.fireCommands();
        }
      }.bind( this ) );
      socket.on( "close", function () {
        this.inPhysicalUse = true;
        this.socketReady = false;
      }.bind( this ) );
    }

    for ( var i = 0; i < commands.length; ++i ) {
      this.addCommand( commands[i] );
    }

    for ( i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i ) {
      this.inputState[Primrose.Keys.MODIFIER_KEYS[i]] = false;
    }
  }

  NetworkedInput.prototype.addCommand = function ( cmd ) {
    cmd = this.cloneCommand( cmd );
    cmd.repetitions = cmd.repetitions || 1;
    this.commands.push( cmd );
    this.commandState[cmd.name] = {
      value: null,
      pressed: false,
      wasPressed: false,
      fireAgain: false,
      lt: 0,
      ct: 0,
      repeatCount: 0
    };
  };

  NetworkedInput.prototype.cloneCommand = function ( cmd ) {
    throw new Error( "cloneCommand function must be defined in subclass" );
  };

  NetworkedInput.prototype.update = function ( dt ) {
    if ( this.ready && this.enabled && this.inPhysicalUse && !this.paused ) {
      for ( var c = 0; c < this.commands.length; ++c ) {
        var cmd = this.commands[c];
        var cmdState = this.commandState[cmd.name];
        cmdState.wasPressed = cmdState.pressed;
        cmdState.pressed = false;
        if ( !cmd.disabled ) {
          var metaKeysSet = true;

          if ( cmd.metaKeys ) {
            for ( var n = 0; n < cmd.metaKeys.length && metaKeysSet; ++n ) {
              var m = cmd.metaKeys[n];
              metaKeysSet = metaKeysSet &&
                  ( this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] &&
                      !m.toggle ||
                      !this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] &&
                      m.toggle );
            }
          }

          this.evalCommand( cmd, cmdState, metaKeysSet, dt );

          cmdState.lt += dt;
          if ( cmdState.lt >= cmd.dt ) {
            cmdState.repeatCount++;
          }

          cmdState.fireAgain = cmdState.pressed &&
              cmdState.lt >= cmd.dt &&
              cmdState.repeatCount >= cmd.repetitions;

          if ( cmdState.fireAgain ) {
            cmdState.lt = 0;
            cmdState.repeatCount = 0;
          }
        }
      }

      if ( this.socketReady && this.transmitting ) {
        var finalState = this.makeStateSnapshot();
        if ( finalState !== this.lastState ) {
          this.socket.emit( this.name, finalState );
          this.lastState = finalState;
        }
      }

      this.fireCommands();
    }
  };

  NetworkedInput.prototype.fireCommands = function () {
    if ( this.ready && !this.paused ) {
      for ( var i = 0; i < this.commands.length; ++i ) {
        var cmd = this.commands[i];
        var cmdState = this.commandState[cmd.name];
        if ( cmdState.fireAgain && cmd.commandDown ) {
          cmd.commandDown();
        }

        if ( !cmdState.pressed && cmdState.wasPressed && cmd.commandUp ) {
          cmd.commandUp();
        }
      }
    }
  };

  NetworkedInput.prototype.makeStateSnapshot = function () {
    var state = "";
    for ( var i = 0; i < this.commands.length; ++i ) {
      var cmd = this.commands[i];
      var cmdState = this.commandState[cmd.name];
      if ( cmdState ) {
        state += ( i << 2 )
            | ( cmdState.pressed ? 0x1 : 0 )
            | ( cmdState.fireAgain ? 0x2 : 0 ) + ":" +
            cmdState.value;
        if ( i < this.commands.length - 1 ) {
          state += "|";
        }
      }
    }
    return state;
  };

  NetworkedInput.prototype.decodeStateSnapshot = function ( snapshot ) {
    var cmd;
    for ( var c = 0; c < this.commands.length; ++c ) {
      cmd = this.commands[c];
      var cmdState = this.commandState[cmd.name];
      cmdState.wasPressed = cmdState.pressed;
    }
    var records = snapshot.split( "|" );
    for ( var i = 0; i < records.length; ++i ) {
      var record = records[i];
      var parts = record.split( ":" );
      var cmdIndex = parseInt( parts[0], 10 );
      var pressed = ( cmdIndex & 0x1 ) !== 0;
      var fireAgain = ( flags & 0x2 ) !== 0;
      cmdIndex >>= 2;
      cmd = this.commands[cmdIndex];
      var flags = parseInt( parts[2], 10 );
      this.commandState[cmd.name] = {
        value: parseFloat( parts[1] ),
        pressed: pressed,
        fireAgain: fireAgain
      };
    }
  };

  NetworkedInput.prototype.setProperty = function ( key, name, value ) {
    for ( var i = 0; i < this.commands.length; ++i ) {
      if ( this.commands[i].name === name ) {
        this.commands[i][key] = value;
        break;
      }
    }
  };

  NetworkedInput.prototype.addToArray = function ( key, name, value ) {
    for ( var i = 0; i < this.commands.length; ++i ) {
      if ( this.commands[i].name === name ) {
        this.commands[i][key].push( value );
        break;
      }
    }
  };

  NetworkedInput.prototype.removeFromArray = function ( key, name, value ) {
    var n = -1;
    for ( var i = 0; i < this.commands.length; ++i ) {
      var cmd = this.commands[i];
      var arr = cmd[key];
      n = arr.indexOf( value );
      if ( cmd.name === name && n > -1 ) {
        arr.splice( n, 1 );
        break;
      }
    }
  };

  NetworkedInput.prototype.invertInArray = function ( key, name, value ) {
    var n = -1;
    for ( var i = 0; i < this.commands.length; ++i ) {
      var cmd = this.commands[i];
      var arr = cmd[key];
      n = arr.indexOf( value );
      if ( cmd.name === name && n > -1 ) {
        arr[n] *= -1;
        break;
      }
    }
  };

  NetworkedInput.prototype.pause = function ( v ) {
    this.paused = v;
  };

  NetworkedInput.prototype.isPaused = function () {
    return this.paused;
  };

  NetworkedInput.prototype.enable = function ( k, v ) {
    if ( v === undefined || v === null ) {
      v = k;
      k = null;
    }

    if ( k ) {
      this.setProperty( "disabled", k, !v );
    }
    else {
      this.enabled = v;
    }
  };

  NetworkedInput.prototype.isEnabled = function ( k ) {
    if ( k ) {
      for ( var i = 0; i < this.commands.length; ++i ) {
        if ( this.commands[i].name === k ) {
          return !this.commands[i].disabled;
        }
      }
      return false;
    }
    else {
      return this.enabled;
    }
  };

  NetworkedInput.prototype.transmit = function ( v ) {
    this.transmitting = v;
  };

  NetworkedInput.prototype.isTransmitting = function () {
    return this.transmitting;
  };

  NetworkedInput.prototype.receive = function ( v ) {
    this.receiving = v;
  };

  NetworkedInput.prototype.isReceiving = function () {
    return this.receiving;
  };
  return NetworkedInput;
} )();
