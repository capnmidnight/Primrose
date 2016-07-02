Primrose.InputProcessor = (function () {
  "use strict";

  const SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"],
    TELEPORT_RADIUS = 0.4,
    FORWARD = new THREE.Vector3(0, 0, -1),
    MAX_SELECT_DISTANCE = 2,
    MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
    MAX_MOVE_DISTANCE = 5,
    MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
    LASER_LENGTH = 1,
    moveTo = new THREE.Vector3(0, 0, 0);

  pliny.class({
    parent: "Primrose",
      name: "InputProcessor",
      description: "| [under construction]"
  });
  class InputProcessor {

    static defineAxisProperties(classFunc, values) {
      classFunc.AXES = values;
      values.forEach(function (name, i) {
        classFunc[name] = i + 1;
        Object.defineProperty(classFunc.prototype, name, {
          get: function () {
            return this.getAxis(name);
          },
          set: function (v) {
            this.setAxis(name, v);
          }
        });
      });
    }

    constructor(name, parent, commands, socket, axisNames) {
      this.name = name;
      this.parent = parent;
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
      this.inputState = {
        buttons: [],
        axes: [],
        ctrl: false,
        alt: false,
        shift: false,
        meta: false
      };
      this.lastState = "";

      this.position = null;
      this.velocity = null;
      this.euler = null;
      this.mesh = null;
      this.disk = null;
      this.stageGrid = null;
      this._stage = null;
      this.inVR = false;
      this.lastT = performance.now();
      this._showPointer = false;

      var readMetaKeys = (event) => {
        for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
          var m = Primrose.Keys.MODIFIER_KEYS[i];
          this.inputState[m] = event[m + "Key"];
        }

        this.update();
      };

      window.addEventListener("keydown", readMetaKeys, false);
      window.addEventListener("keyup", readMetaKeys, false);

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

      this.axisNames = axisNames || Primrose.Input[name] && Primrose.Input[name].AXES || [];

      for (var i = 0; i < this.axisNames.length; ++i) {
        this.inputState.axes[i] = 0;
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
    }

    maybeClone(arr) {
      var output = [];
      if (arr) {
        for (var i = 0; i < arr.length; ++i) {
          output[i] = {
            index: Math.abs(arr[i]) - 1,
            toggle: arr[i] < 0,
            sign: (arr[i] < 0) ? -1 : 1
          };
        }
      }
      return output;
    }

    poll() {
      // Intentionally empty. Override in child classes.
    }

    update() {
      var t = performance.now(),
        dt = (t - this.lastT) / 1000;
      this.lastT = t;
      this.poll();
      if (this.ready && this.enabled && this.inPhysicalUse && !this.paused && dt > 0) {
        for (var name in this.commands) {
          var cmd = this.commands[name];
          cmd.state.wasPressed = cmd.state.pressed;
          cmd.state.pressed = false;
          if (!cmd.disabled) {
            var metaKeysSet = true;

            if (cmd.metaKeys) {
              for (var n = 0; n < cmd.metaKeys.length && metaKeysSet; ++n) {
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
                value = 0,
                n, temp,
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

        if (this.socketReady && this.transmitting) {
          var finalState = this.makeStateSnapshot();
          if (finalState !== this.lastState) {
            this.socket.emit(this.name, finalState);
            this.lastState = finalState;
          }
        }

        this.fireCommands();
      }

      if (this.mesh) {
        return this.updatePointer(dt);
      }
    }

    get showPointer(){
      return this._showPointer;
    }

    set showPointer(v){
      this._showPointer = v;
    }

    makePointer(scene) {
      this.showPointer = true;
      this.position = new THREE.Vector3();
      this.velocity = new THREE.Vector3();
      this.euler = new THREE.Euler();
      this.mesh = textured(box(0.01, 0.01, LASER_LENGTH), 0xff0000, {
        emissive: 0x3f0000
      });
      this.mesh.geometry.vertices.forEach((v) => {
        v.z -= LASER_LENGTH * 0.5;
      });

      this.disk = textured(sphere(TELEPORT_RADIUS, 128, 3), 0x00ff00, {
        emissive: 0x003f00
      });
      this.disk.geometry.computeBoundingBox();
      this.disk.geometry.vertices.forEach((v)=> v.y -= this.disk.geometry.boundingBox.min.y);
      this.disk.geometry.computeBoundingBox();

      this.disk.scale.set(1, 0.1, 1);

      this.groundMesh = this.disk;

      this.stageGrid = textured(box(), 0x00ff00, {
        wireframe: true,
        emissive: 0x003f00
      });

      scene.add(this.mesh);
      scene.add(this.disk);
      scene.add(this.stageGrid);
    }

    updatePointer(dt){
      this.updateOrientation(true);
      this.updateVelocity();

      moveTo
        .copy(this.velocity)
        .multiplyScalar(dt)
        .applyQuaternion(this.quaternion);

      this.updateOrientation(false);
      this.updatePosition();

      this.position.add(moveTo);
      this.mesh.position.copy(this.position);
      this.mesh.updateMatrix();

      if(this.stage){
        this.mesh.applyMatrix(this.stage.matrix);
      }
    }

    get segment(){
      if(this.showPointer){
        FORWARD.set(0, 0, -1)
          .applyMatrix4(this.mesh.matrixWorld);
        return [this.name, this.mesh.position.toArray(), FORWARD.toArray()];
      }
    }

    registerHit(currentHit, isGround) {
      if(this.showPointer){
        var fp = currentHit.facePoint;

        moveTo.fromArray(fp)
          .sub(this.position);

        this.groundMesh.visible = isGround;
        if (isGround) {
          var distSq = moveTo.x * moveTo.x + moveTo.z * moveTo.z;
          if (distSq > MAX_MOVE_DISTANCE_SQ) {
            var dist = Math.sqrt(distSq),
              factor = MAX_MOVE_DISTANCE / dist,
              y = moveTo.y;
            moveTo.y = 0;
            moveTo.multiplyScalar(factor);
            moveTo.y = y;
            textured(this.mesh, 0xffff00, {
              emissive: 0x7f7f00
            });
          }
          this.groundMesh.position
            .copy(this.position)
            .add(moveTo);
        }
        else if (moveTo.lengthSq() <= MAX_SELECT_DISTANCE_SQ) {
          textured(this.mesh, 0x00ff00, {
            emissive: 0x007f00
          });
        }
      }
    }

    reset() {
      if(this.mesh){
        this.groundMesh.visible = false;
        this.mesh.visible = this.showPointer;
        textured(this.mesh, 0xff0000, {
          emissive: 0x7f0000
        });
      }
    }

    updateOrientation() {
      throw new Error(this.name + " updateOrientation not implemented");
    }

    updateVelocity() {
      throw new Error(this.name + " updateVelocity not implemented");
    }

    updatePosition() {
      throw new Error(this.name + " updatePosition not implemented");
    }

    zero(){
      for (var i = 0; this.enabled && i < SETTINGS_TO_ZERO.length; ++i) {
        this.setValue(SETTINGS_TO_ZERO[i], 0);
      }
      if(this.showPointer){
        this.position.set(0, 0, 0);
        this.velocity.set(0, 0, 0);
        this.quaternion.set(0, 0, 0, 1);
        this.isOnGround = false;
      }
    }

    add(obj){
      this.mesh.add(obj);
    }

    get matrixWorld() {
      return this.mesh.matrixWorld;
    }

    get quaternion() {
      return this.mesh.quaternion;
    }

    get stage() {
      return this._stage;
    }

    set stage(s) {
      if (!this._stage || s.sizeX !== this.stage.sizeX || s.sizeZ !== this.stage.sizeZ) {
        this._stage = s;
        if (this.stage.sizeX * this.stage.sizeZ === 0) {
          this.groundMesh = this.disk;
          this.stageGrid.visible = false;
          this.disk.visible = this.showPointer;
        }
        else {
          var scene = this.stageGrid.parent;
          scene.remove(this.stageGrid);
          this.stageGrid = textured(box(this.stage.sizeX, 2.5, this.stage.sizeZ), 0x00ff00, {
            wireframe: true,
            emissive: 0x003f00
          });
          this.stageGrid.geometry.computeBoundingBox();
          scene.add(this.stageGrid);
          this.groundMesh = this.stageGrid;
          this.stageGrid.visible = this.showPointer;
          this.disk.visible = false;
        }
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

    makeStateSnapshot() {
      var state = "",
        i = 0,
        l = Object.keys(this.commands)
        .length;
      for (var name in this.commands) {
        var cmd = this.commands[name];
        if (cmd.state) {
          state += (i << 2) |
            (cmd.state.pressed ? 0x1 : 0) |
            (cmd.state.fireAgain ? 0x2 : 0) + ":" +
            cmd.state.value;
          if (i < l - 1) {
            state += "|";
          }
        }
        ++i;
      }
      return state;
    }

    decodeStateSnapshot(snapshot) {
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

    addToArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        this.commands[name][key].push(value);
      }
    }

    addMetaKey(name, value) {
      this.addToArray("metaKeys", name, value);
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

    removeFromArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        var arr = this.commands[name][key],
          n = arr.indexOf(value);
        if (n > -1) {
          arr.splice(n, 1);
        }
      }
    }

    invertInArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        var arr = this.commands[name][key],
          n = arr.indexOf(value);
        if (n > -1) {
          arr[n] *= -1;
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

    transmit(v) {
      this.transmitting = v;
    }

    isTransmitting() {
      return this.transmitting;
    }

    receive(v) {
      this.receiving = v;
    }

    isReceiving() {
      return this.receiving;
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
      if (i > -1) {
        this.inPhysicalUse = true;
        this.inputState.axes[i] = value;
      }
    }

    setButton(index, pressed) {
      this.inPhysicalUse = true;
      this.inputState.buttons[index] = pressed;
    }

    getValue(name) {
      return ((this.enabled || (this.receiving && this.socketReady)) &&
          this.isEnabled(name) &&
          this.commands[name].state.value) ||
        this.getAxis(name) || 0;
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

    isDown(name) {
      return (this.enabled || (this.receiving && this.socketReady)) &&
        this.isEnabled(name) &&
        this.commands[name].state.pressed;
    }

    isUp(name) {
      return (this.enabled || (this.receiving && this.socketReady)) &&
        this.isEnabled(name) &&
        this.commands[name].state.pressed;
    }
  }
  return InputProcessor;
})();