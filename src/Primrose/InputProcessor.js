const SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"];

function filterMetaKey(k) {
  for (let i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
    const m = Primrose.Keys.MODIFIER_KEYS[i];
    if (Math.abs(k) === Primrose.Keys[m.toLocaleUpperCase()]) {
      return Math.sign(k) * (i + 1);
    }
  }
}

function filterValue(elem){
  const t = typeof elem;
  let index = 0,
    toggle = false,
    sign = 1;

  if(t === "number"){
    index = Math.abs(elem) - 1;
    toggle = elem < 0;
    sign = (elem < 0) ? -1 : 1;
  }
  else if(t === "string") {
    index = this.axisNames.indexOf(elem);
  }
  else {
    throw new Error("Cannot clone command spec. Element was type: " + t, elem);
  }

  return {
    index: index,
    toggle: toggle,
    sign: sign
  };
}

pliny.class({
  parent: "Primrose",
    name: "InputProcessor",
    description: "| [under construction]"
});
class InputProcessor {

  constructor(name, commands, axisNames) {
    this.name = name;
    this.commands = {};
    this.commandNames = [];
    this.enabled = true;
    this.paused = false;
    this.ready = true;
    this.inPhysicalUse = false;
    this.inputState = {
      buttons: [],
      axes: [],
      ctrl: false,
      alt: false,
      shift: false,
      meta: false
    };

    const readMetaKeys = (event) => {
      for (let i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
        const m = Primrose.Keys.MODIFIER_KEYS[i];
        this.inputState[m] = event[m + "Key"];
      }
    };

    window.addEventListener("keydown", readMetaKeys, false);
    window.addEventListener("keyup", readMetaKeys, false);
    window.addEventListener("focus", readMetaKeys, false);

    this.axisNames = axisNames || [];

    for (let i = 0; i < this.axisNames.length; ++i) {
      this.inputState.axes[i] = 0;
    }

    for (const cmdName in commands) {
      this.addCommand(cmdName, commands[cmdName]);
    }

    for (let i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
      this.inputState[Primrose.Keys.MODIFIER_KEYS[i]] = false;
    }
  }

  addCommand(name, cmd) {
    cmd.name = name;
    cmd = this.cloneCommand(cmd);
    if (typeof cmd.repetitions === "undefined") {
      cmd.repetitions = 1;
    }
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
  }

  cloneCommand(cmd) {
    return {
      name: cmd.name,
      disabled: !!cmd.disabled,
      dt: cmd.dt || 0,
      deadzone: cmd.deadzone || 0,
      threshold: cmd.threshold || 0,
      repetitions: cmd.repetitions,
      scale: cmd.scale,
      offset: cmd.offset,
      min: cmd.min,
      max: cmd.max,
      integrate: cmd.integrate || false,
      delta: cmd.delta || false,
      axes: this.maybeClone(cmd.axes),
      commands: cmd.commands && cmd.commands.slice() || [],
      buttons: this.maybeClone(cmd.buttons),
      metaKeys: this.maybeClone(cmd.metaKeys && cmd.metaKeys.map(filterMetaKey)),
      commandDown: cmd.commandDown,
      commandUp: cmd.commandUp
    };
  }

  maybeClone(arr) {
    var output = [];
    if (arr) {
      for (var i = 0; i < arr.length; ++i) {
        output[i] = filterValue.call(this, arr[i]);
      }
    }
    return output;
  }

  update(dt) {
    if (this.enabled && this.ready && this.inPhysicalUse && !this.paused && dt > 0) {
      for (var name in this.commands) {
        var cmd = this.commands[name];
        cmd.state.wasPressed = cmd.state.pressed;
        cmd.state.pressed = false;
        if (!cmd.disabled) {
          var metaKeysSet = true,
            n;

          if (cmd.metaKeys) {
            for (n = 0; n < cmd.metaKeys.length && metaKeysSet; ++n) {
              var m = cmd.metaKeys[n];
              metaKeysSet = metaKeysSet &&
                (this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] &&
                  !m.toggle ||
                  !this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] &&
                  m.toggle);
            }
          }

          if (metaKeysSet) {
            var pressed = true,
              value = 0, temp,
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
                  code = btn.index + 1,
                  p = (code === Primrose.Keys.ANY) && anyButtons || !!this.inputState.buttons[code];
                temp = p ? btn.sign : 0;
                pressed = pressed && (p && !btn.toggle || !p && btn.toggle);
                if (Math.abs(temp) > Math.abs(value)) {
                  value = temp;
                }
              }
            }

            if (!cmd.buttons || pressed) {
              value = 0;
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
            }
            else if (cmd.delta) {
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
              pressed = pressed && (value > cmd.threshold);
            }

            cmd.state.pressed = pressed;
            cmd.state.value = value;
          }

