import Player from "../Replay/Player";

import PolyfilledVRDisplay from "./PolyfilledVRDisplay";

export default class MockVRDisplay extends PolyfilledVRDisplay {
  constructor(data) {
    super("Test Data Playback");
    let timestamp = null,
      displayName = null,
      startOn = null;

    Object.defineProperties(this, {
      displayName: {
        get: () => "Test Data Playback: " + displayName,
        set: (v) => displayName = v
      }
    });

    this._dataPack = {
      currentDisplay: this,
      currentEyeParams: {
        left: {
          renderWidth: null,
          renderHeight: null,
          offset: null
        },
        right: {
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

    Object.defineProperties(this._dataPack.currentPose, {
      timestamp: {
        get: () => timestamp,
        set: (v) => timestamp = v
      },
      timeStamp: {
        get: () => timestamp,
        set: (v) => timestamp = v
      }
    });

    const player = new Player(this._dataPack);
    player.load(data);
    player.update(0);

    this.requestAnimationFrame = (thunk) => window.requestAnimationFrame((t) => {
      if (startOn === null) {
        startOn = t;
      }
      player.update(t - startOn);
      thunk(t);
    });

    this.getEyeParameters = (side) => this._dataPack.currentEyeParams[side];
  }

  get isMockVRDisplay() {
    return true;
  }

  get isStereo() {
    return false;
  }

  _getPose() {
    return this._dataPack.currentPose;
  }

  cancelAnimationFrame(handle) {
    window.cancelAnimationFrame(handle);
  }
};
