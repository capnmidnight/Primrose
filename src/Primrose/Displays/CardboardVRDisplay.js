/*
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import FusionPoseSensor from "./SensorFusion/FusionPoseSensor";
import calculateElementSize from "./calculateElementSize";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";

let Eye = {
  LEFT: "left",
  RIGHT: "right"
},
  ipd = 0.03,
  neckLength = 0,
  neckDepth = 0;

export default class CardboardVRDisplay extends PolyfilledVRDisplay {

  static get IPD() {
    return ipd;
  }

  static set IPD(v) {
    ipd = v;
  }

  static get NECK_LENGTH() {
    return neckLength;
  }

  static set NECK_LENGTH(v) {
    neckLength = v;
  }

  static get NECK_DEPTH() {
    return neckDepth;
  }

  static set NECK_DEPTH(v) {
    neckDepth = v;
  }

  constructor(options) {
    super("Google Cardboard");
    this.DOMElement = null;
    this._poseSensor = new FusionPoseSensor(options);

    if(options.nonstandardIPD !== null){
      ipd = options.nonstandardIPD;
    }
    if(options.nonstandardNeckLength !== null){
      neckLength = options.nonstandardNeckLength;
    }
    if(options.nonstandardNeckDepth !== null){
      neckDepth = options.nonstandardNeckDepth;
    }
  }

  get isCardboardVRDisplay() {
    return true;
  }

  get isStereo() {
    return true;
  }

  _getPose() {
    return this._poseSensor.getPose();
  }

  _getFOV(whichEye) {
    var offset = [ipd, neckLength, neckDepth];

    if (whichEye == Eye.LEFT) {
      offset[0] *= -1.0;
    }

    return {
      offset,
      fieldOfView: {
        upDegrees: 40,
        downDegrees: 40,
        leftDegrees: 40,
        rightDegrees: 40
      }
    };
  }

  getEyeParameters(whichEye) {
    const dim = calculateElementSize();
    return {
      renderWidth: 0.5 * dim.width,
      renderHeight: dim.height,
    }
  }
};
