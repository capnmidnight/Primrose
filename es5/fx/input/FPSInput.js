"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Input.FPSInput = function () {
  "use strict";

  var SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"],
      AXIS_PREFIXES = ["L", "R"];

  var temp = new THREE.Quaternion();

  pliny.class({
    parent: "Primrose.Input",
    name: "FPSInput",
    description: "| [under construction]"
  });

  var FPSInput = function () {
    function FPSInput(DOMElement) {
      var _this = this;

      _classCallCheck(this, FPSInput);

      DOMElement = DOMElement || window;

      this.listeners = {
        zero: [],
        lockpointer: [],
        fullscreen: [],
        pointerstart: [],
        pointerend: [],
        motioncontroller: []
      };

      this.managers = [];

      this.add(new Primrose.Input.Media());

      this.add(new Primrose.Input.VR());

      this.add(new Primrose.Input.Keyboard(DOMElement, {
        lockPointer: {
          buttons: [Primrose.Keys.ANY, -Primrose.Keys.F],
          repetitions: 1,
          commandDown: emit.bind(this, "lockpointer")
        },
        fullScreen: {
          buttons: [Primrose.Keys.F],
          repetitions: 1,
          commandDown: emit.bind(this, "fullscreen")
        },
        strafeLeft: {
          buttons: [-Primrose.Keys.A, -Primrose.Keys.LEFTARROW]
        },
        strafeRight: {
          buttons: [Primrose.Keys.D, Primrose.Keys.RIGHTARROW]
        },
        strafe: { commands: ["strafeLeft", "strafeRight"] },
        boost: { buttons: [Primrose.Keys.E], scale: 0.2 },
        driveForward: {
          buttons: [-Primrose.Keys.W, -Primrose.Keys.UPARROW]
        },
        driveBack: {
          buttons: [Primrose.Keys.S, Primrose.Keys.DOWNARROW]
        },
        drive: { commands: ["driveForward", "driveBack"] },
        select: { buttons: [Primrose.Keys.ENTER] },
        dSelect: { buttons: [Primrose.Keys.ENTER], delta: true },
        zero: {
          buttons: [Primrose.Keys.Z],
          metaKeys: [-Primrose.Keys.CTRL, -Primrose.Keys.ALT, -Primrose.Keys.SHIFT, -Primrose.Keys.META],
          commandUp: emit.bind(this, "zero")
        }
      }));

      this.add(new Primrose.Input.Mouse(DOMElement, {
        lockPointer: { buttons: [Primrose.Keys.ANY], commandDown: emit.bind(this, "lockpointer") },
        pointer: {
          buttons: [Primrose.Keys.ANY],
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        buttons: { axes: [Primrose.Input.Mouse.BUTTONS] },
        dButtons: { axes: [Primrose.Input.Mouse.BUTTONS], delta: true },
        pointerX: { axes: [Primrose.Input.Mouse.X] },
        pointerY: { axes: [Primrose.Input.Mouse.Y] },
        dx: { axes: [-Primrose.Input.Mouse.X], delta: true, scale: 0.005, min: -5, max: 5 },
        heading: { commands: ["dx"], integrate: true },
        dy: { axes: [-Primrose.Input.Mouse.Y], delta: true, scale: 0.005, min: -5, max: 5 },
        pitch: { commands: ["dy"], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5 },
        pointerPitch: { commands: ["dy"], integrate: true, min: -Math.PI * 0.25, max: Math.PI * 0.25 }
      }));

      this.add(new Primrose.Input.Touch(DOMElement, {
        lockPointer: { buttons: [Primrose.Keys.ANY], commandUp: emit.bind(this, "lockpointer") },
        pointer: {
          buttons: [Primrose.Keys.ANY],
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        buttons: { axes: [Primrose.Input.Touch.FINGERS] },
        dButtons: { axes: [Primrose.Input.Touch.FINGERS], delta: true },
        pointerX: { axes: [Primrose.Input.Touch.X0] },
        pointerY: { axes: [Primrose.Input.Touch.Y0] },
        dx: { axes: [-Primrose.Input.Touch.X0], delta: true, scale: 0.005, min: -5, max: 5 },
        heading: { commands: ["dx"], integrate: true },
        dy: { axes: [-Primrose.Input.Touch.Y0], delta: true, scale: 0.005, min: -5, max: 5 },
        pitch: { commands: ["dy"], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5 }
      }));

      Primrose.Input.Gamepad.addEventListener("gamepadconnected", function (pad) {
        var pose = pad.pose,
            isMotion = pad.id === "OpenVR Gamepad",
            padCommands = null,
            controllerNumber = 0;

        if (isMotion) {
          padCommands = {
            pointer: {
              buttons: [Primrose.Input.Gamepad.VIVE_BUTTONS.TRIGGER_PRESSED],
              commandDown: emit.bind(_this, "pointerstart"),
              commandUp: emit.bind(_this, "pointerend")
            }
          };

          for (var i = 0; i < _this.managers.length; ++i) {
            var mgr = _this.managers[i];
            if (mgr.currentPad && mgr.currentPad.id === pad.id) {
              ++controllerNumber;
            }
          }
        } else {
          padCommands = {
            pointer: {
              buttons: [Primrose.Input.Gamepad.XBOX_BUTTONS.A],
              commandDown: emit.bind(_this, "pointerstart"),
              commandUp: emit.bind(_this, "pointerend")
            },
            strafe: { axes: [Primrose.Input.Gamepad.LSX], deadzone: 0.2 },
            drive: { axes: [Primrose.Input.Gamepad.LSY], deadzone: 0.2 },
            heading: { axes: [-Primrose.Input.Gamepad.RSX], deadzone: 0.2, integrate: true },
            dheading: { commands: ["heading"], delta: true },
            pitch: { axes: [-Primrose.Input.Gamepad.RSY], deadzone: 0.2, integrate: true }
          };
        }
        var mgr = new Primrose.Input.Gamepad(pad, controllerNumber, padCommands);
        _this.add(mgr);

        if (isMotion) {
          emit.call(_this, "motioncontroller", mgr);
        }
      });

      Primrose.Input.Gamepad.addEventListener("gamepaddisconnected", this.remove.bind(this));

      this.ready = Promise.all(this.managers.map(function (mgr) {
        return mgr.ready;
      }).filter(identity));
    }

    _createClass(FPSInput, [{
      key: "remove",
      value: function remove(id) {
        var mgr = this[id],
            mgrIdx = this.managers.indexOf(mgr);
        if (mgrIdx > -1) {
          this.managers.splice(mgrIdx, 1);
          delete this[id];
        }
        console.log("removed", mgr);
      }
    }, {
      key: "add",
      value: function add(mgr) {
        for (var i = this.managers.length - 1; i >= 0; --i) {
          if (this.managers[i].name === mgr.name) {
            this.managers.splice(i, 1);
          }
        }
        this.managers.push(mgr);
        this[mgr.name] = mgr;
      }
    }, {
      key: "zero",
      value: function zero() {
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
      }
    }, {
      key: "update",
      value: function update() {
        Primrose.Input.Gamepad.poll();
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled) {
            if (mgr.poll) {
              mgr.poll();
            }
            mgr.update();
          }
        }
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(evt, thunk, bubbles) {
        if (this.listeners[evt]) {
          this.listeners[evt].push(thunk);
        } else {
          this.managers.forEach(function (mgr) {
            if (mgr.addEventListener) {
              mgr.addEventListener(evt, thunk, bubbles);
            }
          });
        }
      }
    }, {
      key: "getValue",
      value: function getValue(name) {
        var value = 0;
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled) {
            value += mgr.getValue(name);
          }
        }
        return value;
      }
    }, {
      key: "getLatestValue",
      value: function getLatestValue(name) {
        var value = 0,
            maxT = Number.MIN_VALUE;
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled && mgr.lastT > maxT) {
            maxT = mgr.lastT;
            value = mgr.getValue(name);
          }
        }
        return value;
      }
    }]);

    return FPSInput;
  }();

  return FPSInput;
}();