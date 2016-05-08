"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Gamepad = function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Gamepad",
    description: "| [under construction]",
    baseClass: "Primrose.InputProcessor",
    parameters: [{ name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }]
  });

  var Gamepad = function (_Primrose$InputProces) {
    _inherits(Gamepad, _Primrose$InputProces);

    function Gamepad(commands, socket, gpid) {
      _classCallCheck(this, Gamepad);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Gamepad).call(this, "Gamepad", commands, socket));

      var connectedGamepads = [],
          listeners = {
        gamepadconnected: [],
        gamepaddisconnected: []
      };

      _this.checkDevice = function (pad) {
        var i;
        for (i = 0; i < pad.buttons.length; ++i) {
          this.setButton(i, pad.buttons[i].pressed);
        }
        for (i = 0; i < pad.axes.length; ++i) {
          this.setAxis(Gamepad.AXES[i], pad.axes[i]);
        }
      };

      _this.poll = function () {
        var pads,
            currentPads = [],
            i;

        if (navigator.getGamepads) {
          pads = navigator.getGamepads();
        } else if (navigator.webkitGetGamepads) {
          pads = navigator.webkitGetGamepads();
        }

        if (pads) {
          for (i = 0; i < pads.length; ++i) {
            var pad = pads[i];
            if (pad) {
              if (!gpid) {
                gpid = pad.id;
              }
              if (connectedGamepads.indexOf(pad.id) === -1) {
                connectedGamepads.push(pad.id);
                onConnected(pad.id);
              }
              if (pad.id === gpid) {
                this.checkDevice(pad);
              }
              currentPads.push(pad.id);
            }
          }
        }

        for (i = connectedGamepads.length - 1; i >= 0; --i) {
          if (currentPads.indexOf(connectedGamepads[i]) === -1) {
            onDisconnected(connectedGamepads[i]);
            connectedGamepads.splice(i, 1);
          }
        }
      };

      function add(arr, val) {
        if (arr.indexOf(val) === -1) {
          arr.push(val);
        }
      }

      function remove(arr, val) {
        var index = arr.indexOf(val);
        if (index > -1) {
          arr.splice(index, 1);
        }
      }

      function sendAll(arr, id) {
        for (var i = 0; i < arr.length; ++i) {
          arr[i](id);
        }
      }

      function onConnected(id) {
        sendAll(listeners.gamepadconnected, id);
      }

      function onDisconnected(id) {
        sendAll(listeners.gamepaddisconnected, id);
      }

      _this.getErrorMessage = function () {
        return errorMessage;
      };

      _this.setGamepad = function (id) {
        gpid = id;
        this.inPhysicalUse = true;
      };

      _this.clearGamepad = function () {
        gpid = null;
        this.inPhysicalUse = false;
      };

      _this.isGamepadSet = function () {
        return !!gpid;
      };

      _this.getConnectedGamepads = function () {
        return connectedGamepads.slice();
      };

      _this.addEventListener = function (event, handler, bubbles) {
        if (listeners[event]) {
          listeners[event].push(handler);
        }
        if (event === "gamepadconnected") {
          connectedGamepads.forEach(onConnected);
        }
      };

      _this.removeEventListener = function (event, handler, bubbles) {
        if (listeners[event]) {
          remove(listeners[event], handler);
        }
      };

      try {
        _this.update();
        _this.available = true;
      } catch (exp) {
        console.error(exp);
        _this.avaliable = false;
        _this.errorMessage = exp;
      }
      return _this;
    }

    return Gamepad;
  }(Primrose.InputProcessor);

  Primrose.InputProcessor.defineAxisProperties(Gamepad, ["LSX", "LSY", "RSX", "RSY"]);
  return Gamepad;
}();

pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "XBOX_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller."
});
Primrose.Input.Gamepad.XBOX_BUTTONS = {
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