/*
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
*/

const DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  };

import { Matrix4 } from "three";

import {
  isCardboard,
  isChrome,
  isFirefox,
  isMobile,
  isGearVR
} from "../../flags";

import {
  PointerLock,
  Orientation,
  standardFullScreenBehavior,
  standardLockBehavior
} from "../../util";

import installPolyfills from "../Displays/install";
import CardboardVRDisplay from "../Displays/CardboardVRDisplay";

import PoseInputProcessor from "./PoseInputProcessor";

export default class VR extends PoseInputProcessor {

  constructor(options) {
    super("VR");

    this.options = options;
    this.displays = [];
    this._transformers = [];
    this.currentDeviceIndex = -1;
    this.movePlayer = new Matrix4();
    this.stage = null;
    this.lastStageWidth = null;
    this.lastStageDepth = null;
    installPolyfills(options);

    this.ready = navigator.getVRDisplays()
      .then((displays) => {
        this.displays.push.apply(this.displays, displays);
        this.connect(0);
        return this.displays;
      });
  }

  connect(selectedIndex) {
    this.currentPose = null;
    this.currentFrameData = null;
    this.currentDevice = null;
    this.currentDeviceIndex = selectedIndex;
    if (0 <= selectedIndex && selectedIndex <= this.displays.length) {
      this.currentDevice = this.displays[selectedIndex];
      this.currentFrameData = this.currentDevice.makeVRFrameDataObject();
      this.currentDevice.getFrameData(this.currentFrameData);
      this.currentPose = this.currentFrameData.pose;
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

      let promise = this.currentDevice.requestPresent(layers);
      if(isMobile || !isFirefox) {
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
      this.currentPose = null;
      this.currentFrameData = null;
    }
    else {
      promise = Promise.resolve();
    }

    if (!this.isPolyfilled && isChrome && isMobile) {
      promise = promise.then(Orientation.unlock);
    }

    return promise
      .then(PointerLock.exit)
      .catch((exp) => console.warn(exp))
      .then(() => this.connect(0));
  }

  update(dt) {
    var x, z, stage;

    if (this.currentDevice) {
      this.currentDevice.getFrameData(this.currentFrameData);
      this.currentPose = this.currentFrameData.pose;
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
    if(this.currentDevice) {
      this.currentDevice.submitFrame();
    }
  }

  getTransforms(near, far) {
    if (this.currentDevice) {
      this.currentDevice.depthNear = near;
      this.currentDevice.depthFar = far;

      const left = this.currentDevice.getEyeParameters("left"),
        right = this.currentDevice.getEyeParameters("right"),
        eyes = [{
          projection: this.currentFrameData.leftProjectionMatrix,
          view: this.currentFrameData.leftViewMatrix,
          eye: left
        }];

      if(right) {
        eyes.push({
          projection: this.currentFrameData.rightProjectionMatrix,
          view: this.currentFrameData.rightViewMatrix,
          eye: right
        });
      }

      let x = 0;
      for(let i = 0; i < eyes.length; ++i) {
        const view = eyes[i],
          eye = view.eye;

        view.viewport = {
          left: x,
          width: eye.renderWidth,
          height: eye.renderHeight
        };

        x += eye.renderWidth;
      }

      return eyes;
    }
  }

  get canMirror() {
    return this.currentDevice && this.currentDevice.capabilities.hasExternalDisplay;
  }

  get isPolyfilled() {
    return this.currentDevice && this.currentDevice.isPolyfilledVRDisplay;
  }

  get isPresenting() {
    return this.currentDevice && this.currentDevice.isPresenting;
  }

  get hasOrientation() {
    return this.currentDevice && this.currentDevice.capabilities.hasOrientation;
  }

  get isStereo() {
    return this.currentDevice && this.currentDevice.isStereo;
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
