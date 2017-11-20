/*
pliny.class({
  parent: "Primrose.Input",
    name: "InputProcessor",
    description: "| [under construction]"
});
*/

const SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"];

function initState(){
  this.inputState = {
    buttons: [],
    axes: [],
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  };
  this.lastInputState = {
    buttons: [],
    axes: [],
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  };
}

function filterMetaKey(k) {
  for (let i = 0; i < Keys.MODIFIER_KEYS.length; ++i) {
    const m = Keys.MODIFIER_KEYS[i];
    if (Math.abs(k) === Keys[m.toLocaleUpperCase()]) {
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
    if(elem[0] === "-") {
      sign = -1;
      elem = elem.substring(1);
    }
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

function swap(a, b){
  for(let i = 0; i < this.inputState.buttons.length; ++i){
    this[a].buttons[i] = this[b].buttons[i];
  }
  for(let i = 0; i < this.inputState.axes.length; ++i){
    this[a].axes[i] = this[b].axes[i];
  }
  for (let i = 0; i < Keys.MODIFIER_KEYS.length; ++i) {
    const m = Keys.MODIFIER_KEYS[i];
    this[a][m] = this[b][m];
  }
}

function resetInputState(){
  swap.call(this, "inputState", "lastInputState");
}

function recordLastState(){
  swap.call(this, "lastInputState", "inputState");
}

class CommandState{
  constructor(){
    this.value = null;
    this.pressed = false;
    this.wasPressed = false;
    this.fireAgain = false;
    this.lt = 0;
    this.ct = 0;
    this.repeatCount = 0;
  }
}

import Keys from "../Keys";
import { EventDispatcher } from "three";

export default class InputProcessor extends EventDispatcher {

  constructor(name, commands, axisNames, userActionEvent) {
    super();
    this.name = name;
    this.commands = {};
    this.commandNames = [];
    this.enabled = true;
    this.paused = false;
    this.ready = true;
    this.inPhysicalUse = false;
    initState.call(this);

    const readMetaKeys = (event) => {
      for (let i = 0; i < Keys.MODIFIER_KEYS.length; ++i) {
        const m = Keys.MODIFIER_KEYS[i];
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

    for (let i = 0; i < Keys.MODIFIER_KEYS.length; ++i) {
      this.inputState[Keys.MODIFIER_KEYS[i]] = false;
    }

    this.userActionHandlers = null;
    if(userActionEvent){
      window.addEventListener(userActionEvent, (evt) => {
        if(this.userActionHandlers) {
          for (let i = 0; i < this.userActionHandlers.length; ++i) {
            this.userActionHandlers[i](evt);
          }
        }
      });
    }
  }

  get inPhysicalUse() {
    return this._inPhysicalUse;
  }

  set inPhysicalUse(v) {
    const wasInPhysicalUse = this._inPhysicalUse;
    this._inPhysicalUse = v;
    if(!wasInPhysicalUse && v){
      this.emit("activate");
    }
  }

  addCommand(name, cmd) {
    cmd.name = name;
    cmd = this.cloneCommand(cmd);
    if (typeof cmd.repetitions === "undefined") {
      cmd.repetitions = 1;
    }
    cmd.state = new CommandState();
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
      integrate: !!cmd.integrate,
      delta: !!cmd.delta,
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

      this.inputState.buttons[Keys.ANY] = false;
      for (const n in this.inputState.buttons) {
        if (this.inputState.buttons[n]) {
          this.inputState.buttons[Keys.ANY] = true;
          break;
        }
      }

      let stateMod = recordLastState;
      for (var name in this.commands) {
        var cmd = this.commands[name];
        cmd.state.wasPressed = cmd.state.pressed;
        cmd.state.pressed = false;
        if (!cmd.disabled) {
          let pressed = true,
            value = 0;
          if (cmd.metaKeys) {
            for (let n = 0; n < cmd.metaKeys.length && pressed; ++n) {
              var m = cmd.metaKeys[n];
              pressed = pressed &&
                (this.inputState[Keys.MODIFIER_KEYS[m.index]] &&
                  !m.toggle ||
                  !this.inputState[Keys.MODIFIER_KEYS[m.index]] &&
                  m.toggle);
            }
          }

          if (pressed) {
            if (cmd.buttons.length > 0) {
              for (let n = 0; n < cmd.buttons.length; ++n) {
                var btn = cmd.buttons[n],
                  code = btn.index + 1,
                  p = !!this.inputState.buttons[code];

                const temp = p ? btn.sign : 0;
                pressed = pressed && (p && !btn.toggle || !p && btn.toggle);
                if (Math.abs(temp) > Math.abs(value)) {
                  value = temp;
                }
              }
            }

            if (cmd.buttons.length === 0 || value !== 0) {
              if (cmd.axes.length > 0) {
                value = 0;
                for (let n = 0; n < cmd.axes.length; ++n) {
                  var a = cmd.axes[n];
                  const temp = a.sign * this.inputState.axes[a.index];
                  if (Math.abs(temp) > Math.abs(value)) {
                    value = temp;
                  }
                }
              }
              else if(cmd.commands.length > 0){
                value = 0;
                for (let n = 0; n < cmd.commands.length; ++n) {
                  const temp = this.getValue(cmd.commands[n]);
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
                  value = (value - cmd.state.lv);
                }
                cmd.state.lv = ov;
              }

              if (cmd.min !== undefined && value < cmd.min){
                value = cmd.min;
                stateMod = resetInputState;
              }

              if (cmd.max !== undefined && value > cmd.max) {
                value = cmd.max;
                stateMod = resetInputState;
              }

              if (cmd.threshold) {
                pressed = pressed && (value > cmd.threshold);
              }
            }
          }

          cmd.state.pressed = pressed;
          cmd.state.value = value;
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
      stateMod.call(this);

      this.fireCommands();
    }
  }

  zero() {
    initState.call(this);
    for(const key in this.commands){
      this.commands[key].state = new CommandState();
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

  setOffset(name, value) {
    this.setProperty("offset", name, value);
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
      this.inputState.axes[i] = value;
    }
  }

  setButton(index, pressed) {
    if(this.inPhysicalUse || pressed){
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
