Primrose.Input.Gamepad = (function () {
  "use strict";

  navigator.getGamepads = navigator.getGamepads ||
    navigator.webkitGetGamepads;

  const listeners = {
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
      parameters: [{
        name: "name",
        type: "string",
        description: "An unique name for this input manager. Note that systems with motion controllers will often have two controllers with the same ID, but different indexes. The name should take that into account."
      }, {
        name: "commands",
        type: "Array",
        optional: true,
        description: "An array of input command descriptions."
      }, {
        name: "socket",
        type: "WebSocket",
        optional: true,
        description: "A socket over which to transmit device state for device fusion."
      }],
      description: "An input processor for Gamepads, including those with positional data."
  });
  class Gamepad extends Primrose.InputProcessor {
    static ID(pad) {
      var id = (pad.id + "_" + (pad.index || 0))
        .replace(/\s+/g, "_");
      if(id === "OpenVR Gamepad"){
        id = "Vive";
      }
      else if(id.indexOf("Xbox") === 0){
        id = "Gamepad";
      }
      else if(id.indexOf("Rift") === 0){
        id = "Rift";
      }
      else if(id.indexOf("Unknown") === 0){
        id = "Unknown";
      }
      return id;
    }

    static poll() {
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
            }
            else {
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
        }
        else if (mgr) {
          mgr.checkDevice(pad);
        }
      }

      newPads.forEach(emit.bind(Gamepad, "gamepadconnected"));
      oldPads.forEach(emit.bind(Gamepad, "gamepaddisconnected"));
    }

    static get pads() {
      return currentPads;
    }

    static get listeners() {
      return listeners;
    }

    static addEventListener(evt, thunk) {
      if (listeners[evt]) {
        listeners[evt].push(thunk);
      }
    }

    constructor(pad, axisOffset, commands, socket, parent) {
      var padID = Gamepad.ID(pad);
      super(padID, parent, commands, socket, Gamepad.AXES);
      currentManagers[padID] = this;

      this.currentPad = pad;
      this.axisOffset = axisOffset;
    }

    checkDevice(pad) {
      var i, buttonMap = 0;
      this.currentPad = pad;
      for (i = 0; i < pad.buttons.length; ++i) {
        var btn = pad.buttons[i];
        this.setButton(i, btn.pressed);
        if(btn.pressed){
          buttonMap |= 0x1 << i;
        }
        this.setButton(i + pad.buttons.length, btn.touched);
      }
      this.setAxis("BUTTONS", buttonMap);
      for (i = 0; i < pad.axes.length; ++i) {
        var axisName = this.axisNames[this.axisOffset * pad.axes.length + i];
        this.setAxis(axisName, pad.axes[i]);
      }

      this.currentPose = pad.pose;
    }

    vibrate() {
      if (this.currentPad && this.currentPad.vibrate) {
        this.currentPad.vibrate.apply(this.currentPad, arguments);
      }
    }

    updatePosition() {
      var p = this.currentPose && this.currentPose.position;
      if (p) {
        this.position.fromArray(p);
      }
    }

    updateVelocity() {
      var p = this.currentPose && this.currentPose.position;
      if (!p) {
        this.velocity.set(
          this.getValue("strafe"),
          0,
          this.getValue("drive")
        );
      }
    }

    updateOrientation(excludePitch) {
      var o = this.currentPose && this.currentPose.orientation;
      if (o) {
        this.mesh.quaternion.fromArray(o);
      }
      else {
        this.euler.set(
          this.getValue("pitch"),
          this.getValue("heading"),
          0,
          "YXZ"
        );
        this.mesh.quaternion.setFromEuler(this.euler);
      }
    }
  }
  Primrose.InputProcessor.defineAxisProperties(Gamepad, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z", "BUTTONS"]);

  pliny.enumeration({
    parent: "Primrose.Input.Gamepad",
    name: "XBOX_360_BUTTONS",
    description: "Labeled names for each of the different control features of the Xbox 360 controller."
  });
  Gamepad.XBOX_360_BUTTONS = {
    A: 1,
    B: 2,
    X: 3,
    Y: 4,
    LEFT_BUMPER: 5,
    RIGHT_BUMPER: 6,
    LEFT_TRIGGER: 7,
    RIGHT_TRIGGER: 8,
    BACK: 9,
    START: 10,
    LEFT_STICK: 11,
    RIGHT_STICK: 12,
    UP_DPAD: 13,
    DOWN_DPAD: 14,
    LEFT_DPAD: 15,
    RIGHT_DPAD: 16
  };

  pliny.enumeration({
    parent: "Primrose.Input.Gamepad",
    name: "XBOX_ONE_BUTTONS",
    description: "Labeled names for each of the different control features of the Xbox 360 controller."
  });
  Gamepad.XBOX_ONE_BUTTONS = {
    A: 1,
    B: 2,
    X: 3,
    Y: 4,
    LEFT_BUMPER: 5,
    RIGHT_BUMPER: 6,
    LEFT_TRIGGER: 7,
    RIGHT_TRIGGER: 8,
    BACK: 9,
    START: 10,
    LEFT_STICK: 11,
    RIGHT_STICK: 12,
    UP_DPAD: 13,
    DOWN_DPAD: 14,
    LEFT_DPAD: 15,
    RIGHT_DPAD: 16
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
})();