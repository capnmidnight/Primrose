Primrose.Input.VR.LegacyVRDisplay = (function () {
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
      }
      else {
        oldFormat = {
          renderRect: device.display.getRecommendedEyeRenderRect(side),
          eyeTranslation: device.display.getEyeTranslation(side),
          recommendedFieldOfView: device.display.getRecommendedEyeFieldOfView(side)
        };
      }

      var newFormat = {
        renderWidth: oldFormat.renderRect.width,
        renderHeight: oldFormat.renderRect.height,
        offset: new Float32Array([
          oldFormat.eyeTranslation.x,
          oldFormat.eyeTranslation.y,
          oldFormat.eyeTranslation.z
        ]),
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
        pose.position = new Float32Array([
          state.position.x,
          state.position.y,
          state.position.z
        ]);
      }
      if (state.linearVelocity) {
        pose.linearVelocity = new Float32Array([
          state.linearVelocity.x,
          state.linearVelocity.y,
          state.linearVelocity.z
        ]);
      }
      if (state.linearAcceleration) {
        pose.linearAcceleration = new Float32Array([
          state.linearAcceleration.x,
          state.linearAcceleration.y,
          state.linearAcceleration.z
        ]);
      }
      if (state.orientation) {
        pose.orientation = new Float32Array([
          state.orientation.x,
          state.orientation.y,
          state.orientation.z,
          state.orientation.w
        ]);
      }
      if (state.angularVelocity) {
        pose.angularVelocity = new Float32Array([
          state.angularVelocity.x,
          state.angularVelocity.y,
          state.angularVelocity.z
        ]);
      }
      if (state.angularAcceleration) {
        pose.angularAcceleration = new Float32Array([
          state.angularAcceleration.x,
          state.angularAcceleration.y,
          state.angularAcceleration.z
        ]);
      }
      return pose;
    }

    if (isGearVR) {
      var corrector = new Primrose.Input.VR.MotionCorrector(),
        currentPose = null;

      corrector.addEventListener("deviceorientation", (evt) => {
        currentPose = {
          timestamp: performance.now(),
          frameID: ++frameID,
          orientation: new Float32Array(evt.toArray())
        };
      });

      this.getImmediatePose = function () {
        return currentPose;
      };

      this.getPose = function () {
        return currentPose;
      };

      this.resetPose = corrector.zeroAxes.bind(corrector);
    }
    else {
      this.getImmediatePose = function () {
        return createPoseFromState(device.sensor.getImmediateState());
      };

      this.getPose = function () {
        return createPoseFromState(device.sensor.getState());
      };

      this.resetPose = device.sensor.resetSensor.bind(device.sensor);
    }

    var currentLayer = null;

    this.getLayers = function () {
      return [currentLayer];
    };

    this._onFullScreenRemoved = () => {
      FullScreen.removeChangeListener(this._onFullScreenRemoved);
      this.exitPresent();
    };

    this.requestPresent = (layer) => {
      if (!this.capabilities.canPresent) {
        return Promise.reject(new Error("This device cannot be used as a presentation display. DisplayID: " + this.displayId + ". Name: " + this.displayName));
      }
      else if (!layer) {
        return Promise.reject(new Error("No layer provided to requestPresent"));
      }
      else if (!layer.source) {
        return Promise.reject(new Error("No source on layer parameter."));
      }
      else {
        return FullScreen.request(layer.source, { vrDisplay: device.display })
          .then((elem) => {
            this.isPresenting = elem === layer.source;
            currentLayer = layer;
            FullScreen.addChangeListener(this._onFullScreenRemoved, false);
            return elem;
          })
          .catch((evt) => {
            this.isPresenting = false;
            return evt;
          });
      }
    };

    this.exitPresent = function () {
      var clear = (elem) => {
        this.isPresenting = false;
        currentLayer = null;
        return elem;
      };
      return FullScreen.exit()
        .then(clear)
        .catch(clear);
    };
  }

  LegacyVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  LegacyVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  LegacyVRDisplay.prototype.submitFrame = function () {
  };
  return LegacyVRDisplay;
})();