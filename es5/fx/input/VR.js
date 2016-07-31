"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.VR = function () {
  "use strict";

  var DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  },
      GAZE_LENGTH = 3000;
  pliny.class({
    parent: "Primrose.Input",
    name: "VR",
    baseClass: "Primrose.PoseInputProcessor",
    parameters: [{
      name: "commands",
      type: "Array",
      optional: true,
      description: "An array of input command descriptions."
    }, {
      name: "socket",
      type: "WebSocket",
      optional: true,
      description: "A socket over which to transmit device state for device fusion."
    }],
    description: "An input manager for gamepad devices."
  });

  var VR = function (_Primrose$PoseInputPr) {
    _inherits(VR, _Primrose$PoseInputPr);

    function VR(avatarHeight, parent, socket) {
      _classCallCheck(this, VR);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VR).call(this, "VR", parent, null, socket));

      _this.displays = [];
      _this._transformers = [];
      _this.currentDeviceIndex = -1;
      _this.movePlayer = new THREE.Matrix4();
      _this.defaultAvatarHeight = avatarHeight;
      _this.stage = null;
      _this.lastStageWidth = null;
      _this.lastStageDepth = null;

      console.info("Checking for displays...");
      _this.ready = navigator.getVRDisplays().then(function (displays) {
        console.log("Displays found:", displays.length);
        _this.displays.push.apply(_this.displays, displays);
        return _this.displays;
      });
      return _this;
    }

    _createClass(VR, [{
      key: "connect",
      value: function connect(selectedIndex) {
        this.currentDevice = null;
        this.currentDeviceIndex = selectedIndex;
        if (0 <= selectedIndex && selectedIndex <= this.displays.length) {
          this.currentDevice = this.displays[selectedIndex];
          var params = this.currentDevice.getEyeParameters("left"),
              fov = params.fieldOfView;
          this.rotationAngle = Math.PI * (fov.leftDegrees + fov.rightDegrees) / 360;
        }
      }
    }, {
      key: "requestPresent",
      value: function requestPresent(opts) {
        if (!this.currentDevice) {
          return Promise.reject("No display");
        } else {
          var layers = opts;
          if (!(layers instanceof Array)) {
            layers = [layers];
          }

          if (this.isNativeMobileWebVR) {
            layers = layers[0];
          }

          var promise = this.currentDevice.requestPresent(layers).catch(function (exp) {
            return console.warn("what happened?", exp);
          }).then(function (elem) {
            return elem || opts[0].source;
          }).then(function (elem) {
            return PointerLock.request(elem).catch(function (exp) {
              return console.warn(exp);
            });
          });

          if (this.isNativeMobileWebVR) {
            promise = promise.then(Orientation.lock).catch(function (exp) {
              return console.warn(exp);
            });
          }

          return promise;
        }
      }
    }, {
      key: "cancel",
      value: function cancel() {
        var _this2 = this;

        var promise = null;
        if (this.isPresenting) {
          promise = this.currentDevice.exitPresent();
        } else {
          promise = Promise.resolve();
        }

        if (this.isNativeMobileWebVR) {
          promise = promise.then(Orientation.unlock);
        }

        return promise.then(PointerLock.exit).then(function () {
          return _this2.connect(0);
        });
      }
    }, {
      key: "zero",
      value: function zero() {
        _get(Object.getPrototypeOf(VR.prototype), "zero", this).call(this);
        if (this.currentDevice) {
          this.currentDevice.resetPose();
        }
      }
    }, {
      key: "update",
      value: function update(dt) {
        _get(Object.getPrototypeOf(VR.prototype), "update", this).call(this, dt);

        var x = 0,
            z = 0;
        var stage = this.currentDevice && this.currentDevice.stageParameters;
        if (stage) {
          this.movePlayer.fromArray(stage.sittingToStandingTransform);
          x = stage.sizeX;
          z = stage.sizeZ;
        } else {
          this.movePlayer.makeTranslation(0, this.defaultAvatarHeight, 0);
        }

        var s = {
          matrix: this.movePlayer,
          sizeX: x,
          sizeZ: z
        };

        if (!this.stage || s.sizeX !== this.stage.sizeX || s.sizeZ !== this.stage.sizeZ) {
          this.stage = s;
        }
      }
    }, {
      key: "resolvePicking",
      value: function resolvePicking(currentHits, lastHits, objects) {
        _get(Object.getPrototypeOf(VR.prototype), "resolvePicking", this).call(this, currentHits, lastHits, objects);

        var currentHit = currentHits.VR,
            lastHit = lastHits && lastHits.VR,
            dt,
            lt;
        if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
          currentHit.startTime = lastHit.startTime;
          currentHit.gazeFired = lastHit.gazeFired;
          dt = lt - currentHit.startTime;
          if (dt >= GAZE_LENGTH && !currentHit.gazeFired) {
            currentHit.gazeFired = true;
            emit.call(this, "gazecomplete", currentHit);
            emit.call(this.pickableObjects[currentHit.objectID], "click", "Gaze");
          }
        } else {
          if (lastHit) {
            dt = lt - lastHit.startTime;
            if (dt < GAZE_LENGTH) {
              emit.call(this, "gazecancel", lastHit);
            }
          }
          if (currentHit) {
            currentHit.startTime = lt;
            currentHit.gazeFired = false;
            emit.call(this, "gazestart", currentHit);
          }
        }
      }
    }, {
      key: "getTransforms",
      value: function getTransforms(near, far) {
        if (this.currentDevice) {
          if (!this._transformers[this.currentDeviceIndex]) {
            this._transformers[this.currentDeviceIndex] = new ViewCameraTransform(this.currentDevice);
          }
          return this._transformers[this.currentDeviceIndex].getTransforms(near, far);
        }
      }
    }, {
      key: "isNativeMobileWebVR",
      get: function get() {
        return !this.currentDevice.isPolyfilled && isChrome && isMobile;
      }
    }, {
      key: "hasStage",
      get: function get() {
        return this.stage && this.stage.sizeX * this.stage.sizeZ > 0;
      }
    }, {
      key: "currentPose",
      get: function get() {
        return this.currentDevice && this.currentDevice.getPose();
      }
    }, {
      key: "canMirror",
      get: function get() {
        return this.currentDevice && this.currentDevice.capabilities.hasExternalDisplay;
      }
    }, {
      key: "isPolyfilled",
      get: function get() {
        return this.currentDevice && this.currentDevice.isPolyfilled;
      }
    }, {
      key: "isPresenting",
      get: function get() {
        return this.currentDevice && this.currentDevice.isPresenting;
      }
    }, {
      key: "hasOrientation",
      get: function get() {
        return this.currentDevice && this.currentDevice.capabilities.hasOrientation;
      }
    }, {
      key: "currentCanvas",
      get: function get() {
        return this.isPresenting && this.currentDevice.getLayers()[0].source;
      }
    }]);

    return VR;
  }(Primrose.PoseInputProcessor);

  return VR;
}();