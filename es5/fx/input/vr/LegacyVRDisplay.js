"use strict";

Primrose.Input.VR.LegacyVRDisplay = function () {
  function LegacyVRDisplay(device) {
    this.capabilities = {
      canPresent: !!device.display,
      hasExternalDisplay: false,
      hasOrientation: !!device.sensor,
      hasPosition: !!device.sensor && !isMobile
    };

    this.displayId = device.display.hardwareUnitId;

    this.displayName = "";
    var a = device.display.deviceName,
        b = device.sensor.deviceName;
    for (var i = 0; i < a.length && i < b.length && a[i] === b[i]; ++i) {
      this.displayName += a[i];
    }
    while (this.displayName.length > 0 && !/\w/.test(this.displayName[this.displayName.length - 1])) {
      this.displayName = this.displayName.substring(0, this.displayName.length - 1);
    }

    this.isConnected = true;
    this.isPresenting = false;
    this.stageParameters = null;

    this.getEyeParameters = function (side) {
      var oldFormat = null;
      if (device.display.getEyeParameters) {
        oldFormat = device.display.getEyeParameters(side);
      } else {
        oldFormat = {
          renderRect: device.display.getRecommendedEyeRenderRect(side),
          eyeTranslation: device.display.getEyeTranslation(side),
          recommendedFieldOfView: device.display.getRecommendedEyeFieldOfView(side)
        };
      }

      var newFormat = {
        renderWidth: oldFormat.renderRect.width,
        renderHeight: oldFormat.renderRect.height,
        offset: new Float32Array([oldFormat.eyeTranslation.x, oldFormat.eyeTranslation.y, oldFormat.eyeTranslation.z]),
        fieldOfView: oldFormat.recommendedFieldOfView
      };

      return newFormat;
    };
    var frameID = 0;
    function createPoseFromState(state) {
      var pose = {
        timestamp: state.timestamp,
        frameID: ++frameID
      };
      if (state.position) {
        pose.position = new Float32Array([state.position.x, state.position.y, state.position.z]);
      }
      if (state.linearVelocity) {
        pose.linearVelocity = new Float32Array([state.linearVelocity.x, state.linearVelocity.y, state.linearVelocity.z]);
      }
      if (state.linearAcceleration) {
        pose.linearAcceleration = new Float32Array([state.linearAcceleration.x, state.linearAcceleration.y, state.linearAcceleration.z]);
      }
      if (state.orientation) {
        pose.orientation = new Float32Array([state.orientation.x, state.orientation.y, state.orientation.z, state.orientation.w]);
      }
      if (state.angularVelocity) {
        pose.angularVelocity = new Float32Array([state.angularVelocity.x, state.angularVelocity.y, state.angularVelocity.z]);
      }
      if (state.angularAcceleration) {
        pose.angularAcceleration = new Float32Array([state.angularAcceleration.x, state.angularAcceleration.y, state.angularAcceleration.z]);
      }
      return pose;
    }

    this.getImmediatePose = function () {
      return createPoseFromState(device.sensor.getImmediateState());
    };

    this.getPose = function () {
      return createPoseFromState(device.sensor.getState());
    };

    this.resetPose = device.sensor.resetSensor.bind(device.sensor);

    var currentLayer = null;

    this.getLayers = function () {
      return [currentLayer];
    };

    var fullScreenParam = { vrDisplay: device.display, vrDistortion: true };

    this.requestPresent = function (layer) {
      var promises = [];
      if (currentLayer) {
        console.log("need to exit the previous presentation mode, first.");
        promises.push(this.exitPresent());
      }
      promises.push(new Promise(function (resolve, reject) {
        if (!this.capabilities.canPresent) {
          reject(new Error("This device cannot be used as a presentation display. DisplayID: " + this.displayId + ". Name: " + this.displayName));
        } else if (!layer) {
          reject(new Error("No layer provided to requestPresent"));
        } else if (!layer.source) {
          reject(new Error("No source on layer parameter."));
        } else {
          requestFullScreen(layer.source, fullScreenParam).then(function (elem) {
            this.isPresenting = elem === layer.source;
            currentLayer = layer;
            if (isMobile && screen.orientation && screen.orientation.lock) {
              screen.orientation.lock('landscape-primary');
            }
            window.dispatchEvent(new Event("vrdisplaypresentchange"));
            resolve();
          }.bind(this)).catch(function (evt) {
            this.isPresenting = false;
            reject(evt);
          }.bind(this));
        }
      }.bind(this)));
      return Promise.all(promises);
    }.bind(this);

    this.exitPresent = function () {
      return new Promise(function (resolve, reject) {
        if (!this.isPresenting) {
          reject(new Error("Not presenting."));
        } else if (!currentLayer) {
          reject(new Error("Not in control of presentation."));
        } else {
          var clear = function () {
            this.isPresenting = false;
            currentLayer = null;
          }.bind(this);

          exitFullScreen().then(function () {
            clear();
            window.dispatchEvent(new Event("vrdisplaypresentchange"));
            resolve();
          }).catch(function (err) {
            clear();
            reject(err);
          });
        }
      });
    };
  }

  LegacyVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  LegacyVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  LegacyVRDisplay.prototype.submitFrame = function () {};
  return LegacyVRDisplay;
}();
