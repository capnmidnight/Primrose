import StandardMonitorVRDisplay from "./StandardMonitorVRDisplay";

export default class MixedRealityVRDisplay extends StandardMonitorVRDisplay {

  constructor(display) {
    super(display, "Mixed Reality");
    this.isMixedRealityVRDisplay = true;
    this.motionDevice = null;

    Object.defineProperties(this.capabilities, {
      hasPosition: immutable(() => this.motionDevice && this.motionDevice.hasPosition),
      hasOrientation: immutable(() => this.motionDevice && this.motionDevice.hasOrientation),
    });
  }

  set motionDevice(device) {
    this._motionDevice = device;
  }

  _getPose() {
    return this.motionDevice.getPose();
  }

  getFrameData(frameData) {
    this.motionDevice.getFrameData(frameData);
  }

  resetPose(){
    return this.motionDevice.resetPose();
  }
}
