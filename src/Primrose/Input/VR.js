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
    this.stage = {
      matrix: new Matrix4(),
      sizeX: 0,
      sizeZ: 0
    };
    this.isStereo = false;

    this.centerWorld = new Matrix4();
    this.leftProjection = new Matrix4();
    this.rightProjection = new Matrix4();
    this.leftView = new Matrix4();
    this.rightView = new Matrix4();
    this.leftWorld = new Matrix4();
    this.rightWorld = new Matrix4();
    this.matrices = [this.leftWorld, this.rightWorld];

    if(this.options.nonstandardIPD !== null){
      CardboardVRDisplay.IPD = this.options.nonstandardIPD;
    }
    if(this.options.nonstandardNeckLength !== null){
      CardboardVRDisplay.NECK_LENGTH = this.options.nonstandardNeckLength;
    }
    if(this.options.nonstandardNeckDepth !== null){
      CardboardVRDisplay.NECK_DEPTH = this.options.nonstandardNeckDepth;
    }

    installPolyfills(options);

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

  updateFrameData() {
    this.currentDevice.getFrameData(this.frameData);

    var len = 1;
    this.leftProjection.fromArray(this.frameData.leftProjectionMatrix);
    this.leftView.fromArray(this.frameData.leftViewMatrix);
    this.leftView.getInverse(this.leftView);
    this.leftWorld.multiplyMatrices(this.leftProjection, this.leftView);
    if(this.isStereo) {
      len = 2;
      this.rightProjection.fromArray(this.frameData.rightProjectionMatrix);
      this.rightView.fromArray(this.frameData.rightViewMatrix);
      this.rightView.getInverse(this.rightView);
      this.rightWorld.multiplyMatrices(this.rightProjection, this.rightView);
    }

    for(let i = 0; i < 16; ++i) {
      this.centerWorld.elements[i] = 0;
      for(let j = 0; j < len; ++j) {
        this.centerWorld.elements[i] += this.matrices[j].elements[i];
      }
      this.centerWorld.elements[i] /= len;
    }

    if(len === 2) {
      this.centerWorld.debug("average of matrices", 3);
    }
  }

  connect(selectedIndex) {
    this.currentDevice = null;
    this.currentDeviceIndex = selectedIndex;
    if (0 <= selectedIndex && selectedIndex <= this.displays.length) {
      this.currentDevice = this.displays[selectedIndex];
      this.isStereo = VR.isStereoDisplay(this.currentDevice);
      this.frameData = this.currentDevice.frameData;
      this.updateFrameData();
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
    this.updateFrameData();

    let stage = this.currentDevice &&  this.currentDevice.stageParameters;
    if (stage) {
      this.stage.matrix.fromArray(stage.sittingToStandingTransform);
      this.stage.sizeX = stage.sizeX;
      this.stage.sizeZ = stage.sizeZ;
    }
    else {
      this.stage.matrix.makeTranslation(0, this.options.avatarHeight, 0);
      this.stage.sizeX = 0;
      this.stage.sizeZ = 0;
    }

    super.update(dt);
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
}

class Transform {
  constructor() {
    this.view = null;
    this.projection = null;
    this.viewport = {
      left: null,
      top: null,
      width: null,
      height: null
    };
    Object.defineProperty(this.viewport, "right", {
      get: () => this.left + this.width
    });
  }
}

class ViewCameraTransform {
  constructor(display) {
    this.display = display;
    this.params = [new Transform()];
  }

  getTransforms(near, far) {
    this.display.depthNear = near;
    this.display.depthFar = far;

    const f = this.display.frameData,
      l = this.display.getEyeParameters("left"),
      r = this.display.getEyeParameters("right"),
      lt = this.params[0];

    lt.view = f.leftViewMatrix;
    lt.projection = f.leftProjectionMatrix;
    lt.viewport.width = l.renderWidth;
    lt.viewport.height = l.renderHeight;

    if (r) {
      if(this.params.length === 1) {
        this.params.push(new Transform());
      }

      const rt = this.params[1];
      rt.view = f.rightViewMatrix;
      rt.projection = f.rightProjectionMatrix;
      rt.viewport.width = r.renderWidth;
      rt.viewport.height = r.renderHeight;
    }

    for (let i = 1; i < this.params.length; ++i) {
      this.params[i].viewport.left = this.params[i - 1].viewport.right;
    }
    return this.params;
  }
}
