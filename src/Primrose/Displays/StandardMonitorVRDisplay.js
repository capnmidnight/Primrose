import defaultPose from "./defaultPose";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";

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

  _getPose() {
    return defaultPose();
  }
};
