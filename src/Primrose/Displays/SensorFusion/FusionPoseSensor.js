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

/*
pliny.class({
  parent: "Primrose.Displays.SensorFusion",
  name: "FusionPoseSensor",
  description: "The pose sensor, implemented using DeviceMotion APIs.",
  parameters: [{
    name: "options",
    type: "Primrose.Displays.FusionPoseSensor.optionsHash",
    optional: true,
    description: "Options for configuring the pose sensor."
  }]
});
*/

/*
pliny.record({
  parent: "Primrose.Displays.FusionPoseSensor",
  name: "optionsHash",
  description: "Options for configuring the pose sensor.",
  parameters: [{
    name: "K_FILTER",
    type: "Number",
    optional: true,
    default: 0.98,
    description: "Complementary filter coefficient. 0 for accelerometer, 1 for gyro."
  }, {
    name: "PREDICTION_TIME_S",
    type: "Number",
    optional: true,
    default: 0.040,
    description: "How far into the future to predict during fast motion (in seconds)."
  }]
});
*/

import ComplementaryFilter from "./ComplementaryFilter";
import PosePredictor from "./PosePredictor";
import { Quaternion, Vector3 } from "three";
import { Math as _Math } from "three";
import { isTimestampDeltaValid } from "../../../util";
import { isLandscape, isiOS, isFirefox, isMobile } from "../../../flags";


const isFirefoxAndroid = isFirefox && isMobile;
const { DEG2RAD } = _Math;

/**
 * The pose sensor, implemented using DeviceMotion APIs.
 */
export default class FusionPoseSensor {
  constructor(options) {
    options = Object.assign({
      // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
      K_FILTER: 0.98,

      // How far into the future to predict during fast motion (in seconds).
      PREDICTION_TIME_S: 0.040
    }, options);

    this.deviceId = 'webvr-polyfill:fused';
    this.deviceName = 'VR Position Device (webvr-polyfill:fused)';

    this.accelerometer = new Vector3();
    this.gyroscope = new Vector3();

    window.addEventListener('devicemotion', this.onDeviceMotionChange_.bind(this));
    window.addEventListener('orientationchange', this.onScreenOrientationChange_.bind(this));

    this.filter = new ComplementaryFilter(options.K_FILTER);
    this.posePredictor = new PosePredictor(options.PREDICTION_TIME_S);

    this.filterToWorldQ = new Quaternion();

    // Set the filter to world transform, depending on OS.
    if (isiOS) {
      this.filterToWorldQ.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
    } else {
      this.filterToWorldQ.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
    }

    this.inverseWorldToScreenQ = new Quaternion();
    this.worldToScreenQ = new Quaternion();
    this.originalPoseAdjustQ = new Quaternion();
    this.originalPoseAdjustQ.setFromAxisAngle(new Vector3(0, 0, 1),
                                             -window.orientation * DEG2RAD);

    this.setScreenTransform_();
    // Adjust this filter for being in landscape mode.
    if (isLandscape()) {
      this.filterToWorldQ.multiply(this.inverseWorldToScreenQ);
    }

    // Keep track of a reset transform for resetSensor.
    this.resetQ = new Quaternion();

    this.orientationOut_ = new Float32Array(4);
    this.predictedQ = new Quaternion();
    this.previousTimestampS = null;
  }

  getPosition() {
    // This PoseSensor doesn't support position
    return null;
  }

  getOrientation() {
    // Convert from filter space to the the same system used by the deviceorientation event.
    var orientation = this.filter.getOrientation();

    // Predict orientation.
    this.posePredictor.getPrediction(orientation, this.gyroscope, this.previousTimestampS, this.predictedQ);

    // Convert to THREE coordinate system: -Z forward, Y up, X right.
    var out = new Quaternion();
    out.copy(this.filterToWorldQ);
    out.multiply(this.resetQ);
    out.multiply(this.predictedQ);
    out.multiply(this.worldToScreenQ);

    this.orientationOut_[0] = out.x;
    this.orientationOut_[1] = out.y;
    this.orientationOut_[2] = out.z;
    this.orientationOut_[3] = out.w;
    return this.orientationOut_;
  }

  getPose() {
    return {
      position: this.getPosition(),
      orientation: this.getOrientation(),
      linearVelocity: null,
      linearAcceleration: null,
      angularVelocity: null,
      angularAcceleration: null
    };
  }

  onDeviceMotionChange_(deviceMotion) {
    const accGravity = deviceMotion.accelerationIncludingGravity,
      rotRate = deviceMotion.rotationRate;
    let timestampS = deviceMotion.timeStamp / 1000;

    // Firefox Android timeStamp returns one thousandth of a millisecond.
    if (isFirefoxAndroid) {
      timestampS /= 1000;
    }

    var deltaS = timestampS - this.previousTimestampS;
    if (isTimestampDeltaValid(deltaS)) {
      this.accelerometer.set(-accGravity.x, -accGravity.y, -accGravity.z);
      this.gyroscope.set(rotRate.alpha, rotRate.beta, rotRate.gamma);

      // With iOS and Firefox Android, rotationRate is reported in degrees, so we first convert to radians.
      if (isiOS || isFirefoxAndroid) {
        this.gyroscope.multiplyScalar(DEG2RAD);
      }

      this.filter.addAccelMeasurement(this.accelerometer, timestampS);
      this.filter.addGyroMeasurement(this.gyroscope, timestampS);
    }
    else if (this.previousTimestampS !== null){
      console.warn("Invalid timestamps detected. Time step between successive gyroscope sensor samples is very small or not monotonic");
    }

    this.previousTimestampS = timestampS;
  }

  onScreenOrientationChange_(screenOrientation) {
    this.setScreenTransform_();
  }

  setScreenTransform_() {
    this.worldToScreenQ.set(0, 0, 0, 1);
    switch (window.orientation) {
      case 0:
        break;
      case 90:
        this.worldToScreenQ.setFromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2);
        break;
      case -90:
        this.worldToScreenQ.setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
        break;
      case 180:
        // TODO.
        break;
    }
    this.inverseWorldToScreenQ.copy(this.worldToScreenQ);
    this.inverseWorldToScreenQ.inverse();
  }
}
