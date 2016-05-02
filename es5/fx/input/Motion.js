"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Motion = function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Motion",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  var Motion = function (_Primrose$InputProces) {
    _inherits(Motion, _Primrose$InputProces);

    function Motion(commands, socket) {
      _classCallCheck(this, Motion);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Motion).call(this, "Motion", commands, socket));

      var corrector = new MotionCorrector(),
          a = new THREE.Quaternion(),
          b = new THREE.Quaternion(),
          RIGHT = new THREE.Vector3(1, 0, 0),
          UP = new THREE.Vector3(0, 1, 0),
          FORWARD = new THREE.Vector3(0, 0, -1);
      corrector.addEventListener("deviceorientation", function (evt) {
        for (var i = 0; i < Motion.AXES.length; ++i) {
          var k = Motion.AXES[i];
          _this.setAxis(k, evt[k]);
        }
        a.set(0, 0, 0, 1).multiply(b.setFromAxisAngle(UP, evt.HEADING)).multiply(b.setFromAxisAngle(RIGHT, evt.PITCH)).multiply(b.setFromAxisAngle(FORWARD, evt.ROLL));
        _this.headRX = a.x;
        _this.headRY = a.y;
        _this.headRZ = a.z;
        _this.headRW = a.w;
        _this.update();
      });
      _this.zeroAxes = corrector.zeroAxes.bind(corrector);
      return _this;
    }

    _createClass(Motion, [{
      key: "getOrientation",
      value: function getOrientation(value) {
        value = value || new THREE.Quaternion();
        value.set(this.getValue("headRX"), this.getValue("headRY"), this.getValue("headRZ"), this.getValue("headRW"));
        return value;
      }
    }]);

    return Motion;
  }(Primrose.InputProcessor);

  Primrose.InputProcessor.defineAxisProperties(Motion, ["HEADING", "PITCH", "ROLL", "D_HEADING", "D_PITCH", "D_ROLL", "headAX", "headAY", "headAZ", "headRX", "headRY", "headRZ", "headRW"]);

  function makeTransform(s, eye) {
    var sw = Math.max(screen.width, screen.height),
        sh = Math.min(screen.width, screen.height),
        w = Math.floor(sw * devicePixelRatio / 2),
        h = Math.floor(sh * devicePixelRatio),
        i = (eye + 1) / 2;

    if (window.THREE) {
      s.transform = new THREE.Matrix4().makeTranslation(eye * 0.034, 0, 0);
    }
    s.viewport = {
      x: i * w,
      y: 0,
      width: w,
      height: h,
      top: 0,
      right: (i + 1) * w,
      bottom: h,
      left: i * w
    };
    s.fov = 75;
  }

  Motion.DEFAULT_TRANSFORMS = [{}, {}];
  makeTransform(Motion.DEFAULT_TRANSFORMS[0], -1);
  makeTransform(Motion.DEFAULT_TRANSFORMS[1], 1);

  return Motion;
}();