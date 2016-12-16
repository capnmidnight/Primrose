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

import CardboardVRDisplay from "./CardboardVRDisplay.js";
import VRDisplay from "./VRDisplay";
import VRFrameData from "./VRFrameData";
import frameDataFromPose from "./frameDataFromPose";

export class WebVRPolyfill {
  constructor(options) {
    this.options = Object.assign({
        // Forces availability of VR mode, even for non-mobile devices.
        FORCE_ENABLE_VR: false,

        // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
        K_FILTER: 0.98,

        // How far into the future to predict during fast motion (in seconds).
        PREDICTION_TIME_S: 0.040,

        // Enable yaw panning only, disabling roll and pitch. This can be useful
        // for panoramas with nothing interesting above or below.
        YAW_ONLY: false,

        // Prevent the polyfill from initializing immediately. Requires the app
        // to call InitializeWebVRPolyfill() before it can be used.
        DEFER_INITIALIZATION: false
      }, options);

    this.displays = [];
    this.devicesPopulated = false;
    this.nativeWebVRAvailable = this.isWebVRAvailable();

    if (!this.nativeWebVRAvailable) {
      this.enablePolyfill();
    }

    // Put a shim in place to update the API to 1.1 if needed.
    if ('VRDisplay' in window && !('VRFrameData' in window)) {
      // Provide the VRFrameData object.
      window.VRFrameData = VRFrameData;

      // A lot of Chrome builds don't have depthNear and depthFar, even
      // though they're in the WebVR 1.0 spec. Patch them in if they're not present.
      if(!('depthNear' in window.VRDisplay.prototype)) {
        window.VRDisplay.prototype.depthNear = 0.01;
      }

      if(!('depthFar' in window.VRDisplay.prototype)) {
        window.VRDisplay.prototype.depthFar = 10000.0;
      }

      window.VRDisplay.prototype.getFrameData = function(frameData) {
        return frameDataFromPose(frameData, this.getPose(), this);
      };
    }
  }

  get isWebVRAvailable() {
    return ('getVRDisplays' in navigator);
  }

  populateDevices() {
    if (!this.devicesPopulated) {
      // Initialize our virtual VR devices.
      var vrDisplay = null;

      // Add a Cardboard VRDisplay on compatible mobile devices
      if (this.isCardboardCompatible()) {
        vrDisplay = new CardboardVRDisplay();
        this.displays.push(vrDisplay);
      }

      this.devicesPopulated = true;
    }
  }

  enablePolyfill() {
    // Provide navigator.getVRDisplays.
    navigator.getVRDisplays = this.getVRDisplays.bind(this);

    // Provide the VRDisplay object.
    window.VRDisplay = VRDisplay;

    // Provide navigator.vrEnabled.
    var self = this;
    Object.defineProperty(navigator, 'vrEnabled', {
      get: function () {
        return self.isCardboardCompatible() &&
          (document.fullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.webkitFullscreenEnabled ||
            false);
      }
    });

    // Provide the VRFrameData object.
    window.VRFrameData = VRFrameData;
  }

  getVRDisplays() {
    this.populateDevices();
    var displays = this.displays;
    return new Promise(function(resolve, reject) {
      try {
        resolve(displays);
      } catch (e) {
        reject(e);
      }
    });
  }
  /**
   * Determine if a device is mobile.
   */
  isMobile() {
    return /Android/i.test(navigator.userAgent) ||
        /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  isCardboardCompatible() {
    // For now, support all iOS and Android devices.
    // Also enable the WebVRConfig.FORCE_VR flag for debugging.
    return this.isMobile() || WebVRConfig.FORCE_ENABLE_VR;
  }
};;
