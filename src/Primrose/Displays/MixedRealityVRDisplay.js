import defaultPose from "./defaultPose";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";

export default class MixedRealityVRDisplay extends PolyfilledVRDisplay {

  constructor(display) {
    super("Full Screen");
    this._display = display;
    this._motionDevice = null;

    Object.defineProperties(this, {
      capabilities: { get: () => this._display.capabilities },
      stageParameters: { get: () => this._display.stageParameters },
      displayId: immutable(nextDisplayId++),
      displayName: immutable(name),
      isPresenting: { get: () => this._display.isPresenting },

      depthNear: {
        get: () => this._display.depthNear,
        set: (v) => this._display.depthNear = v,
      },
      depthFar: {
        get: () => this._display.depthFar,
        set: (v) => this._display.depthFar = v,
      }
    });
  }

  get isMixedRealityVRDisplay() {
    return true;
  }

  get isStereo() {
    return false;
  }

  getLayers() {
    return this._display.getLayers();
  }

  submitFrame(pose) {
    // do nothing, and make sure the real VRDisplay does a rendering pass first.
  }

  set motionDevice(device) {
    this.enableMotion = !!device;
    this._motionDevice = device;
    if(this.enableMotion) {
      this.capabilities.hasPosition = true;
      this.capabilities.hasOrientation = true;
      this.stageParameters = this._display.stageParameters;
    }
  }

  requestAnimationFrame(callback) {
    // do nothing here, the real VRDisplay should be managing the animation
  }

  cancelAnimationFrame(id) {
    // do nothing here, the real VRDisplay should be managing the animation
  }

  _getPose() {
    if(this._motionDevice){
      return this._motionDevice.getPose();
    }
    else {
      return defaultPose();
    }
  }
}
