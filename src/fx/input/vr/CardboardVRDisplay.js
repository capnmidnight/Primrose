Primrose.Input.VR.CardboardVRDisplay = (function () {
  function CardboardVRDisplay() {
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
      }
      else {
        console.warn("no layer");
      }
    };

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

    this.getLayers = function () {
      return [currentLayer];
    };

    this._onFullScreenRemoved = () => {
      console.log("exiting cardboard presentation");
      FullScreen.removeChangeListener(this._onFullScreenRemoved);
      this.exitPresent();
    };

    this.requestPresent = (layer) => {
      console.log("requestPresent");
      return new Promise((resolve, reject) => {
        if (!this.capabilities.canPresent) {
          reject(new Error("This device cannot be used as a presentation display. DisplayID: " + this.displayId + ". Name: " + this.displayName));
        }
        else if (!layer) {
          reject(new Error("No layer provided to requestPresent"));
        }
        else if (!layer.source) {
          reject(new Error("No source on layer parameter."));
        }
        else {
          FullScreen.request(layer.source)
            .then((elem) => {
              this.isPresenting = elem === layer.source;
              currentLayer = layer;
              FullScreen.addChangeListener(this._onFullScreenRemoved, false);
              resolve();
            })
            .catch((evt) => {
              this.isPresenting = false;
              reject(evt);
            });
        }
      });
    };

    this.exitPresent = function () {
      var clear = () => {
        console.log("exit presenting", this);
        this.isPresenting = false;
        currentLayer = null;
      };
      return FullScreen.exit()
        .then(function (elem) {
          clear();
          return elem;
        })
        .catch(clear);
    };
  }

  CardboardVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  CardboardVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  CardboardVRDisplay.prototype.submitFrame = function () {
  };

  return CardboardVRDisplay;
})();