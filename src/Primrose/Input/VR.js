pliny.class({
  parent: "Primrose.Input",
  name: "VR",
  baseClass: "Primrose.Input.PoseInputProcessor",
  description: "An input manager for gamepad devices.",
  parameters: [{
    name: "avatarHeight",
    type: "Number",
    description: "The default height to use for the user, if the HMD doesn't provide a stage transform."
  }]
});

const DEFAULT_POSE = {
  position: [0, 0, 0],
  orientation: [0, 0, 0, 1]
};

import PoseInputProcessor from "./PoseInputProcessor";
import isChrome from "../../flags/isChrome";
import isFirefox from "../../flags/isFirefox";
import isiOS from "../../flags/isiOS";
import isMobile from "../../flags/isMobile";
import PointerLock from "../../util/PointerLock";
import Orientation from "../../util/Orientation";
import standardFullScreenBehavior from "../../util/standardFullScreenBehavior";
import standardLockBehavior from "../../util/standardLockBehavior";
import installPolyfills from "../Displays/install";
import StandardMonitorVRDisplay from "../Displays/StandardMonitorVRDisplay";
import CardboardVRDisplay from "../Displays/CardboardVRDisplay";
import { Matrix4 } from "three";

export default class VR extends PoseInputProcessor {

  static isStereoDisplay(display) {
    const leftParams = display.getEyeParameters("left"),
        rightParams = display.getEyeParameters("right");
    return !!(leftParams && rightParams);
  }

  constructor(options) {
    super("VR");

    this.options = options;
    this.displays = [];
    this._transformers = [];
    this.timerDevice = null;
    this.timer = null;
    this.currentDeviceIndex = -1;
    this.movePlayer = new Matrix4();
    this.stage = null;
    this.lastStageWidth = null;
    this.lastStageDepth = null;
    this.isStereo = false;
    installPolyfills(options);


    if(this.options.nonstandardIPD !== null){
      CardboardVRDisplay.IPD = this.options.nonstandardIPD;
    }
    if(this.options.nonstandardNeckLength !== null){
      CardboardVRDisplay.NECK_LENGTH = this.options.nonstandardNeckLength;
    }
    if(this.options.nonstandardNeckDepth !== null){
      CardboardVRDisplay.NECK_DEPTH = this.options.nonstandardNeckDepth;
    }

    this.currentDevice = null;
    this.ready = navigator.getVRDisplays()
      .then((displays) => {
        this.displays.push.apply(this.displays, displays);
        this.currentDevice = this.displays[0];
        return this.displays;
      });
  }

  get isNativeMobileWebVR() {
    return this.isNativeWebVR && isChrome && isMobile;
  }

  get isNativeWebVR() {
    return this.currentDevice && this.currentDevice.isNativeVRDisplay;
  }

  connect(selectedIndex) {
    this.currentDevice = null;
    this.currentDeviceIndex = selectedIndex;
    if (0 <= selectedIndex && selectedIndex <= this.displays.length) {
      this.currentDevice = this.displays[selectedIndex];
      this.currentDevice.updateFrameData();
      this.isStereo = VR.isStereoDisplay(this.currentDevice);
    }
  }

  requestPresent(opts) {
    if (!this.currentDevice) {
      return Promise.reject("No display");
    }
    else {
      let layers = opts,
        elem = opts[0].source;

      if (!(layers instanceof Array)) {
        layers = [layers];
      }

      // A hack to deal with a bug in the current build of Chromium
      if (this.isNativeMobileWebVR && this.isStereo) {
        layers = layers[0];
      }

      var promise = this.currentDevice.requestPresent(layers);
      if(isMobile) {
        promise = promise.then(standardLockBehavior);
      }
      return promise;
    }
  }

  cancel() {
    let promise = null;
    if (this.isPresenting) {
      promise = this.currentDevice.exitPresent();
      this.currentDevice = null;
      this.currentDeviceIndex = -1;
    }
    else {
      promise = Promise.resolve();
    }

    if (this.isNativeMobileWebVR) {
      promise = promise.then(Orientation.unlock);
    }

    return promise
      .then(PointerLock.exit)
      .catch((exp) => console.warn(exp))
      .then(() => this.connect(0));
  }

  zero() {
    super.zero();
    if (this.currentDevice) {
      this.currentDevice.resetPose();
    }
  }

  update(dt) {
    var x, z, stage;

    if (this.currentDevice) {
      this.currentDevice.updateFrameData();
      stage = this.currentDevice.stageParameters;
    }
    else{
      stage = null;
    }
    super.update(dt);

    if (stage) {
      this.movePlayer.fromArray(stage.sittingToStandingTransform);
      x = stage.sizeX;
      z = stage.sizeZ;
    }
    else {
      this.movePlayer.makeTranslation(0, this.options.avatarHeight, 0);
      x = 0;
      z = 0;
    }

    var s = {
      matrix: this.movePlayer,
      sizeX: x,
      sizeZ: z
    };

    if (!this.stage || s.sizeX !== this.stage.sizeX || s.sizeZ !== this.stage.sizeZ) {
      this.stage = s;
    }
  }

  get hasStage() {
    return this.stage && this.stage.sizeX * this.stage.sizeZ > 0;
  }

  submitFrame() {
    if(this.currentDevice && this.currentDevice === this.timerDevice) {
      this.currentDevice.submitFrame();
    }
  }

  startAnimation(callback){
    this.timerDevice = this.currentDevice || window;
    this.timer = this.timerDevice.requestAnimationFrame(callback);
  }

  stopAnimation(id) {
    if(this.timerDevice && this.timer) {
      this.timerDevice.cancelAnimationFrame(this.timer);
      this.timer = null;
    }
  }

  getTransforms(near, far) {
    if (this.currentDevice) {
      if (!this._transformers[this.currentDeviceIndex]) {
        this._transformers[this.currentDeviceIndex] = new ViewCameraTransform(this.currentDevice);
      }
      this.currentDevice.depthNear = near;
      this.currentDevice.depthFar = far;
      return this._transformers[this.currentDeviceIndex].getTransforms(near, far);
    }
  }

  get canMirror() {
    return this.currentDevice && this.currentDevice.capabilities.hasExternalDisplay;
  }

  get isPolyfilled() {
    return this.currentDevice && !this.currentDevice.isNativeVRDisplay;
  }

  get isPresenting() {
    return this.currentDevice && this.currentDevice.isPresenting;
  }

  get hasOrientation() {
    return this.currentDevice && this.currentDevice.capabilities.hasOrientation;
  }

  get currentCanvas() {
    if(this.isPresenting) {
      var layers = this.currentDevice.getLayers();
      if(layers.length > 0){
        return layers[0].source;
      }
    }
    return null;
  }
}

function makeTransform(view, projection, eye) {
  return {
    view: view,
    projection: projection,
    viewport: {
      left: 0,
      top: 0,
      width: eye.renderWidth,
      height: eye.renderHeight
    }
  };
}

class ViewCameraTransform {
  constructor(display) {
    this.display = display;
  }

  getTransforms(near, far) {
    this.display.depthNear = near;
    this.display.depthFar = far;

    const l = this.display.getEyeParameters("left"),
      r = this.display.getEyeParameters("right"),
      f = this.display.frameData,
      params = [makeTransform(f.leftViewMatrix, f.leftProjectionMatrix, l)];
    if (r) {
      params.push(makeTransform(f.rightViewMatrix, f.rightProjectionMatrix, r));
    }
    for (let i = 1; i < params.length; ++i) {
      params[i].viewport.left = params[i - 1].viewport.left + params[i - 1].viewport.width;
    }
    return params;
  }
}
