import pliny from "pliny/pliny";

import { isMobile } from "../../flags";
import VRDisplay from "./VRDisplay";
import defaultPose from "./defaultPose";
import mixinMonoscopicEyeParameters from "./mixinMonoscopicEyeParameters";


export default class StandardMonitorVRDisplay extends VRDisplay {

  constructor(display) {
    super("Full Screen");
    this._display = display;
  }

  get isStereo() {
    return false;
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
