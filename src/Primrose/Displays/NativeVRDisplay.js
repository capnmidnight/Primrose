import pliny from "pliny/pliny";

import BaseVRDisplay from "./BaseVRDisplay";

export default class NativeVRDisplay extends BaseVRDisplay {
  constructor(display) {
    super(VRFrameData);
    this.display = display;
  }

  get capabilities() {
    return this.display.capabilities;
  }

  get displayId() {
    return this.display.displayId;
  }

  get displayName() {
    return this.display.displayName;
  }

  get isConnected() {
    return this.display.isConnected;
  }

  get stageParameters() {
    return this.display.stageParameters;
  }

  get isPresenting() {
    return this.display.isPresenting;
  }

  get depthNear() {
    return this.display.depthNear;
  }

  set depthNear(v) {
    this.display.depthNear = v;
  }

  get depthFar() {
    return this.display.depthFar;
  }

  set depthFar(v) {
    this.display.depthFar = v;
  }

  getFrameData(frameData) {
    this.display.getFrameData(frameData);
  }

  getPose() {
    return this.display.getPose();
  }

  resetPose(){
    return this.display.resetPose();
  }

  getEyeParameters (side) {
    return this.display.getEyeParameters(side);
  }

  requestAnimationFrame(callback) {
    if(this.isPresenting) {
      return this.display.requestAnimationFrame(callback);
    }
    else {
      return window.requestAnimationFrame(callback);
    }
  }

  cancelAnimationFrame(id) {
    if(this.isPresenting) {
      return this.display.cancelAnimationFrame(id);
    }
    else {
      return window.cancelAnimationFrame(id);
    }
  }

  requestPresent(layers) {
    return this.display.requestPresent(layers);
  }

  exitPresent() {
    return this.display.exitPresent();
  }

  getLayers() {
    return this.display.getLayers();
  }

  submitFrame() {
    return this.display.submitFrame();
  }

  get isNativeVRDisplay() {
    return true;
  }

  get isStereo() {
    return true;
  }

  get targetName() {
    return this.display.displayName;
  }

  get renderOrder() {
    return 0;
  }
};
