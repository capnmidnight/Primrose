/* global Primrose, THREE, emit, isMobile, pliny */

Primrose.Input.FPSInput = (function () {
  pliny.issue({
    parent: "Primrose.Input.FPSInput",
    name: "document FPSInput",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.FPSInput](#Primrose_Input_FPSInput) class in the input/ directory"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "FPSInput",
    description: "| [under construction]"
  });
  function FPSInput(DOMElement) {
    DOMElement = DOMElement || window;


    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.listeners",
      type: "open",
      description: ""
    });
    this.listeners = {
      zero: [],
      lockpointer: [],
      fullscreen: [],
      pointerstart: [],
      pointerend: []
    };

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.managers",
      type: "open",
      description: ""
    });
    this.managers = [
      // keyboard should always run on the window
      new Primrose.Input.Keyboard("keyboard", window, {
        lockPointer: { buttons: [Primrose.Keys.ANY], commandUp: emit.bind(this, "lockpointer") },
        pointer1: {
          buttons: [Primrose.Keys.SPACE],
          repetitions: 1,
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        pointer2: {
          buttons: [Primrose.Keys.ENTER],
          repetitions: 1,
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        fullScreen: {
          buttons: [Primrose.Keys.F],
          commandDown: emit.bind(this, "fullscreen")
        },
        strafeLeft: {
          buttons: [
            -Primrose.Keys.A,
            -Primrose.Keys.LEFTARROW]
        },
        strafeRight: {
          buttons: [
            Primrose.Keys.D,
            Primrose.Keys.RIGHTARROW]
        },
        strafe: { commands: ["strafeLeft", "strafeRight"] },
        driveForward: {
          buttons: [
            -Primrose.Keys.W,
            -Primrose.Keys.UPARROW]
        },
        driveBack: {
          buttons: [
            Primrose.Keys.S,
            Primrose.Keys.DOWNARROW]
        },
        drive: { commands: ["driveForward", "driveBack"] },
        select: { buttons: [Primrose.Keys.ENTER] },
        dSelect: { buttons: [Primrose.Keys.ENTER], delta: true },
        zero: {
          buttons: [Primrose.Keys.Z],
          metaKeys: [
            -Primrose.Keys.CTRL,
            -Primrose.Keys.ALT,
            -Primrose.Keys.SHIFT,
            -Primrose.Keys.META
          ],
          commandUp: emit.bind(this, "zero")
        }
      }),
      new Primrose.Input.Mouse("mouse", DOMElement, {
        lockPointer: { buttons: [Primrose.Keys.ANY], commandDown: emit.bind(this, "lockpointer") },
        pointer: {
          buttons: [Primrose.Keys.ANY],
          repetitions: 1,
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        buttons: { axes: [Primrose.Input.Mouse.BUTTONS] },
        dButtons: { axes: [Primrose.Input.Mouse.BUTTONS], delta: true },
        dx: { axes: [-Primrose.Input.Mouse.X], delta: true, scale: 0.005, min: -5, max: 5 },
        heading: { commands: ["dx"], integrate: true },
        dy: { axes: [-Primrose.Input.Mouse.Y], delta: true, scale: 0.005, min: -5, max: 5 },
        pitch: { commands: ["dy"], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5 },
        pointerPitch: { commands: ["dy"], integrate: true, min: -Math.PI * 0.25, max: Math.PI * 0.25 }
      }),
      new Primrose.Input.Touch("touch", DOMElement, {
        lockPointer: { buttons: [Primrose.Keys.ANY], commandUp: emit.bind(this, "lockpointer") },
        pointer: {
          buttons: [Primrose.Keys.ANY],
          repetitions: 1,
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        buttons: { axes: [Primrose.Input.Touch.FINGERS] },
        dButtons: { axes: [Primrose.Input.Touch.FINGERS], delta: true }
      }),
      new Primrose.Input.Gamepad("gamepad", {
        pointer: {
          buttons: [Primrose.Input.Gamepad.XBOX_BUTTONS.A],
          repetitions: 1,
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        strafe: { axes: [Primrose.Input.Gamepad.LSX] },
        drive: { axes: [Primrose.Input.Gamepad.LSY] },
        heading: { axes: [-Primrose.Input.Gamepad.RSX], integrate: true },
        dheading: { commands: ["heading"], delta: true },
        pitch: { axes: [Primrose.Input.Gamepad.RSY], integrate: true }
      })];

    if (Primrose.Input.VR.Version > 0) {
      var vr = new Primrose.Input.VR("vr");
      this.managers.push(vr);
      vr.init();
    }

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.keyboard",
      type: "open",
      description: ""
    });

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.mouse",
      type: "open",
      description: ""
    });

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.touch",
      type: "open",
      description: ""
    });

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.gamepad",
      type: "open",
      description: ""
    });

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.vr",
      type: "open",
      description: ""
    });

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.motion",
      type: "open",
      description: ""
    });

    this.managers.forEach((mgr) => this[mgr.name] = mgr);
  }

  var SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"];

  pliny.issue({
    parent: "Primrose.Input.FPSInput",
    name: "document FPSInput.zero",
    type: "open",
    description: ""
  });
  FPSInput.prototype.zero = function () {
    if (this.vr && this.vr.currentDisplay) {
      this.vr.currentDisplay.resetPose();
    }
    if (this.motion) {
      this.motion.zeroAxes();
    }
    for (var i = 0; i < this.managers.length; ++i) {
      var mgr = this.managers[i];
      for (var j = 0; mgr.enabled && j < SETTINGS_TO_ZERO.length; ++j) {
        mgr.setValue(SETTINGS_TO_ZERO[j], 0);
      }
    }
  };

  pliny.issue({
    parent: "Primrose.Input.FPSInput",
    name: "document FPSInput.update",
    type: "open",
    description: ""
  });
  FPSInput.prototype.update = function () {
    for (var i = 0; i < this.managers.length; ++i) {
      var mgr = this.managers[i];
      if (mgr.enabled) {
        if (mgr.poll) {
          mgr.poll();
        }
        mgr.update();
      }
    }
  };

  pliny.issue({
    parent: "Primrose.Input.FPSInput",
    name: "document FPSInput.addEventListener",
    type: "open",
    description: ""
  });
  FPSInput.prototype.addEventListener = function (evt, thunk, bubbles) {
    if (this.listeners[evt]) {
      this.listeners[evt].push(thunk);
    }
    else {
      this.managers.forEach(function (mgr) {
        if (mgr.addEventListener) {
          mgr.addEventListener(evt, thunk, bubbles);
        }
      });
    }
  };

  pliny.issue({
    parent: "Primrose.Input.FPSInput",
    name: "document FPSInput.getValue",
    type: "open",
    description: ""
  });
  FPSInput.prototype.getValue = function (name) {
    var value = 0;
    for (var i = 0; i < this.managers.length; ++i) {
      var mgr = this.managers[i];
      if (mgr.enabled) {
        value += mgr.getValue(name);
      }
    }
    return value;
  };

  if (window.THREE) {
    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.getVector3",
      type: "open",
      description: ""
    });
    FPSInput.prototype.getVector3 = function (x, y, z, value) {
      value = value || new THREE.Vector3();
      value.set(0, 0, 0);
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        if (mgr.enabled) {
          mgr.addVector3(x, y, z, value);
        }
      }
      return value;
    };

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.getVector3s",
      type: "open",
      description: ""
    });
    FPSInput.prototype.getVector3s = function (x, y, z, values) {
      values = values || [];
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        if (mgr.enabled) {
          values[i] = mgr.getVector3(x, y, z, values[i]);
        }
      }
      return values;
    };

    var temp = new THREE.Quaternion();
    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.getQuaternion",
      type: "open",
      description: ""
    });
    FPSInput.prototype.getQuaternion = function (x, y, z, w, value, accumulate) {
      value = value || new THREE.Quaternion();
      value.set(0, 0, 0, 1);
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        if (mgr.enabled && mgr.getQuaternion) {
          mgr.getQuaternion(x, y, z, w, temp);
          value.multiply(temp);
          if (!accumulate) {
            break;
          }
        }
      }
      return value;
    };

    pliny.issue({
      parent: "Primrose.Input.FPSInput",
      name: "document FPSInput.transforms",
      type: "open",
      description: ""
    });
    Object.defineProperty(FPSInput.prototype, "transforms", {
      get: function () {
        if (this.vr && this.vr.transforms) {
          return this.vr.transforms;
        }
        else {
          return Primrose.Input.Motion.DEFAULT_TRANSFORMS;
        }
      }
    });

    return FPSInput;
  }
})();