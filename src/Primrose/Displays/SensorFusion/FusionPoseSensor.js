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
import ComplementaryFilter from "./complementary-filter.js";
import PosePredictor from "./pose-predictor.js";
import MathUtil from "../math-util.js";
import Util from "../util.js";
import isTimestameDeltaValid from "../../../util/isTimestameDeltaValid";
import isLandscape from "../../../flags/isLandscape";

/**
 * The pose sensor, implemented using DeviceMotion APIs.
 */
export default class FusionPoseSensor {
  constructor() {
    this.deviceId = 'webvr-polyfill:fused';
    this.deviceName = 'VR Position Device (webvr-polyfill:fused)';

    this.accelerometer = new MathUtil.Vector3();
    this.gyroscope = new MathUtil.Vector3();

    window.addEventListener('devicemotion', this.onDeviceMotionChange_.bind(this));
    window.addEventListener('orientationchange', this.onScreenOrientationChange_.bind(this));

    this.filter = new ComplementaryFilter(WebVRConfig.K_FILTER);
    this.posePredictor = new PosePredictor(WebVRConfig.PREDICTION_TIME_S);

    this.filterToWorldQ = new MathUtil.Quaternion();

    // Set the filter to world transform, depending on OS.
    if (Util.isIOS()) {
      this.filterToWorldQ.setFromAxisAngle(new MathUtil.Vector3(1, 0, 0), Math.PI / 2);
    } else {
      this.filterToWorldQ.setFromAxisAngle(new MathUtil.Vector3(1, 0, 0), -Math.PI / 2);
    }

    this.inverseWorldToScreenQ = new MathUtil.Quaternion();
    this.worldToScreenQ = new MathUtil.Quaternion();
    this.originalPoseAdjustQ = new MathUtil.Quaternion();
    this.originalPoseAdjustQ.setFromAxisAngle(new MathUtil.Vector3(0, 0, 1),
                                             -window.orientation * Math.PI / 180);

    this.setScreenTransform_();
    // Adjust this filter for being in landscape mode.
    if (isLandscape()) {
      this.filterToWorldQ.multiply(this.inverseWorldToScreenQ);
    }

    // Keep track of a reset transform for resetSensor.
    this.resetQ = new MathUtil.Quaternion();

    this.isFirefoxAndroid = Util.isFirefoxAndroid();
    this.isIOS = Util.isIOS();

    this.orientationOut_ = new Float32Array(4);
    this.predictedQ = new Quaternion();
  }

  getPosition() {
    // This PoseSensor doesn't support position
    return null;
  }

  getOrientation() {
    // Convert from filter space to the the same system used by the
    // deviceorientation event.
    var orientation = this.filter.getOrientation();

    // Predict orientation.
    this.posePredictor.getPrediction(orientation, this.gyroscope, this.previousTimestampS, this.predictedQ);

    // Convert to THREE coordinate system: -Z forward, Y up, X right.
    var out = new MathUtil.Quaternion();
    out.copy(this.filterToWorldQ);
    out.multiply(this.resetQ);
    out.multiply(this.predictedQ);
    out.multiply(this.worldToScreenQ);

    // Handle the yaw-only case.
    if (WebVRConfig.YAW_ONLY) {
      // Make a quaternion that only turns around the Y-axis.
      out.x = 0;
      out.z = 0;
      out.normalize();
    }

    this.orientationOut_[0] = out.x;
    this.orientationOut_[1] = out.y;
    this.orientationOut_[2] = out.z;
    this.orientationOut_[3] = out.w;
    return this.orientationOut_;
  }

  resetPose() {
    // Reduce to inverted yaw-only.
    this.resetQ.copy(this.filter.getOrientation());
    this.resetQ.x = 0;
    this.resetQ.y = 0;
    this.resetQ.z *= -1;
    this.resetQ.normalize();

    // Take into account extra transformations in landscape mode.
    if (isLandscape()) {
      this.resetQ.multiply(this.inverseWorldToScreenQ);
    }

    // Take into account original pose.
    this.resetQ.multiply(this.originalPoseAdjustQ);
  }

  onDeviceMotionChange_(deviceMotion) {
    var accGravity = deviceMotion.accelerationIncludingGravity;
    var rotRate = deviceMotion.rotationRate;
    var timestampS = deviceMotion.timeStamp / 1000;

    // Firefox Android timeStamp returns one thousandth of a millisecond.
    if (this.isFirefoxAndroid) {
      timestampS /= 1000;
    }

    var deltaS = timestampS - this.previousTimestampS;
    if (!isTimestameDeltaValid(deltaS)) {
      console.warn("Invalid timestamps detected. Time step between successive gyroscope sensor samples is very small or not monotonic");
      this.previousTimestampS = timestampS;
      return;
    }
    this.accelerometer.set(-accGravity.x, -accGravity.y, -accGravity.z);
    this.gyroscope.set(rotRate.alpha, rotRate.beta, rotRate.gamma);

    // With iOS and Firefox Android, rotationRate is reported in degrees,
    // so we first convert to radians.
    if (this.isIOS || this.isFirefoxAndroid) {
      this.gyroscope.multiplyScalar(Math.PI / 180);
    }

    this.filter.addAccelMeasurement(this.accelerometer, timestampS);
    this.filter.addGyroMeasurement(this.gyroscope, timestampS);

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
        this.worldToScreenQ.setFromAxisAngle(new MathUtil.Vector3(0, 0, 1), -Math.PI / 2);
        break;
      case -90:
        this.worldToScreenQ.setFromAxisAngle(new MathUtil.Vector3(0, 0, 1), Math.PI / 2);
        break;
      case 180:
        // TODO.
        break;
    }
    this.inverseWorldToScreenQ.copy(this.worldToScreenQ);
    this.inverseWorldToScreenQ.inverse();
  }
}