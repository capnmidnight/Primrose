/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import BaseVRDisplay from "./BaseVRDisplay";
import calculateElementSize from "./calculateElementSize";
import defaultPose from "./defaultPose";
import mixinFrameDataFromPose from "./mixinFrameDataFromPose";
import PolyfilledVRFrameData from "./PolyfilledVRFrameData";

import { isMobile } from "../../flags";

import {
  mutable,
  immutable,
  FullScreen,
  standardFullScreenBehavior,
  standardExitFullScreenBehavior
} from "../../util";

import { Math as _Math } from "three";

const { DEG2RAD, RAD2DEG } = _Math;


function calcFoV(aFoV, aDim, bDim){
  return RAD2DEG * Math.atan(Math.tan(DEG2RAD * aFoV) * aDim / bDim);
}

let defaultFieldOfView = 100;

const defaultLeftBounds = [0, 0, 0.5, 1],
  defaultRightBounds = [0.5, 0, 0.5, 1];

// Start at a higher number to reduce chance of conflict.
let nextDisplayId = 1000,
  hasShowDeprecationWarning = false;

export default class PolyfilledVRDisplay extends BaseVRDisplay {

  static get DEFAULT_FOV() {
    return defaultFieldOfView;
  }

  static set DEFAULT_FOV(v) {
    defaultFieldOfView = v;
  }

  constructor(name) {
    super();

    this._currentLayers = [];

    Object.defineProperties(this, {
      capabilities: immutable(Object.defineProperties({}, {
        hasPosition: immutable(false),
        hasOrientation: immutable(isMobile),
        hasExternalDisplay: immutable(false),
        canPresent: immutable(true),
        maxLayers: immutable(1)
      })),
      displayId: immutable(nextDisplayId++),
      displayName: immutable(name),
      stageParameters: immutable(null),
      isPresenting: immutable(() => FullScreen.isActive ),

      depthNear: mutable(0.01, "number"),
      depthFar: mutable(10000.0, "number")
    });

    this._poseData = null;
  }

  get isPolyfilledVRDisplay() {
    return true;
  }

  requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
  }

  cancelAnimationFrame(id) {
    return window.cancelAnimationFrame(id);
  }

  requestPresent(layers) {
    for (var i = 0; i < this.capabilities.maxLayers && i < layers.length; ++i) {
      this._currentLayers[i] = layers[i];
    }
    const elem = layers[0].source;
    return standardFullScreenBehavior(elem);
  }

  exitPresent() {
    this._currentLayers.splice(0);
    return standardExitFullScreenBehavior();
  }

  getLayers() {
    return this._currentLayers.slice();
  }

  makeVRFrameDataObject() {
    return new PolyfilledVRFrameData();
  }

  getFrameData(frameData) {
    if(!this._poseData) {
      this._poseData = this._getPose();
    }

    this._frameDataFromPose(frameData);
  }

  submitFrame(pose) {
    this._poseData = null;
  }

  getEyeParameters (side) {
    if (side === "left") {
      const dim = calculateElementSize();
      return {
        renderWidth: dim.width,
        renderHeight: dim.height
      };
    }
  }

  _getFOV(side) {
    if(side === "left") {
      const dim = calculateElementSize();

      let vFOV, hFOV;
      if(dim.height > dim.width) {
        vFOV = defaultFieldOfView / 2,
        hFOV = calcFoV(vFOV, dim.width, dim.height);
      }
      else {
        hFOV = defaultFieldOfView / 2,
        vFOV = calcFoV(hFOV, dim.height, dim.width);
      }

      return {
        offset: new Float32Array([0, 0, 0]),
        fieldOfView: {
          upDegrees: vFOV,
          downDegrees: vFOV,
          leftDegrees: hFOV,
          rightDegrees: hFOV
        }
      };
    }
  }
};

mixinFrameDataFromPose(PolyfilledVRDisplay);
