Primrose.Input.VR = (function () {
  "use strict";
  
  const SLERP_A = isMobile ? 0.1 : 0,
    SLERP_B = 1 - SLERP_A;
  pliny.class({
    parent: "Primrose.Input",
    name: "VR",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });
  class VR extends Primrose.InputProcessor {
    constructor(commands, socket) {
      super("VR", commands, socket);
      if (commands === undefined || commands === null) {
        commands = VR.AXES.map(function (a) {
          return {
            name: a,
            axes: [Primrose.Input.VR[a]]
          };
        });
      }

      this.displays = null;
      this._transforms = [];
      this.transforms = null;
      this.currentDisplayIndex = -1;
      this.currentPose = null;

      console.info("Checking for displays...");
      this.ready = navigator.getVRDisplays().then((displays) => {
        console.log("Displays found:", displays.length);
        this.displays = displays;
        return this.displays;
      });
    }

    requestPresent(opts) {
      if (!this.currentDisplay) {
        return Promise.reject("No display");
      }
      else {
        return this.currentDisplay.requestPresent(opts)
          .then((elem) => elem || opts[0].source);
      }
    }

    poll() {
      if (this.currentDisplay) {
        var pose = this.currentDisplay.getPose();
        if (pose) {
          this.currentPose = pose;

          if (pose.position) {
            this.headX = pose.position[0];
            this.headY = pose.position[1];
            this.headZ = pose.position[2];
          }
          if (pose.linearVelocity) {
            this.headVX = pose.linearVelocity[0];
            this.headVY = pose.linearVelocity[1];
            this.headVZ = pose.linearVelocity[2];
          }
          if (pose.linearAcceleration) {
            this.headAX = pose.linearAcceleration[0];
            this.headAY = pose.linearAcceleration[1];
            this.headAZ = pose.linearAcceleration[2];
          }

          if (pose.orientation) {
            this.headRX = pose.orientation[0];
            this.headRY = pose.orientation[1];
            this.headRZ = pose.orientation[2];
            this.headRW = pose.orientation[3];
          }
          if (pose.angularVelocity) {
            this.headRVX = pose.angularVelocity[0];
            this.headRVY = pose.angularVelocity[1];
            this.headRVZ = pose.angularVelocity[2];
          }
          if (pose.angularAcceleration) {
            this.headRAX = pose.angularAcceleration[0];
            this.headRAY = pose.angularAcceleration[1];
            this.headRAZ = pose.angularAcceleration[2];
          }
        }
      }
    }

    getOrientation(value) {
      value = value || new THREE.Quaternion();
      var x = this.getValue("headRX"),
        y = this.getValue("headRY"),
        z = this.getValue("headRZ"),
        w = this.getValue("headRW");
      
      value.set(
        value.x * SLERP_A + x * SLERP_B,
        value.y * SLERP_A + y * SLERP_B,
        value.z * SLERP_A + z * SLERP_B,
        value.w * SLERP_A + w * SLERP_B);
      return value;
    }

    resetTransforms(near, far) {
      if (this.currentDisplay) {
        if (!this._transforms[this.currentDisplayIndex]) {
          this._transforms[this.currentDisplayIndex] = new ViewCameraTransform(this.currentDisplay);
        }
        this.transforms = this._transforms[this.currentDisplayIndex].getTransforms(near, far);
      }
    }

    get currentDisplay() {
      return this.displays[this.currentDisplayIndex];
    }

    connect(selectedIndex) {
      this.currentPose = null;
      this.currentDisplayIndex = selectedIndex;
    }
  }


  Primrose.InputProcessor.defineAxisProperties(VR, [
    "headX", "headY", "headZ",
    "headVX", "headVY", "headVZ",
    "headAX", "headAY", "headAZ",
    "headRX", "headRY", "headRZ", "headRW",
    "headRVX", "headRVY", "headRVZ",
    "headRAX", "headRAY", "headRAZ"
  ]);

  return VR;
})();

