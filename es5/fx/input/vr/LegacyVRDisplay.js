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
      window.dispatchEvent(new Event("vrdisplaypresentchange"));
    };

    this.requestPresent = function (layers) {
      if (!_this.capabilities.canPresent) {
        return Promrise.reject(new Error("This device cannot be used as a presentation display. DisplayID: " + _this.displayId + ". Name: " + _this.displayName));
      } else if (!layers) {
        return Promise.reject(new Error("No layers provided to requestPresent"));
      } else if (!(layers instanceof Array)) {
        return Promise.reject(new Error("Layers parameters must be an array"));
      } else if (layers.length !== 1) {
        return Promise.reject(new Error("Only one layer at a time is supported right now."));
      } else if (!layers[0].source) {
        return Promise.reject(new Error("No source on layer parameter."));
      } else {
        return FullScreen.request(layers[0].source, {
          vrDisplay: device.display,
          vrDistortion: true
        }).then(function (elem) {
          currentLayer = layers[0];
          _this.isPresenting = elem === currentLayer.source;
          FullScreen.addChangeListener(_this._onFullScreenRemoved, false);
          window.dispatchEvent(new Event("vrdisplaypresentchange"));
          return elem;
        });
      }
    };

    this.exitPresent = function () {
      var _this2 = this;

      var clear = function clear(err) {
        if (err) {
          console.error(err);
        }
        console.log("exit presenting");
        _this2.isPresenting = false;
        currentLayer = null;
      };
      return FullScreen.exit().then(function (elem) {
        clear();
        return elem;
      }).catch(clear);
    };
  }

  LegacyVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  LegacyVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  LegacyVRDisplay.prototype.submitFrame = function () {};
  return LegacyVRDisplay;
}();