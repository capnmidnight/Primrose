Primrose.Input.VR.LegacyVRDisplay = (function () {
  "use strict";

  function makeDisplayName(legacyDisplay, legacySensor) {
    var displayName = "";
    var a = legacyDisplay.deviceName,
      b = legacySensor.deviceName;
    for (var i = 0; i < a.length && i < b.length && a[i] === b[i]; ++i) {
      displayName += a[i];
    }
    while (displayName.length > 0 && !/\w/.test(displayName[displayName.length - 1])) {
      displayName = displayName.substring(0, displayName.length - 1);
    }
    return displayName;
  }

  var frameID = 0;
  function createPoseFromState(state) {
    var pose = {
      timestamp: state.timestamp,
      frameID: ++frameID,
      position: null,
      linearVelocity: null,
      linearAcceleration: null,
      orientation: null,
      angularVelocity: null,
      angularAcceleration: null
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

  class LegacyVRDisplay extends Primrose.Input.VRDisplayPolyfill {

    constructor(legacyDisplay, legacySensor) {
      super(!!legacyDisplay, !!legacySensor, !!legacySensor, legacyDisplay.hardwareUnitId, makeDisplayName(legacyDisplay, legacySensor));


      this.getEyeParameters = function (side) {
        var oldFormat = null;
        if (legacyDisplay.getEyeParameters) {
          oldFormat = legacyDisplay.getEyeParameters(side);
        }
        else {
          oldFormat = {
            renderRect: legacyDisplay.getRecommendedEyeRenderRect(side),
            eyeTranslation: legacyDisplay.getEyeTranslation(side),
            recommendedFieldOfView: legacyDisplay.getRecommendedEyeFieldOfView(side)
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

      this.getImmediatePose = function () {
        return createPoseFromState(legacySensor.getImmediateState());
      };

      this.getPose = function () {
        return createPoseFromState(legacySensor.getState());
      };

      this.resetPose = legacySensor.resetSensor.bind(legacySensor);

      this._requestPresent = (layers) => {
        return FullScreen.request(layers[0].source, {
          vrDisplay: legacyDisplay,
          vrDistortion: true
        });
      };
    }
  };
  return LegacyVRDisplay;
})();