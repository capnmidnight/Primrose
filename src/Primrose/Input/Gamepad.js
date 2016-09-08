navigator.getGamepads = navigator.getGamepads ||
  navigator.webkitGetGamepads;

const listeners = {
    gamepadconnected: [],
    gamepaddisconnected: []
  },
  currentDeviceIDs = [],
  currentDevices = [],
  currentManagers = {};

pliny.class({
  parent: "Primrose.Input",
    name: "Gamepad",
    baseClass: "Primrose.PoseInputProcessor",
    parameters: [{
      name: "name",
      type: "string",
      description: "An unique name for this input manager. Note that systems with motion controllers will often have two controllers with the same ID, but different indexes. The name should take that into account."
    }, {
      name: "commands",
      type: "Array",
      optional: true,
      description: "An array of input command descriptions."
    }],
    description: "An input processor for Gamepads, including those with positional data."
});
class Gamepad extends Primrose.PoseInputProcessor {
  static ID(pad) {
    var id = pad.id;
    if (id === "OpenVR Gamepad") {
      id = "Vive";
    }
    else if (id.indexOf("Rift") === 0) {
      id = "Rift";
    }
    else if (id.indexOf("Unknown") === 0) {
      id = "Unknown";
    }
    else {
      id = "Gamepad";
    }
    id = (id + "_" + (pad.index || 0))
      .replace(/\s+/g, "_");
    return id;
  }

  static poll() {
    var maybePads = navigator.getGamepads(),
      pads = [],
      padIDs = [],
      newPads = [],
      oldPads = [],
      i, padID;

    if (maybePads) {
      for (i = 0; i < maybePads.length; ++i) {
        var maybePad = maybePads[i];
        if (maybePad) {
          padID = Gamepad.ID(maybePad);
          var padIdx = currentDeviceIDs.indexOf(padID);
          pads.push(maybePad);
          padIDs.push(padID);
          if (padIdx === -1) {
            newPads.push(maybePad);
            currentDeviceIDs.push(padID);
            currentDevices.push(maybePad);
            delete currentManagers[padID];
          }
          else {
            currentDevices[padIdx] = maybePad;
          }
        }
      }
    }

    for (i = currentDeviceIDs.length - 1; i >= 0; --i) {
      padID = currentDeviceIDs[i];
      var mgr = currentManagers[padID],
        pad = currentDevices[i];
      if (padIDs.indexOf(padID) === -1) {
        oldPads.push(padID);
        currentDevices.splice(i, 1);
        currentDeviceIDs.splice(i, 1);
      }
      else if (mgr) {
        mgr.checkDevice(pad);
      }
    }

    newPads.forEach(emit.bind(Gamepad, "gamepadconnected"));
    oldPads.forEach(emit.bind(Gamepad, "gamepaddisconnected"));
  }

  static get pads() {
    return currentDevices;
  }

  static get listeners() {
    return listeners;
  }

  static addEventListener(evt, thunk) {
    if (listeners[evt]) {
      listeners[evt].push(thunk);
    }
  }

  constructor(pad, axisOffset, commands) {
    var padID = Gamepad.ID(pad);
    super(padID, commands, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z", "BUTTONS"]);
    currentManagers[padID] = this;

    this.currentDevice = pad;
    this.axisOffset = axisOffset;
  }

  checkDevice(pad) {
    var i, j, buttonMap = 0;
    this.currentDevice = pad;
    this.currentPose = pad.capabilities && pad.capabilities.hasOrientation && this.currentDevice.pose;
    for (i = 0, j = pad.buttons.length; i < pad.buttons.length; ++i, ++j) {
      var btn = pad.buttons[i];
      this.setButton(i, btn.pressed);
      if (btn.pressed) {
        buttonMap |= 0x1 << i;
      }

      this.setButton(j, btn.touched);
      if(btn.touched){
        buttonMap |= 0x1 << j;
      }
    }
    this.setAxis("BUTTONS", buttonMap);
    for (i = 0; i < pad.axes.length; ++i) {
      var axisName = this.axisNames[this.axisOffset * pad.axes.length + i],
        axisValue = pad.axes[i];
      this.setAxis(axisName, axisValue);
    }
  }

  vibrate(pattern) {
    if (this.currentDevice && this.currentDevice.vibrate) {
      this.currentDevice.vibrate(pattern);
    }
  }
}

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