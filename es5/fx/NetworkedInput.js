"use strict";

/* global Primrose, pliny */

Primrose.NetworkedInput = function () {

  pliny.class("Primrose", {
    name: "NetworkedInput",
    description: "| [under construction]"
  });
  function NetworkedInput(name, commands, socket) {
    this.name = name;
    this.commands = {};
    this.commandNames = [];
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

    function readMetaKeys(event) {
      for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
        var m = Primrose.Keys.MODIFIER_KEYS[i];
        this.inputState[m] = event[m + "Key"];
      }
    }

    window.addEventListener("keydown", readMetaKeys.bind(this), false);
    window.addEventListener("keyup", readMetaKeys.bind(this), false);

    if (socket) {
      socket.on("open", function () {
        this.socketReady = true;
        this.inPhysicalUse = !this.receiving;
      }.bind(this));
      socket.on(name, function (cmdState) {
        if (this.receiving) {
          this.inPhysicalUse = false;
          this.decodeStateSnapshot(cmdState);
          this.fireCommands();
        }
      }.bind(this));
      socket.on("close", function () {
        this.inPhysicalUse = true;
        this.socketReady = false;
      }.bind(this));
    }

    for (var cmdName in commands) {
      this.addCommand(cmdName, commands[cmdName]);
    }

    for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
      this.inputState[Primrose.Keys.MODIFIER_KEYS[i]] = false;
    }
  }

  NetworkedInput.prototype.addCommand = function (name, cmd) {
    cmd.name = name;
    cmd = this.cloneCommand(cmd);
    cmd.repetitions = cmd.repetitions || 1;
    cmd.state = {
      value: null,
      pressed: false,
      wasPressed: false,
      fireAgain: false,
      lt: 0,
      ct: 0,
      repeatCount: 0
    };
    this.commands[name] = cmd;
    this.commandNames.push(name);
  };

  NetworkedInput.prototype.cloneCommand = function (cmd) {
    throw new Error("cloneCommand function must be defined in subclass");
  };

  NetworkedInput.prototype.update = function (dt) {
    if (this.ready && this.enabled && this.inPhysicalUse && !this.paused) {
      for (var name in this.commands) {
        var cmd = this.commands[name];
        cmd.state.wasPressed = cmd.state.pressed;
        cmd.state.pressed = false;
        if (!cmd.disabled) {
          var metaKeysSet = true;

          if (cmd.metaKeys) {
            for (var n = 0; n < cmd.metaKeys.length && metaKeysSet; ++n) {
              var m = cmd.metaKeys[n];
              metaKeysSet = metaKeysSet && (this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] && !m.toggle || !this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] && m.toggle);
            }
          }

          this.evalCommand(cmd, metaKeysSet, dt);

          cmd.state.lt += dt;
          if (cmd.state.lt >= cmd.dt) {
            cmd.state.repeatCount++;
          }

          cmd.state.fireAgain = cmd.state.pressed && cmd.state.lt >= cmd.dt && cmd.state.repeatCount >= cmd.repetitions;

          if (cmd.state.fireAgain) {
            cmd.state.lt = 0;
            cmd.state.repeatCount = 0;
          }
        }
      }

      if (this.socketReady && this.transmitting) {
        var finalState = this.makeStateSnapshot();
        if (finalState !== this.lastState) {
          this.socket.emit(this.name, finalState);
          this.lastState = finalState;
        }
      }

      this.fireCommands();
    }
  };

  NetworkedInput.prototype.fireCommands = function () {
    if (this.ready && !this.paused) {
      for (var name in this.commands) {
        var cmd = this.commands[name];
        if (cmd.state.fireAgain && cmd.commandDown) {
          cmd.commandDown();
        }

        if (!cmd.state.pressed && cmd.state.wasPressed && cmd.commandUp) {
          cmd.commandUp();
        }
      }
    }
  };

  NetworkedInput.prototype.makeStateSnapshot = function () {
    var state = "",
        i = 0,
        l = Object.keys(this.commands).length;
    for (var name in this.commands) {
      var cmd = this.commands[name];
      if (cmd.state) {
        state += i << 2 | (cmd.state.pressed ? 0x1 : 0) | (cmd.state.fireAgain ? 0x2 : 0) + ":" + cmd.state.value;
        if (i < l - 1) {
          state += "|";
        }
      }
      ++i;
    }
    return state;
  };

  NetworkedInput.prototype.decodeStateSnapshot = function (snapshot) {
    var cmd, name;
    for (name in this.commands) {
      cmd = this.commands[name];
      cmd.state.wasPressed = cmd.state.pressed;
    }
    var records = snapshot.split("|");
    for (var i = 0; i < records.length; ++i) {
      var record = records[i],
          parts = record.split(":"),
          cmdIndex = parseInt(parts[0], 10),
          pressed = (cmdIndex & 0x1) !== 0,
          fireAgain = (flags & 0x2) !== 0,
          flags = parseInt(parts[2], 10);
      cmdIndex >>= 2;
      name = this.commandNames(cmdIndex);
      cmd = this.commands[name];
      cmd.state = {
        value: parseFloat(parts[1]),
        pressed: pressed,
        fireAgain: fireAgain
      };
    }
  };

  NetworkedInput.prototype.setProperty = function (key, name, value) {
    if (this.commands[name]) {
      this.commands[name][key] = value;
    }
  };

  NetworkedInput.prototype.addToArray = function (key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      this.commands[name][key].push(value);
    }
  };

  NetworkedInput.prototype.removeFromArray = function (key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      var arr = this.commands[name][key],
          n = arr.indexOf(value);
      if (n > -1) {
        arr.splice(n, 1);
      }
    }
  };

  NetworkedInput.prototype.invertInArray = function (key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      var arr = this.commands[name][key],
          n = arr.indexOf(value);
      if (n > -1) {
        arr[n] *= -1;
      }
    }
  };

  NetworkedInput.prototype.pause = function (v) {
    this.paused = v;
  };

  NetworkedInput.prototype.isPaused = function () {
    return this.paused;
  };

  NetworkedInput.prototype.enable = function (k, v) {
    if (v === undefined || v === null) {
      v = k;
      k = null;
    }

    if (k) {
      this.setProperty("disabled", k, !v);
    } else {
      this.enabled = v;
    }
  };

  NetworkedInput.prototype.isEnabled = function (name) {
    return name && this.commands[name] && !this.commands[name].disabled;
  };

  NetworkedInput.prototype.transmit = function (v) {
    this.transmitting = v;
  };

  NetworkedInput.prototype.isTransmitting = function () {
    return this.transmitting;
  };

  NetworkedInput.prototype.receive = function (v) {
    this.receiving = v;
  };

  NetworkedInput.prototype.isReceiving = function () {
    return this.receiving;
  };
  return NetworkedInput;
}();

pliny.issue("Primrose.NetworkedInput", {
  name: "document NetworkedInput",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.NetworkedInput](#Primrose_NetworkedInput) class in the  directory"
});
