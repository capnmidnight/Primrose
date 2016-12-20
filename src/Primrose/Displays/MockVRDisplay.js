function MockVRDisplay(data) {

  var timestamp = null,
    displayName = null,
    startOn = null;

  Object.defineProperties(this, {
    displayName: {
      get: () => "Mock " + displayName + " (replay-telemetry-webvr)",
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

  const player = new Replay.Player(dataPack);
  player.load(data);
  player.update(0);

  this.requestAnimationFrame = (thunk) => requestAnimationFrame((t) => {
    if (startOn === null) {
      startOn = t;
    }
    player.update(t - startOn);
    thunk(t);
  });
  this.cancelAnimationFrame = (handle) => cancelAnimationFrame(handle);
  this.getImmediatePose = () => dataPack.currentPose;
  this.getPose = () => dataPack.currentPose;
  this.getEyeParameters = (side) => dataPack.currentEyeParams[side];
  this.resetPose = () => {};
}