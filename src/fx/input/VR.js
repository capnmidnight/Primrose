Primrose.Input.VR = (function () {
  pliny.class({
    parent: "Primrose.Input",
    name: "VR",
    description: "| [under construction]"
  });
  pliny.value({
    parent: "Primrose.Input.VR",
    name: "Version",
    type: "Number",
    baseClass: "Primrose.InputProcessor",
    description: "returns the version of WebVR that is supported (if any). Values:\n\
  - 0: no WebVR support\n\
  - 0.1: Device Orientation-based WebVR\n\
  - 0.4: Mozilla-prefixed Legacy WebVR API\n\
  - 0.5: Legacy WebVR API\n\
  - 1.0: Provisional WebVR API 1.0"
  });
  class VR extends Primrose.InputProcessor {
    constructor(commands, socket, elem, selectedIndex) {
      super("VR", commands, socket);
      if (commands === undefined || commands === null) {
        commands = VR.AXES.map(function (a) {
          return {
            name: a,
            axes: [Primrose.Input.VR[a]]
          };
        });
      }

      var listeners = {
        vrdeviceconnected: [],
        vrdevicelost: []
      };

      this.addEventListener = function (event, handler, bubbles) {
        if (listeners[event]) {
          listeners[event].push(handler);
        }
        if (event === "vrdeviceconnected") {
          Object.keys(this.displays).forEach(handler);
        }
      };

      this.displays = [];
      this._transforms = [];
      this.transforms = null;
      this.currentDisplayIndex = -1;
      this.currentPose = null;

      function onConnected(id) {
        for (var i = 0; i < listeners.vrdeviceconnected.length; ++i) {
          listeners.vrdeviceconnected[i](id);
        }
      }

      function enumerateVRDisplays(displays) {
        console.log("Displays found:", displays.length);
        this.displays = displays;
        this.displays.forEach(onConnected);

        if (typeof selectedIndex === "number" && 0 <= selectedIndex && selectedIndex < this.displays.length) {
          this.connect(selectedIndex);
          return this.currentDisplay;
        }
      }

      this.init = function () {
        console.info("Checking for displays...");
        return navigator.getVRDisplays().then(enumerateVRDisplays.bind(this));
      };
    }

    static get Version() {
      if (navigator.getVRDisplays) {
        return 1.0;
      }
      else if (navigator.getVRDevices) {
        return 0.5;
      }
      else if (navigator.mozGetVRDevices) {
        return 0.4;
      }
      else if (isMobile) {
        return 0.1;
      }
      else {
        return 0;
      }
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
      value.set(this.getValue("headRX"),
        this.getValue("headRY"),
        this.getValue("headRZ"),
        this.getValue("headRW"));
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

