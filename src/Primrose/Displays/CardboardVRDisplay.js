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

import FusionPoseSensor from "./sensor-fusion/fusion-pose-sensor.js";
import { VRDisplay } from "./base.js";
import isiOS from "../../flags/isiOS";
import isLandscape from "../../flags/isLandscape";

var Eye = {
  LEFT: "left",
  RIGHT: "right"
};

/**
 * VRDisplay based on mobile device parameters and DeviceMotion APIs.
 */
export default class CardboardVRDisplay extends VRDisplay {
  constructor() {
    super();
    this.DOMElement = null;
    this.displayName = "Google Cardboard";

    this.capabilities.hasOrientation = true;
    this.capabilities.canPresent = true;

    // "Private" members.
    this.poseSensor_ = new FusionPoseSensor();

    if (isiOS) {
      // Listen for resize events to workaround this awful Safari bug.
      window.addEventListener("resize", this.onResize_.bind(this));
    }
  }

  getImmediatePose() {
    return {
      position: this.poseSensor_.getPosition(),
      orientation: this.poseSensor_.getOrientation(),
      linearVelocity: null,
      linearAcceleration: null,
      angularVelocity: null,
      angularAcceleration: null
    }
  }

  resetPose() {
    this.poseSensor_.resetPose();
  }

  getEyeParameters(whichEye) {
    var offset = [0.03, 0.0, 0.0];

    if (whichEye == Eye.LEFT) {
      offset[0] *= -1.0;
    }

    var width = screen.width,
      height = screen.height;

    if(this.DOMElement){
      width = this.DOMElement.clientWidth;
      height = this.DOMElement.clientHeight;
    }
    else if(isiOS && isLandscape()) {
      var temp = width;
      width = height;
      height = temp;
    }

    width *= devicePixelRatio;
    height *= devicePixelRatio;

    return {
      fieldOfView: {
        upDegrees: 40,
        leftDegrees: 40,
        rightDegrees: 40,
        downDegrees: 40
      },
      offset: offset,
      renderWidth: 0.5 * width,
      renderHeight: height,
    }
  }

  beginPresent_() {
    // Listen for orientation change events in order to show interstitial.
    this.orientationHandler = this.onOrientationChange_.bind(this);
    window.addEventListener("orientationchange", this.orientationHandler);
  }

  endPresent_() {
    window.removeEventListener("orientationchange", this.orientationHandler);
  }

  submitFrame(pose) {
  }

  onOrientationChange_(e) {
    console.log("onOrientationChange_");
    this.onResize_();
  }

  onResize_(e) {
    if (this.layer_) {
      // Size the CSS canvas.
      // Added padding on right and bottom because iPhone 5 will not
      // hide the URL bar unless content is bigger than the screen.
      // This will not be visible as long as the container element (e.g. body)
      // is set to "overflow: hidden".
      const canvas = this.layer_.source,
        width = Math.max(screen.width, screen.height),
        height = Math.min(screen.height, screen.width),
        cssProperties = [
          "position: absolute",
          "top: 0",
          "left: 0",
          "width: " + (width + (isiOS ? 1 : 0)) + "px",
          "height: " + height + "px",
          "border: 0",
          "margin: 0"
        ];

      if(isiOS) {
        cssProperties.push("padding: 0 10px 10px 0");
      }

      canvas.setAttribute("style", cssProperties.join("; ") + ";");

      if (isiOS) {
        // TODO(smus): Remove this workaround when Safari for iOS is fixed.
        // iOS only workaround (for https://bugs.webkit.org/show_bug.cgi?id=152556).
        console.log("Resetting width to...", width);
        setTimeout(function() {
          console.log("Done. Width is now", width);
          canvas.style.width = width + "px";
        }, 100);
      }
    }
  }
};