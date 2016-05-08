"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.VR = function () {

  function makeTransform(s, eye, near, far) {
    var t = eye.offset;
    s.translation = new THREE.Matrix4().makeTranslation(t[0], t[1], t[2]);
    s.projection = fieldOfViewToProjectionMatrix(eye.fieldOfView, near, far);
    s.viewport = {
      left: 0,
      top: 0,
      width: eye.renderWidth,
      height: eye.renderHeight
    };
  }

  function fieldOfViewToProjectionMatrix(fov, zNear, zFar) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI / 180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan),
        matrix = new THREE.Matrix4();

    matrix.elements[0] = xScale;
    matrix.elements[1] = 0.0;
    matrix.elements[2] = 0.0;
    matrix.elements[3] = 0.0;
    matrix.elements[4] = 0.0;
    matrix.elements[5] = yScale;
    matrix.elements[6] = 0.0;
    matrix.elements[7] = 0.0;
    matrix.elements[8] = -((leftTan - rightTan) * xScale * 0.5);
    matrix.elements[9] = (upTan - downTan) * yScale * 0.5;
    matrix.elements[10] = -(zNear + zFar) / (zFar - zNear);
    matrix.elements[11] = -1.0;
    matrix.elements[12] = 0.0;
    matrix.elements[13] = 0.0;
    matrix.elements[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
    matrix.elements[15] = 0.0;

    return matrix;
  }

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
      _this.currentDisplay = null;
      _this.currentPose = null;
      _this.transforms = null;

      function onConnected(id) {
        for (var i = 0; i < listeners.vrdeviceconnected.length; ++i) {
          listeners.vrdeviceconnected[i](id);
        }
      }

      function enumerateVRDisplays(elem, displays) {
        console.log("Displays found:", displays.length);
        this.displays = displays;
        this.displays.forEach(onConnected);

        if (typeof selectedIndex === "number" && 0 <= selectedIndex && selectedIndex < this.displays.length) {
          this.connect(selectedIndex);
          return this.currentDisplay;
        }
      }

      function enumerateLegacyVRDevices(elem, devices) {
        console.log("Devices found:", devices.length);
        var displays = {},
            id = null;

        for (var i = 0; i < devices.length; ++i) {
          var device = devices[i];
          id = device.hardwareUnitId;
          if (!displays[id]) {
            displays[id] = {};
          }

          var display = displays[id];
          if (device instanceof HMDVRDevice) {
            display.display = device;
          } else if (devices[i] instanceof PositionSensorVRDevice) {
            display.sensor = device;
          }
        }

        var mockedLegacyDisplays = [];
        for (id in displays) {
          mockedLegacyDisplays.push(new Primrose.Input.VR.LegacyVRDisplay(displays[id]));
        }

        return enumerateVRDisplays.call(this, elem, mockedLegacyDisplays);
      }

      function createCardboardVRDisplay(elem) {
        var mockedCardboardDisplays = [new Primrose.Input.VR.CardboardVRDisplay()];
        return enumerateVRDisplays.call(this, elem, mockedCardboardDisplays);
      }

      _this.init = function () {
        var _this2 = this;

        console.info("Checking for VR Displays...");
        if (navigator.getVRDisplays) {
          console.info("Using WebVR API 1");
          return navigator.getVRDisplays().then(enumerateVRDisplays.bind(this, elem));
        } else if (navigator.getVRDevices) {
          console.info("Using Chromium Experimental WebVR API");
          return navigator.getVRDevices().then(enumerateLegacyVRDevices.bind(this, elem)).catch(console.error.bind(console, "Could not find VR devices"));
        } else {
          return new Promise(function (resolve, reject) {
            var timer = setTimeout(reject, 1000);
            var waitForValidMotion = function waitForValidMotion(evt) {
              if (evt.alpha) {
                clearTimeout(timer);
                timer = null;
                window.removeEventListener("deviceorientation", waitForValidMotion);
                console.info("Using Device Motion API");
                resolve(createCardboardVRDisplay.call(_this2, elem));
              }
            };
            console.info("Your browser doesn't have WebVR capability. Check out http://mozvr.com/. We're still going to try for Device Motion API, but there is no way to know ahead of time if your device has a motion sensor.");
            window.addEventListener("deviceorientation", waitForValidMotion, false);
          });
        }
      };
      return _this;
    }

    _createClass(VR, [{
      key: "requestPresent",
      value: function requestPresent(opts) {
        if (!this.currentDisplay) {
          return Promise.reject("No display");
        } else {
          return this.currentDisplay.requestPresent(VR.Version === 1 && isMobile ? opts[0] : opts).then(function (elem) {
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
          this.enabled = true;
          var params = {
            left: this.currentDisplay.getEyeParameters("left"),
            right: this.currentDisplay.getEyeParameters("right")
          };
          var transforms = [{}, {}];
          makeTransform(transforms[0], params.left, near, far);
          makeTransform(transforms[1], params.right, near, far);
          transforms[1].viewport.left = transforms[0].viewport.width;
          this.transforms = transforms;
        }
      }
    }, {
      key: "connect",
      value: function connect(selectedIndex) {
        this.currentDisplay = this.displays[selectedIndex];
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