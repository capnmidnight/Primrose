"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Gamepad = function () {
  "use strict";

  navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;

  var listeners = {
    gamepadconnected: [],
    gamepaddisconnected: []
  },
      currentPadIDs = [],
      currentPads = [],
      currentManagers = {};

  pliny.class({
    parent: "Primrose.Input",
    name: "Gamepad",
    baseClass: "Primrose.InputProcessor",
    parameters: [{ name: "name", type: "string", description: "An unique name for this input manager. Note that systems with motion controllers will often have two controllers with the same ID, but different indexes. The name should take that into account." }, { name: "commands", type: "Array", optional: true, description: "An array of input command descriptions." }, { name: "socket", type: "WebSocket", optional: true, description: "A socket over which to transmit device state for device fusion." }],
    description: "An input processor for Gamepads, including those with positional data."
  });

  var Gamepad = function (_Primrose$InputProces) {
    _inherits(Gamepad, _Primrose$InputProces);

    _createClass(Gamepad, null, [{
      key: "ID",
      value: function ID(pad) {
        return (pad.id + "_" + (pad.index || 0)).replace(/\s+/g, "_");
      }
    }, {
      key: "poll",
      value: function poll() {
        var maybePads = navigator.getGamepads(),
            pads = [],
            padIDs = [],
            newPads = [],
            oldPads = [],
            i;

        if (maybePads) {
          for (i = 0; i < maybePads.length; ++i) {
            var maybePad = maybePads[i];
            if (maybePad) {
              var padID = Gamepad.ID(maybePad),
                  padIdx = currentPadIDs.indexOf(padID);
              pads.push(maybePad);
              padIDs.push(padID);
              if (padIdx === -1) {
                newPads.push(maybePad);
                currentPadIDs.push(padID);
                currentPads.push(maybePad);
                delete currentManagers[padID];
              } else {
                currentPads[padIdx] = maybePad;
              }
            }
          }
        }

        for (i = currentPadIDs.length - 1; i >= 0; --i) {
          var padID = currentPadIDs[i],
              mgr = currentManagers[padID],
              pad = currentPads[i];
          if (padIDs.indexOf(padID) === -1) {
            oldPads.push(padID);
            currentPads.splice(i, 1);
            currentPadIDs.splice(i, 1);
          } else if (mgr) {
            mgr.checkDevice(pad);
          }
        }

        newPads.forEach(emit.bind(Gamepad, "gamepadconnected"));
        oldPads.forEach(emit.bind(Gamepad, "gamepaddisconnected"));
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(evt, thunk) {
        if (listeners[evt]) {
          listeners[evt].push(thunk);
        }
      }
    }, {
      key: "pads",
      get: function get() {
        return currentPads;
      }
    }, {
      key: "listeners",
      get: function get() {
        return listeners;
      }
    }]);

    function Gamepad(pad, axisOffset, commands, socket) {
      _classCallCheck(this, Gamepad);

      var padID = Gamepad.ID(pad);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Gamepad).call(this, padID, commands, socket, Gamepad.AXES));

      currentManagers[padID] = _this;

      _this.currentPose = {
        position: [0, 0, 0],
        orientation: [0, 0, 0, 1]
      };

      _this.currentPad = pad;
      _this.axisOffset = axisOffset;
      return _this;
    }

    _createClass(Gamepad, [{
      key: "checkDevice",
      value: function checkDevice(pad) {
        var i;
        this.currentPad = pad;
        for (i = 0; i < pad.buttons.length; ++i) {
          this.setButton(i, pad.buttons[i].pressed);
          this.setButton(i + pad.buttons.length, pad.buttons[i].touched);
        }
        for (i = 0; i < pad.axes.length; ++i) {
          var axisName = this.axisNames[this.axisOffset * pad.axes.length + i];
          this.setAxis(axisName, pad.axes[i]);
        }

        this.currentPose = pad.pose;
      }
    }, {
      key: "vibrate",
      value: function vibrate() {
        if (this.currentPad && this.currentPad.vibrate) {
          this.currentPad.vibrate.apply(this.currentPad, arguments);
        }
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(value) {
        value = value || new THREE.Quaternion();
        var o = this.currentPose && this.currentPose.orientation;
        if (o) {
          value.fromArray(o);
        }
        return value;
      }
    }, {
      key: "getPosition",
      value: function getPosition(value) {
        value = value || new THREE.Vector3();
        var p = this.currentPose && this.currentPose.position;
        if (p) {
          value.fromArray(p);
        }
        return value;
      }
    }]);

    return Gamepad;
  }(Primrose.InputProcessor);

  Primrose.InputProcessor.defineAxisProperties(Gamepad, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z"]);

  pliny.enumeration({
    parent: "Primrose.Input.Gamepad",
    name: "XBOX_BUTTONS",
    description: "Labeled names for each of the different control features of the Xbox 360 controller."
  });
  Gamepad.XBOX_BUTTONS = {
    A: 1,
    B: 2,
    X: 3,
    Y: 4,
    leftBumper: 5,
    rightBumper: 6,
    leftTrigger: 7,
    rightTrigger: 8,
    back: 9,
    start: 10,
    leftStick: 11,
    rightStick: 12,
    up: 13,
    down: 14,
    left: 15,
    right: 16
  };

  pliny.enumeration({
    parent: "Primrose.Input.Gamepad",
    name: "VIVE_BUTTONS",
    description: "Labeled names for each of the different control buttons of the HTC Vive Motion Controllers."
  });
  Gamepad.VIVE_BUTTONS = {
    TOUCHPAD_PRESSED: 0,
    TRIGGER_PRESSED: 1,
    GRIP_PRESSED: 2,
    MENU_PRESSED: 3,

    TOUCHPAD_TOUCHED: 4,
    //TRIGGER_TOUCHED: 5, // doesn't ever actually trigger in the current version of Chromium - STM 6/22/2016
    GRIP_TOUCHED: 6,
    MENU_TOUCHED: 7
  };

  return Gamepad;
}();