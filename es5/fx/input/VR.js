"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.VR = function () {
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

  var VR = function (_Primrose$InputProces) {
    _inherits(VR, _Primrose$InputProces);

    function VR(commands, socket, elem, selectedIndex) {
      _classCallCheck(this, VR);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VR).call(this, "VR", commands, socket));

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

      _this.addEventListener = function (event, handler, bubbles) {
        if (listeners[event]) {
          listeners[event].push(handler);
        }
        if (event === "vrdeviceconnected") {
          Object.keys(this.displays).forEach(handler);
        }
      };

      _this.displays = [];
      _this._transforms = [];
      _this.transforms = null;
      _this.currentDisplayIndex = -1;
      _this.currentPose = null;

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

      _this.init = function () {
        console.info("Checking for displays...");
        return navigator.getVRDisplays().then(enumerateVRDisplays.bind(this));
      };
      return _this;
    }

    _createClass(VR, [{
      key: "requestPresent",
      value: function requestPresent(opts) {
        if (!this.currentDisplay) {
          return Promise.reject("No display");
        } else {
          return this.currentDisplay.requestPresent(opts).then(function (elem) {
            return elem || opts[0].source;
          });
        }
      }
    }, {
      key: "poll",
      value: function poll() {
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
    }, {
      key: "getOrientation",
      value: function getOrientation(value) {
        value = value || new THREE.Quaternion();
        value.set(this.getValue("headRX"), this.getValue("headRY"), this.getValue("headRZ"), this.getValue("headRW"));
        return value;
      }
    }, {
      key: "resetTransforms",
      value: function resetTransforms(near, far) {
        if (this.currentDisplay) {
          if (!this._transforms[this.currentDisplayIndex]) {
            this._transforms[this.currentDisplayIndex] = new ViewCameraTransform(this.currentDisplay);
          }
          this.transforms = this._transforms[this.currentDisplayIndex].getTransforms(near, far);
        }
      }
    }, {
      key: "connect",
      value: function connect(selectedIndex) {
        this.currentPose = null;
        this.currentDisplayIndex = selectedIndex;
      }
    }, {
      key: "currentDisplay",
      get: function get() {
        return this.displays[this.currentDisplayIndex];
      }
    }], [{
      key: "Version",
      get: function get() {
        if (navigator.getVRDisplays) {
          return 1.0;
        } else if (navigator.getVRDevices) {
          return 0.5;
        } else if (navigator.mozGetVRDevices) {
          return 0.4;
        } else if (isMobile) {
          return 0.1;
        } else {
          return 0;
        }
      }
    }]);

    return VR;
  }(Primrose.InputProcessor);

  Primrose.InputProcessor.defineAxisProperties(VR, ["headX", "headY", "headZ", "headVX", "headVY", "headVZ", "headAX", "headAY", "headAZ", "headRX", "headRY", "headRZ", "headRW", "headRVX", "headRVY", "headRVZ", "headRAX", "headRAY", "headRAZ"]);

  return VR;
}();