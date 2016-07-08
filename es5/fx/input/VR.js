"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.VR = function () {
  "use strict";

  var SLERP_A = isMobile ? 0.1 : 0,
      SLERP_B = 1 - SLERP_A,
      tempQuat = [];
  pliny.class({
    parent: "Primrose.Input",
    name: "VR",
    baseClass: "Primrose.InputProcessor",
    parameters: [{ name: "commands", type: "Array", optional: true, description: "An array of input command descriptions." }, { name: "socket", type: "WebSocket", optional: true, description: "A socket over which to transmit device state for device fusion." }],
    description: "An input manager for gamepad devices."
  });

  var VR = function (_Primrose$InputProces) {
    _inherits(VR, _Primrose$InputProces);

    function VR(commands, socket) {
      _classCallCheck(this, VR);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VR).call(this, "VR", commands, socket));

      _this.displays = null;
      _this._transforms = [];
      _this.transforms = null;
      _this.currentDisplayIndex = -1;
      _this.currentPose = {
        position: [0, 0, 0],
        orientation: [0, 0, 0, 1]
      };

      console.info("Checking for displays...");
      _this.ready = navigator.getVRDisplays().then(function (displays) {
        console.log("Displays found:", displays.length);
        _this.displays = displays;
        return _this.displays;
      });
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
          this.currentPose = this.currentDisplay.getPose() || this.currentPose;
        }
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(value) {
        value = value || new THREE.Quaternion();
        var o = this.currentPose && this.currentPose.orientation;
        if (o) {
          value.toArray(tempQuat);
          for (var i = 0; i < o.length; ++i) {
            tempQuat[i] = tempQuat[i] * SLERP_A + o[i] * SLERP_B;
          }
          value.fromArray(tempQuat);
        }
        return value;
      }
    }, {
      key: "getPosition",
      value: function getPosition(value) {
        value = value || new THREE.Vector3();
        var p = this.currentPose && this.currentPose.position;
        if (p) {
          value.fromArray(p);
        }
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
    }]);

    return VR;
  }(Primrose.InputProcessor);

  return VR;
}();