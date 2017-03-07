import StandardMonitorVRDisplay from "./StandardMonitorVRDisplay";

export default class MixedRealityVRDisplay extends StandardMonitorVRDisplay {

  constructor(display) {
    super(display, "Mixed Reality");
    this.motionDevice = null;

    Object.defineProperties(this.capabilities, {
      hasPosition: immutable(() => this.motionDevice && this.motionDevice.hasPosition),
      hasOrientation: immutable(() => this.motionDevice && this.motionDevice.hasOrientation),
    });
  }

  get isMixedRealityVRDisplay() {
    return true;
  }

  get isStereo() {
    return false;
  }

  get targetName() {
    return "Full Screen";
  }

  get renderOrder() {
    return 1;
  }

  _getPose() {
    if(this.motionDevice) {
      return this.motionDevice.getPose();
    }
  }

  resetPose(){
    if(this.motionDevice) {
      return this.motionDevice.resetPose();
    }
  }

  getFrameData(frameData) {
    if(this.motionDevice) {
      this.motionDevice.getFrameData(frameData);
    }
  }
}