          cmd.state.lt += dt;

          cmd.state.fireAgain = cmd.state.pressed &&
            cmd.state.lt >= cmd.dt &&
            (cmd.repetitions === -1 || cmd.state.repeatCount < cmd.repetitions);

          if (cmd.state.fireAgain) {
            cmd.state.lt = 0;
            ++cmd.state.repeatCount;
          }
          else if (!cmd.state.pressed) {
            cmd.state.repeatCount = 0;
          }
        }
      }

      this.fireCommands();
    }
  }

  zero() {
    for (var i = 0; this.enabled && i < SETTINGS_TO_ZERO.length; ++i) {
      this.setValue(SETTINGS_TO_ZERO[i], 0);
    }
  }

  fireCommands() {
    if (this.ready && !this.paused) {
      for (var name in this.commands) {
        var cmd = this.commands[name];
        if (cmd.state.fireAgain && cmd.commandDown) {
          cmd.commandDown(this.name);
        }

        if (!cmd.state.pressed && cmd.state.wasPressed && cmd.commandUp) {
          cmd.commandUp(this.name);
        }
      }
    }
  }

  setProperty(key, name, value) {
    if (this.commands[name]) {
      this.commands[name][key] = value;
    }
  }

  setDeadzone(name, value) {
    this.setProperty("deadzone", name, value);
  }

  setScale(name, value) {
    this.setProperty("scale", name, value);
  }

  setDT(name, value) {
    this.setProperty("dt", name, value);
  }

  setMin(name, value) {
    this.setProperty("min", name, value);
  }

  setMax(name, value) {
    this.setProperty("max", name, value);
  }

  addMetaKey(name, value) {
    this.addToArray("metaKeys", name, filterMetaKey(value));
  }

  addAxis(name, value) {
    this.addToArray("axes", name, value);
  }

  addButton(name, value) {
    this.addToArray("buttons", name, value);
  }

  removeMetaKey(name, value) {
    this.removeFromArray("metaKeys", name, value);
  }

  removeAxis(name, value) {
    this.removeFromArray("axes", name, value);
  }

  removeButton(name, value) {
    this.removeFromArray("buttons", name, value);
  }

  invertAxis(name, value) {
    this.invertInArray("axes", name, value);
  }

  invertButton(name, value) {
    this.invertInArray("buttons", name, value);
  }

  invertMetaKey(name, value) {
    this.invertInArray("metaKeys", name, value);
  }

  addToArray(key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      this.commands[name][key].push(filterValue(value));
    }
  }

  removeFromArray(key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      --value;
      const arr = this.commands[name][key];
      for(let i = 0; i < arr.length; ++i){
        const elem = arr[i];
        if(elem.index === value){
          return arr.splice(i, 1);
        }
      }
    }
  }

  invertInArray(key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      var arr = this.commands[name][key],
        n = arr.indexOf(value);
      for(let i = 0; i < arr.length; ++i){
        const elem = arr[i];
        if(elem.index === value){
          elem.sign *= -1;
          return;
        }
      }
    }
  }

  pause(v) {
    this.paused = v;
  }

  isPaused() {
    return this.paused;
  }

  enable(k, v) {
    if (v === undefined || v === null) {
      v = k;
      k = null;
    }

    if (k) {
      this.setProperty("disabled", k, !v);
    }
    else {
      this.enabled = v;
    }
  }

  isEnabled(name) {
    return name && this.commands[name] && !this.commands[name].disabled;
  }

  getAxis(name) {
    var i = this.axisNames.indexOf(name);
    if (i > -1) {
      var value = this.inputState.axes[i] || 0;
      return value;
    }
    return null;
  }

  setAxis(name, value) {
    var i = this.axisNames.indexOf(name);
    if (i > -1 && (this.inPhysicalUse || value !== 0)) {
      this.inPhysicalUse = true;
      this.inputState.axes[i] = value;
    }
  }

  setButton(index, pressed) {
    if(this.inPhysicalUse || pressed){
      this.inPhysicalUse = true;
      this.inputState.buttons[index] = pressed;
    }
  }

  isDown(name) {
    return this.enabled &&
      this.isEnabled(name) &&
      this.commands[name].state.pressed;
  }

  isUp(name) {
    return this.enabled &&
      this.isEnabled(name) &&
      this.commands[name].state.pressed;
  }

  getValue(name) {
    return this.enabled &&
        this.isEnabled(name) &&
        (this.commands[name].state.value || this.getAxis(name)) ||
        0;
  }

  setValue(name, value) {
    var j = this.axisNames.indexOf(name);
    if (!this.commands[name] && j > -1) {
      this.setAxis(name, value);
    }
    else if (this.commands[name] && !this.commands[name].disabled) {
      this.commands[name].state.value = value;
    }
  }
}