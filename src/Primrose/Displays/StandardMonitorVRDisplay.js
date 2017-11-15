import pliny from "pliny/pliny";

import defaultPose from "./defaultPose";
import frameDataFromPose from "./frameDataFromPose";
import mixinMonoscopicEyeParameters from "./mixinMonoscopicEyeParameters";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";
import PolyfilledVRFrameData from "./PolyfilledVRFrameData";

export default class StandardMonitorVRDisplay extends PolyfilledVRDisplay {

  constructor() {
    super("Full Screen");
  }

  get isStandardMonitorVRDisplay() {
    return true;
  }

  get isStereo() {
    return false;
  }

  submitFrame() {
    // do nothing
  }

  _getPose() {
    return defaultPose();
  }
};

mixinMonoscopicEyeParameters(StandardMonitorVRDisplay);
