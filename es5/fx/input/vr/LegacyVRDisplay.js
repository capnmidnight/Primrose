"use strict";

Primrose.Input.VR.LegacyVRDisplay = function () {
  function LegacyVRDisplay(device) {
    var _this = this;

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

    this._onFullScreenRemoved = function () {
      FullScreen.removeChangeListener(_this._onFullScreenRemoved);
      _this.exitPresent();
    };

    this.requestPresent = function (layer) {
      return new Promise(function (resolve, reject) {
        if (!_this.capabilities.canPresent) {
          reject(new Error("This device cannot be used as a presentation display. DisplayID: " + _this.displayId + ". Name: " + _this.displayName));
        } else if (!layer) {
          reject(new Error("No layer provided to requestPresent"));
        } else if (!layer.source) {
          reject(new Error("No source on layer parameter."));
        } else {
          FullScreen.request(layer.source, { vrDisplay: device.display }).then(function (elem) {
            _this.isPresenting = elem === layer.source;
            currentLayer = layer;
            FullScreen.addChangeListener(_this._onFullScreenRemoved, false);
            resolve();
            return elem;
          }).catch(function (evt) {
            _this.isPresenting = false;
            reject(evt);
          });
        }
      });
    };

    this.exitPresent = function () {
      var _this2 = this;

      var clear = function clear(elem) {
        _this2.isPresenting = false;
        currentLayer = null;
        return elem;
      };
      return FullScreen.exit().then(clear).catch(clear);
    };
  }

  LegacyVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  LegacyVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  LegacyVRDisplay.prototype.submitFrame = function () {};
  return LegacyVRDisplay;
}();
