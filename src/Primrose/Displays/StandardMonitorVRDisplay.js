import pliny from "pliny/pliny";

import { isMobile } from "../../flags";
import VRDisplay from "./VRDisplay";
import mixinMonoscopicEyeParameters from "./mixinMonoscopicEyeParameters";

function defaultPose() {
  return {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1],
    linearVelocity: null,
    linearAcceleration: null,
    angularVelocity: null,
    angularAcceleration: null
  };
}

export default class StandardMonitorVRDisplay extends VRDisplay {

  constructor(display) {
    super("Full Screen");
    this._display = display;
  }

  submitFrame() {
    if(this._display && this._display.isPolyfilled) {
      this._display.submitFrame();
    }
  }

  getFrameData(frameData) {
    var display = isMobile && this._display;
    if(display){
      display.getFrameData(frameData);
    }
    else{
      frameData.pose = defaultPose();
    }
  }
};

mixinMonoscopicEyeParameters(StandardMonitorVRDisplay);
