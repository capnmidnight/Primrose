import pliny from "pliny/pliny";

import Player from "../Replay/Player";

export default class MockVRDisplay {
  constructor(data) {

    var timestamp = null,
      displayName = null,
      startOn = null;

    Object.defineProperties(this, {
      displayName: {
        get: () => "Mock " + displayName,
        set: (v) => displayName = v
      }
    });

    const dataPack = {
      currentDisplay: this,
      currentEyeParams: {
        left: {
          fieldOfView: {
            downDegrees: null,
            leftDegrees: null,
            rightDegrees: null,
            upDegrees: null
          },
          renderWidth: null,
          renderHeight: null,
          offset: null
        },
        right: {
          fieldOfView: {
            downDegrees: null,
            leftDegrees: null,
            rightDegrees: null,
            upDegrees: null
          },
          renderWidth: null,
          renderHeight: null,
          offset: null
        }
      },
      currentPose: {
        timestamp: null,
        orientation: null,
        position: null
      }
    };

    Object.defineProperties(dataPack.currentPose, {
      timestamp: {
        get: () => timestamp,
        set: (v) => timestamp = v
      },
      timeStamp: {
        get: () => timestamp,
        set: (v) => timestamp = v
      }
    });

    const player = new Player(dataPack);
    player.load(data);
    player.update(0);

    this.requestAnimationFrame = (thunk) => window.requestAnimationFrame((t) => {
      if (startOn === null) {
        startOn = t;
      }
      player.update(t - startOn);
      thunk(t);
    });

    this.getPose = () => dataPack.currentPose;
    this.getEyeParameters = (side) => dataPack.currentEyeParams[side];
  }


  cancelAnimationFrame(handle) {
    window.cancelAnimationFrame(handle);
  }
};
