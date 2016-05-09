Primrose.Input.VR.CardboardVRDisplay = (function () {
  "use strict";
  class CardboardVRDisplay extends Primrose.Input.VRDisplayPolyfill {
    constructor() {
      super(true, isMobile, false, "B4CEAE28-1A89-4314-872E-9C223DDABD02", "Device Motion API");

      var corrector = new Primrose.Input.VR.MotionCorrector(),
        currentPose = null,
        frameID = 0;

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

      this._requestPresent = (layers) => {
        return FullScreen.request(layers[0].source);
      };
    }
  }

  CardboardVRDisplay.SUPERSAMPLE = 1;

  return CardboardVRDisplay;
})();