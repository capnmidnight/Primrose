"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.PoseInputProcessor = function () {
  "use strict";

  var DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  },
      EMPTY_SCALE = new THREE.Vector3();

  pliny.class({
    parent: "Primrose",
    name: "PoseInputProcessor",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  var PoseInputProcessor = function (_Primrose$InputProces) {
    _inherits(PoseInputProcessor, _Primrose$InputProces);

    function PoseInputProcessor(name, parent, commands, socket, axisNames) {
      _classCallCheck(this, PoseInputProcessor);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PoseInputProcessor).call(this, name, parent, commands, socket, axisNames));

      _this.currentDevice = null;
      _this.lastPose = null;
      _this.posePosition = new THREE.Vector3();
      _this.poseQuaternion = new THREE.Quaternion();
      _this.position = new THREE.Vector3();
      _this.quaternion = new THREE.Quaternion();
      _this.matrix = new THREE.Matrix4();
      return _this;
    }

    _createClass(PoseInputProcessor, [{
      key: "update",
      value: function update(dt) {
        _get(Object.getPrototypeOf(PoseInputProcessor.prototype), "update", this).call(this, dt);

        if (this.currentDevice) {
          var pose = this.currentPose || this.lastPose || DEFAULT_POSE;
          this.lastPose = pose;
          this.inPhysicalUse = this.isPresenting && !!this.currentPose;
          var orient = this.currentPose && this.currentPose.orientation,
              pos = this.currentPose && this.currentPose.position;
          if (orient) {
            this.poseQuaternion.fromArray(orient);
          } else {
            this.poseQuaternion.set(0, 0, 0, 1);
          }
          if (pos) {
            this.posePosition.fromArray(pos);
          } else {
            this.posePosition.set(0, 0, 0);
          }
        }
      }
    }, {
      key: "updateStage",
      value: function updateStage(stageMatrix) {
        this.matrix.makeRotationFromQuaternion(this.poseQuaternion);
        this.matrix.setPosition(this.posePosition);
        this.matrix.multiplyMatrices(stageMatrix, this.matrix);
        this.matrix.decompose(this.position, this.quaternion, EMPTY_SCALE);
      }
    }, {
      key: "currentPose",
      get: function get() {
        throw new Exception("currentPose must be implemented in child class");
      }
    }]);

    return PoseInputProcessor;
  }(Primrose.InputProcessor);

  return PoseInputProcessor;
}();