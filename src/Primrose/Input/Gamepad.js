/*
pliny.class({
  parent: "Primrose.Input",
  name: "Gamepad",
  baseClass: "Primrose.Input.PoseInputProcessor",
  description: "| [under construction]"
});
*/

function playPattern(devices, pattern, pause){
  if(pattern.length > 0){
    const length = pattern.shift();
    if(!pause){
      for(var i = 0; i < devices.length; ++i){
        devices[0].vibrate(1, length);
      }
    }
    setTimeout(playPattern, length, devices, pattern, !pause);
  }
}

import PoseInputProcessor from "./PoseInputProcessor"
export default class Gamepad extends PoseInputProcessor {
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

  static isMotionController(pad){
    if(pad) {
      const obj = pad.capabilities || pad.pose;
      return obj && obj.hasOrientation;
    }
    return false;
  }

  constructor(mgr, pad, axisOffset, commands) {
    var padID = Gamepad.ID(pad);
    super(padID, commands, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z", "BUTTONS"]);
    mgr.registerPad(padID, this)

    this.currentDevice = pad;
    this.axisOffset = axisOffset;
  }

  get hasOrientation() {
    return Gamepad.isMotionController(this.currentDevice);
  }

  getPose() {
    return this.currentPose;
  }

  checkDevice(pad) {
    this.inPhysicalUse = true;
    var i, j, buttonMap = 0;
    this.currentDevice = pad;
    this.currentPose = this.hasOrientation && this.currentDevice.pose;
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

  vibratePattern(pattern) {
    if(this.currentDevice){
      if (this.currentDevice.vibrate) {
        this.currentDevice.vibrate(pattern);
      }
      else if(this.currentDevice.haptics && this.currentDevice.haptics.length > 0) {
        playPattern(this.currentDevice.haptics, pattern);
      }
    }
  }

  get haptics() {
    return this.currentDevice && this.currentDevice.haptics;
  }
}

/*
pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "XBOX_360_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller."
});
*/
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

/*
pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "XBOX_ONE_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller."
});
*/
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

/*
pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "VIVE_BUTTONS",
  description: "Labeled names for each of the different control buttons of the HTC Vive Motion Controllers."
});
*/
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
