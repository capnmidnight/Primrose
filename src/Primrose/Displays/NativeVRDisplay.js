import pliny from "pliny/pliny";

import BaseVRDisplay from "./BaseVRDisplay";
import frameDataFromPose from "./frameDataFromPose";
import PolyfilledVRFrameData from "./PolyfilledVRFrameData";

export default class NativeVRDisplay extends BaseVRDisplay {
  constructor(display, overrideName, overrideId) {
    super();

    this._display = display;
    this._overrideName = overrideName;
    this._overrideId = overrideId;

    if("depthNear" in display){
      Object.defineProperties(this, {
        depthNear: {
          get() {
            return this._display.depthNear;
          },

          set(v) {
            this._display.depthNear = v;
          }
        },

        depthFar: {
          get() {
            return this._display.depthFar;
          },

          set(v) {
            this._display.depthFar = v;
          }
        }
      });
    }
    else{
      this.depthNear = 0.01;
      this.depthFar = 10000.0;
    }

    if("getFrameData" in display){
      this.makeVRFrameDataObject = () => new VRFrameData();
      this.getFrameData = display.getFrameData.bind(display);
    }
    else{
      this.getFrameData = (frameData) =>
      this.makeVRFrameDataObject = () => new PolyfilledVRFrameData();
        frameDataFromPose(frameData, this.getPose(), this);
    }
  }

  get isNativeVRDisplay() {
    return true;
  }

  get capabilities() {
    return this._display.capabilities;
  }

  get displayId() {
    return this._overrideId || this._display.displayId;
  }

  get displayName() {
    return this._overrideName || this._display.displayName;
  }

  get stageParameters() {
    return this._display.stageParameters;
  }

  get isPresenting() {
    return this._display.isPresenting;
  }

  getEyeParameters (side) {
    return this._display.getEyeParameters(side);
  }

  requestAnimationFrame(callback) {
    if(this.isPresenting) {
      return this._display.requestAnimationFrame(callback);
    }
    else {
      return window.requestAnimationFrame(callback);
    }
  }

  cancelAnimationFrame(id) {
    if(this.isPresenting) {
      return this._display.cancelAnimationFrame(id);
    }
    else {
      return window.cancelAnimationFrame(id);
    }
  }

  requestPresent(layers) {
    return this._display.requestPresent(layers)
      .catch((exp) => console.error(exp));
  }

  exitPresent() {
    return this._display.exitPresent();
  }

  getLayers() {
    return this._display.getLayers();
  }

  submitFrame() {
    if(this.isPresenting) {
      return this._display.submitFrame();
    }
  }

  get isStereo() {
    return !this._display.isBaseVRDisplay || this._display.isStereo;
  }

  get targetName() {
    return this._display.displayName;
  }

  get renderOrder() {
    return 0;
  }
};
