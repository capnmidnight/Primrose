"use strict";

/* global Primrose, THREE, pliny */

Primrose.Input.ButtonAndAxis = function () {

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.ButtonAndAxis](#Primrose_Input_ButtonAndAxis) class in the input/ directory."
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "ButtonAndAxis",
    description: "| [under construction]",
    parameters: [{ name: "name", type: "String", description: "" }, { name: "commands", type: "Array", description: "" }, { name: "socket", type: "WebSocket or WebRTCSocket", description: "" }, { name: "axes", type: "Array", description: "" }]
  });
  function ButtonAndAxisInput(name, commands, socket, axes) {
    Primrose.NetworkedInput.call(this, name, commands, socket);

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.inputState.axes",
      type: "open",
      description: ""
    });
    this.inputState.axes = [];

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.inputState.buttons",
      type: "open",
      description: ""
    });
    this.inputState.buttons = [];

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.axisNames",
      type: "open",
      description: ""
    });
    this.axisNames = axes || [];

    for (var i = 0; i < this.axisNames.length; ++i) {
      this.inputState.axes[i] = 0;
    }

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.setDeadzone",
      type: "open",
      description: ""
    });
    this.setDeadzone = this.setProperty.bind(this, "deadzone");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.setScale",
      type: "open",
      description: ""
    });
    this.setScale = this.setProperty.bind(this, "scale");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.setDT",
      type: "open",
      description: ""
    });
    this.setDT = this.setProperty.bind(this, "dt");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.setMin",
      type: "open",
      description: ""
    });
    this.setMin = this.setProperty.bind(this, "min");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.setMax",
      type: "open",
      description: ""
    });
    this.setMax = this.setProperty.bind(this, "max");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.addMetaKey",
      type: "open",
      description: ""
    });
    this.addMetaKey = this.addToArray.bind(this, "metaKeys");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.addAxis",
      type: "open",
      description: ""
    });
    this.addAxis = this.addToArray.bind(this, "axes");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.addButton",
      type: "open",
      description: ""
    });
    this.addButton = this.addToArray.bind(this, "buttons");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.removeMetaKey",
      type: "open",
      description: ""
    });
    this.removeMetaKey = this.removeFromArray.bind(this, "metaKeys");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.removeAxis",
      type: "open",
      description: ""
    });
    this.removeAxis = this.removeFromArray.bind(this, "axes");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.removeButton",
      type: "open",
      description: ""
    });
    this.removeButton = this.removeFromArray.bind(this, "buttons");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.invertAxis",
      type: "open",
      description: ""
    });
    this.invertAxis = this.invertInArray.bind(this, "axes");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.invertButton",
      type: "open",
      description: ""
    });
    this.invertButton = this.invertInArray.bind(this, "buttons");

    pliny.issue({
      parent: "Primrose.Input.ButtonAndAxis",
      name: "document ButtonAndAxis.invertMetaKey",
      type: "open",
      description: ""
    });
    this.invertMetaKey = this.invertInArray.bind(this, "metaKeys");
  }

  inherit(ButtonAndAxisInput, Primrose.NetworkedInput);

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.inherit",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.inherit = function (classFunc) {
    inherit(classFunc, ButtonAndAxisInput);
    if (classFunc.AXES) {
      classFunc.AXES.forEach(function (name, i) {
        classFunc[name] = i + 1;
        Object.defineProperty(classFunc.prototype, name, {
          get: function get() {
            return this.getAxis(name);
          },
          set: function set(v) {
            this.setAxis(name, v);
          }
        });
      });
    }
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.getAxis",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.getAxis = function (name) {
    var i = this.axisNames.indexOf(name);
    if (i > -1) {
      var value = this.inputState.axes[i] || 0;
      return value;
    }
    return null;
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.setAxis",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.setAxis = function (name, value) {
    var i = this.axisNames.indexOf(name);
    if (i > -1) {
      this.inPhysicalUse = true;
      this.inputState.axes[i] = value;
    }
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.setButton",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.setButton = function (index, pressed) {
    this.inPhysicalUse = true;
    this.inputState.buttons[index] = pressed;
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.getValue",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.getValue = function (name) {
    return (this.enabled || this.receiving && this.socketReady) && this.isEnabled(name) && this.commands[name].state.value || this.getAxis(name) || 0;
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.setValue",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.setValue = function (name, value) {
    var j = this.axisNames.indexOf(name);
    if (!this.commands[name] && j > -1) {
      this.setAxis(name, value);
    } else if (this.commands[name] && !this.commands[name].disabled) {
      this.commands[name].state.value = value;
    }
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.getVector3",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.getVector3 = function (x, y, z, value) {
    value = value || new THREE.Vector3();
    value.set(this.getValue(x), this.getValue(y), this.getValue(z));
    return value;
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.addVector3",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.addVector3 = function (x, y, z, value) {
    value.x += this.getValue(x);
    value.y += this.getValue(y);
    value.z += this.getValue(z);
    return value;
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.isDown",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.isDown = function (name) {
    return (this.enabled || this.receiving && this.socketReady) && this.isEnabled(name) && this.commands[name].state.pressed;
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.isUp",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.isUp = function (name) {
    return (this.enabled || this.receiving && this.socketReady) && this.isEnabled(name) && this.commands[name].state.pressed;
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.maybeClone",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.maybeClone = function (arr) {
    var output = [];
    if (arr) {
      for (var i = 0; i < arr.length; ++i) {
        output[i] = {
          index: Math.abs(arr[i]) - 1,
          toggle: arr[i] < 0,
          sign: arr[i] < 0 ? -1 : 1
        };
      }
    }
    return output;
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.cloneCommand",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.cloneCommand = function (cmd) {
    return {
      name: cmd.name,
      disabled: !!cmd.disabled,
      dt: cmd.dt || 0,
      deadzone: cmd.deadzone || 0,
      threshold: cmd.threshold || 0,
      repetitions: cmd.repetitions || -1,
      scale: cmd.scale,
      offset: cmd.offset,
      min: cmd.min,
      max: cmd.max,
      integrate: cmd.integrate || false,
      delta: cmd.delta || false,
      axes: this.maybeClone(cmd.axes),
      commands: cmd.commands && cmd.commands.slice() || [],
      buttons: this.maybeClone(cmd.buttons),
      metaKeys: this.maybeClone(cmd.metaKeys && cmd.metaKeys.map(function (k) {
        for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
          var m = Primrose.Keys.MODIFIER_KEYS[i];
          if (Math.abs(k) === Primrose.Keys[m.toLocaleUpperCase()]) {
            return Math.sign(k) * (i + 1);
          }
        }
      }.bind(this))),
      commandDown: cmd.commandDown,
      commandUp: cmd.commandUp
    };
  };

  pliny.issue({
    parent: "Primrose.Input.ButtonAndAxis",
    name: "document ButtonAndAxis.evalCommand",
    type: "open",
    description: ""
  });
  ButtonAndAxisInput.prototype.evalCommand = function (cmd, metaKeysSet, dt) {
    if (metaKeysSet) {
      var pressed = true,
          value = 0,
          n,
          temp,
          anyButtons = false;

      for (n in this.inputState.buttons) {
        if (this.inputState.buttons[n]) {
          anyButtons = true;
          break;
        }
      }

      if (cmd.buttons) {
        for (n = 0; n < cmd.buttons.length; ++n) {
          var btn = cmd.buttons[n],
              p = btn.index === Primrose.Keys.ANY - 1 && anyButtons || !!this.inputState.buttons[btn.index + 1];
          temp = p ? btn.sign : 0;
          pressed = pressed && (p && !btn.toggle || !p && btn.toggle);
          if (Math.abs(temp) > Math.abs(value)) {
            value = temp;
          }
        }
      }

      if (cmd.axes) {
        for (n = 0; n < cmd.axes.length; ++n) {
          var a = cmd.axes[n];
          temp = a.sign * this.inputState.axes[a.index];
          if (Math.abs(temp) > Math.abs(value)) {
            value = temp;
          }
        }
      }

      for (n = 0; n < cmd.commands.length; ++n) {
        temp = this.getValue(cmd.commands[n]);
        if (Math.abs(temp) > Math.abs(value)) {
          value = temp;
        }
      }

      if (cmd.scale !== undefined) {
        value *= cmd.scale;
      }

      if (cmd.offset !== undefined) {
        value += cmd.offset;
      }

      if (cmd.deadzone && Math.abs(value) < cmd.deadzone) {
        value = 0;
      }

      if (cmd.integrate) {
        value = this.getValue(cmd.name) + value * dt;
      } else if (cmd.delta) {
        var ov = value;
        if (cmd.state.lv !== undefined) {
          value = (value - cmd.state.lv) / dt;
        }
        cmd.state.lv = ov;
      }

      if (cmd.min !== undefined) {
        value = Math.max(cmd.min, value);
      }

      if (cmd.max !== undefined) {
        value = Math.min(cmd.max, value);
      }

      if (cmd.threshold) {
        pressed = pressed && value > cmd.threshold;
      }

      cmd.state.pressed = pressed;
      cmd.state.value = value;
    }
  };

  return ButtonAndAxisInput;
}();
