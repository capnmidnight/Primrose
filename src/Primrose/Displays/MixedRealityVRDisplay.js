import VRDisplay from "./VRDisplay";
import getMonoscopicEyeParemtersMixin from "./getMonoscopicEyeParemtersMixin";

let defaultFieldOfView = 50;
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

export default class MixedRealityVRDisplay extends VRDisplay {

  static get DEFAULT_FOV () {
    return defaultFieldOfView;
  }

  static set DEFAULT_FOV (v) {
    defaultFieldOfView = v;
  }

  constructor(display) {
    super("Full Screen");
    this._display = display;
    this.motionDevice = null;

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
      },

      isPolyfilled: immutable(true)
    });
  }

  requestPresent(layers) {
    return this._display.requestPresent(layers)
  }

  exitPresent() {
    return this._display.exitPresent();
  }

  getLayers() {
    return this._display.getLayers();
  }

  submitFrame(pose) {
    // ?????
    // probably do nothing
    // probably need the real VRDisplay doing a rendering pass before this
    if(this._display) {
      this._display.submitFrame(pose);
    }
    else{
      super.submitFrame(pose);
    }
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
    if(this.motionDevice) {
      return this._display.requestAnimationFrame(callback);
    }
    else {
      return super.requestAnimationFrame(callback);
    }
  }

  cancelAnimationFrame(id) {
    if(this.motionDevice) {
      return this._display.cancelAnimationFrame(id);
    }
    else {
      return super.cancelAnimationFrame(id);
    }
  }

  getPose() {
    if(this.motionDevice){
      return this.motionDevice.getPose();
    }
    else{
      return defaultPose();
    }
  }
}

MixedRealityVRDisplay.prototype.getEyeParameters = getMonoscopicEyeParemtersMixin;
