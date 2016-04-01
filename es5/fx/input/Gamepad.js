"use strict";

/* global Primrose, pliny */

Primrose.Input.Gamepad = function () {

  pliny.issue({
    parent: "Primrose.Input.Gamepad",
    name: "document Gamepad",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.Gamepad](#Primrose_Input_Gamepad) class in the input/ directory"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "Gamepad",
    description: "| [under construction]",
    parameters: [{ name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }]
  });
  function GamepadInput(name, commands, socket, gpid) {
    Primrose.Input.ButtonAndAxis.call(this, name, commands, socket, GamepadInput.AXES, true);
    var connectedGamepads = [],
        listeners = {
      gamepadconnected: [],
      gamepaddisconnected: []
    };

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.superUpdate",
      type: "open",
      description: ""
    });
    this.superUpdate = this.update;

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.checkDevice",
      type: "open",
      description: ""
    });
    this.checkDevice = function (pad) {
      var i;
      for (i = 0; i < pad.buttons.length; ++i) {
        this.setButton(i, pad.buttons[i].pressed);
      }
      for (i = 0; i < pad.axes.length; ++i) {
        this.setAxis(GamepadInput.AXES[i], pad.axes[i]);
      }
    };

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.update",
      type: "open",
      description: ""
    });
    this.update = function (dt) {
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

      this.superUpdate(dt);
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

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.getErrorMessage",
      type: "open",
      description: ""
    });
    this.getErrorMessage = function () {
      return errorMessage;
    };

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.setGamepad",
      type: "open",
      description: ""
    });
    this.setGamepad = function (id) {
      gpid = id;
      this.inPhysicalUse = true;
    };

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.clearGamepad",
      type: "open",
      description: ""
    });
    this.clearGamepad = function () {
      gpid = null;
      this.inPhysicalUse = false;
    };

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.isGamepadSet",
      type: "open",
      description: ""
    });
    this.isGamepadSet = function () {
      return !!gpid;
    };

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.getConnectedGamepads",
      type: "open",
      description: ""
    });
    this.getConnectedGamepads = function () {
      return connectedGamepads.slice();
    };

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.addEventListener",
      type: "open",
      description: ""
    });
    this.addEventListener = function (event, handler, bubbles) {
      if (listeners[event]) {
        listeners[event].push(handler);
      }
      if (event === "gamepadconnected") {
        connectedGamepads.forEach(onConnected);
      }
    };

    pliny.issue({
      parent: "Primrose.Input.Gamepad",
      name: "document Gamepad.removeEventListener",
      type: "open",
      description: ""
    });
    this.removeEventListener = function (event, handler, bubbles) {
      if (listeners[event]) {
        remove(listeners[event], handler);
      }
    };

    try {
      this.update(0);
      this.available = true;
    } catch (err) {
      this.avaliable = false;
      this.errorMessage = err;
    }
  }

  pliny.issue({
    parent: "Primrose.Input.Gamepad",
    name: "document Gamepad.AXES",
    type: "open",
    description: ""
  });
  GamepadInput.AXES = ["LSX", "LSY", "RSX", "RSY"];
  Primrose.Input.ButtonAndAxis.inherit(GamepadInput);
  return GamepadInput;
}();

Primrose.Input.Gamepad.XBOX_BUTTONS = pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "XBOX_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller.",
  value: {
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
  }
});
