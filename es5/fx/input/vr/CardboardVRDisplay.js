"use strict";

Primrose.Input.VR.CardboardVRDisplay = function () {
  function CardboardVRDisplay() {
    var _this = this;

    this.capabilities = {
      canPresent: true,
      hasExternalDisplay: false,
      hasOrientation: isMobile,
      hasPosition: false
    };

    var corrector = new Primrose.Input.VR.MotionCorrector(),
        currentPose = null,
        frameID = 0,
        currentLayer = null;

    this.displayId = "B4CEAE28-1A89-4314-872E-9C223DDABD02";
    this.displayName = "Device Motion API";
    this.isConnected = true;
    this.isPresenting = false;
    this.stageParameters = null;

    this.getEyeParameters = function (side) {
      var dEye = side === "left" ? -1 : 1;

      return {
        renderWidth: Math.floor(screen.width * devicePixelRatio / 2) * CardboardVRDisplay.SUPERSAMPLE,
        renderHeight: screen.height * devicePixelRatio * CardboardVRDisplay.SUPERSAMPLE,
        offset: new Float32Array([dEye * 0.03, 0, 0]),
        fieldOfView: {
          upDegrees: 40,
          downDegrees: 40,
          leftDegrees: 40,
          rightDegrees: 40
        }
      };
    };

    corrector.addEventListener("deviceorientation", function (evt) {
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

    this.getLayers = function () {
      return [currentLayer];
    };

    this._onFullScreenRemoved = function () {
      console.log("exiting cardboard presentation");
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
        return FullScreen.request(layers[0].source).then(function (elem) {
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

  CardboardVRDisplay.SUPERSAMPLE = 1;

  CardboardVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  CardboardVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  CardboardVRDisplay.prototype.submitFrame = function () {};

  return CardboardVRDisplay;
}();