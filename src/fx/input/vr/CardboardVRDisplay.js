Primrose.Input.VR.CardboardVRDisplay = (function () {
  function CardboardVRDisplay() {
    this.capabilities = {
      canPresent: true,
      hasExternalDisplay: true,
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
      }
      else {
        console.warn("no layer");
      }
    };

    corrector.addEventListener("deviceorientation", function (evt) {
      currentPose = {
        timestamp: performance.now(),
        frameID: ++frameID,
        orientation: new Float32Array(evt.toArray())
      };
    }.bind(this));

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

    this.requestPresent = function (layer) {
      var promises = [];
      if (currentLayer) {
        console.log("need to exit the previous presentation mode, first.");
        promises.push(this.exitPresent());
      }
      promises.push(new Promise(function (resolve, reject) {
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
          requestFullScreen(layer.source)
            .then(function (elem) {
              this.isPresenting = elem === layer.source;
              currentLayer = layer;
              if (isMobile) {
                if (screen.orientation && screen.orientation.lock) {
                  screen.orientation.lock("landscape-primary");
                }
                else if (screen.mozLockOrientation) {
                  screen.mozLockOrientation("landscape-primary");
                }
              }
              resolve();
            }.bind(this))
            .catch(function (evt) {
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
          console.warn("Wasn't presenting.");
        }
        if (!currentLayer) {
          reject(new Error("Not in control of presentation."));
        }
        else {
          var clear = function () {
            this.isPresenting = false;
            currentLayer = null;
          }.bind(this);

          exitFullScreen()
            .then(function () {
              clear();
              resolve();
            })
            .catch(function (err) {
              clear();
              reject(err);
            });
        }
      });
    };
  }

  CardboardVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  CardboardVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  CardboardVRDisplay.prototype.submitFrame = function () {
  };

  return CardboardVRDisplay;
})();