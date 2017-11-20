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
  name: "PosePredictor",
  description: "Given an orientation and the gyroscope data, predicts the future orientation of the head. This makes rendering appear faster. Also see: http://msl.cs.uiuc.edu/~lavalle/papers/LavYerKatAnt14.pdf",
  parameters: [{
    name: "predictionTimeS",
    type: "Number",
    description: "time from head movement to the appearance of the corresponding image."
  }]
});
*/

import { Quaternion, Vector3 } from "three";
import { Math as _Math } from "three";

const { DEG2RAD, RAD2DEG } = _Math;
const AXIS = new Vector3();

export default class PosePredictor {
  constructor(predictionTimeS) {
    this.predictionTimeS = predictionTimeS;
    this.previousQ = new Quaternion();
    this.previousTimestampS = null;
    this.deltaQ = new Quaternion();
  }

  getPrediction(currentQ, gyro, timestampS, outQ) {
    if (!this.previousTimestampS) {
      this.previousQ.copy(currentQ);
      this.previousTimestampS = timestampS;
      return currentQ;
    }

    // Calculate axis and angle based on gyroscope rotation rate data.
    AXIS.copy(gyro);
    AXIS.normalize();

    var angularSpeed = gyro.length();

    // If we're rotating slowly, don't do prediction.
    if (angularSpeed < DEG2RAD * 20) {
      outQ.copy(currentQ);
      this.previousQ.copy(currentQ);
      return;
    }

    // Get the predicted angle based on the time delta and latency.
    var deltaT = timestampS - this.previousTimestampS;
    var predictAngle = angularSpeed * this.predictionTimeS;

    this.deltaQ.setFromAxisAngle(AXIS, predictAngle);
    outQ.copy(this.previousQ);
    outQ.multiply(this.deltaQ);

    this.previousQ.copy(currentQ);
    this.previousTimestampS = timestampS;
  }
}
