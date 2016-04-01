"use strict";

Primrose.Input.VR.CardboardVRDisplay = function () {
  function CardboardVRDisplay() {
    var _this = this;

    this.capabilities = {
      canPresent: true,
      hasExternalDisplay: false,
      hasOrientation: true,
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
      if (currentLayer) {
        var dEye = side === "left" ? -1 : 1;

        return {
          renderWidth: Math.floor(currentLayer.source.width / 2),
          renderHeight: currentLayer.source.height,
          offset: new Float32Array([dEye * 0.034, 0, 0]),
          fieldOfView: {
            upDegrees: 22.5,
            downDegrees: 22.5,
            leftDegrees: 45,
            rightDegrees: 45
          }
        };
      } else {
        console.warn("no layer");
      }
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
    };

    this.requestPresent = function (layer) {
      console.log("requestPresent");
      return new Promise(function (resolve, reject) {
        if (!_this.capabilities.canPresent) {
          reject(new Error("This device cannot be used as a presentation display. DisplayID: " + _this.displayId + ". Name: " + _this.displayName));
        } else if (!layer) {
          reject(new Error("No layer provided to requestPresent"));
        } else if (!layer.source) {
          reject(new Error("No source on layer parameter."));
        } else {
          FullScreen.request(layer.source).then(function (elem) {
            _this.isPresenting = elem === layer.source;
            currentLayer = layer;
            FullScreen.addChangeListener(_this._onFullScreenRemoved, false);
            resolve();
          }).catch(function (evt) {
            _this.isPresenting = false;
            reject(evt);
          });
        }
      });
    };

    this.exitPresent = function () {
      var _this2 = this;

      var clear = function clear() {
        console.log("exit presenting", _this2);
        _this2.isPresenting = false;
        currentLayer = null;
      };
      return FullScreen.exit().then(function (elem) {
        clear();
        return elem;
      }).catch(clear);
    };
  }

  CardboardVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  CardboardVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  CardboardVRDisplay.prototype.submitFrame = function () {};

  return CardboardVRDisplay;
}();
