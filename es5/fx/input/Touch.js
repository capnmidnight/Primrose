"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Touch = function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Touch",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  var Touch = function (_Primrose$InputProces) {
    _inherits(Touch, _Primrose$InputProces);

    function Touch(DOMElement, commands, socket) {
      _classCallCheck(this, Touch);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Touch).call(this, "Touch", commands, socket));

      DOMElement = DOMElement || window;

      function setState(stateChange, setAxis, event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; ++i) {
          var t = touches[i];

          if (setAxis) {
            this.setAxis("X" + t.identifier, t.pageX);
            this.setAxis("Y" + t.identifier, t.pageY);
          } else {
            this.setAxis("LX" + t.identifier, t.pageX);
            this.setAxis("LY" + t.identifier, t.pageY);
          }

          this.setButton("FINGER" + t.identifier, stateChange);

          var mask = 1 << t.identifier;
          if (stateChange) {
            this.FINGERS |= mask;
          } else {
            mask = ~mask;
            this.FINGERS &= mask;
          }
        }
        event.preventDefault();
        this.update();
      }

      DOMElement.addEventListener("touchstart", setState.bind(_this, true, false), false);
      DOMElement.addEventListener("touchend", setState.bind(_this, false, true), false);
      DOMElement.addEventListener("touchmove", setState.bind(_this, true, true), false);
      return _this;
    }

    return Touch;
  }(Primrose.InputProcessor);

  Touch.NUM_FINGERS = 10;

  var axes = ["FINGERS"];
  for (var i = 0; i < Touch.NUM_FINGERS; ++i) {
    axes.push("X" + i);
    axes.push("Y" + i);
  }

  Primrose.InputProcessor.defineAxisProperties(Touch, axes);
  return Touch;
}();