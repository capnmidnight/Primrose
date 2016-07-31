"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Mouse = function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Input",
    name: "Mouse",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  var Mouse = function (_Primrose$InputProces) {
    _inherits(Mouse, _Primrose$InputProces);

    function Mouse(DOMElement, parent, commands, socket) {
      _classCallCheck(this, Mouse);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mouse).call(this, "Mouse", parent, commands, socket));

      _this.timer = null;

      DOMElement = DOMElement || window;

      DOMElement.addEventListener("mousedown", function (event) {
        _this.setButton(event.button, true);
        _this.BUTTONS = event.buttons << 10;
      }, false);

      DOMElement.addEventListener("mouseup", function (event) {
        _this.setButton(event.button, false);
        _this.BUTTONS = event.buttons << 10;
      }, false);

      DOMElement.addEventListener("mousemove", function (event) {
        _this.BUTTONS = event.buttons << 10;
        if (PointerLock.isActive) {
          var mx = event.movementX,
              my = event.movementY;

          if (mx === undefined) {
            mx = event.webkitMovementX || event.mozMovementX || 0;
            my = event.webkitMovementY || event.mozMovementY || 0;
          }
          _this.setMovement(mx, my);
        } else {
          _this.setLocation(event.layerX, event.layerY);
        }
      }, false);

      DOMElement.addEventListener("wheel", function (event) {
        if (isChrome) {
          _this.W += event.deltaX;
          _this.Z += event.deltaY;
        } else if (event.shiftKey) {
          _this.W += event.deltaY;
        } else {
          _this.Z += event.deltaY;
        }
        event.preventDefault();
      }, false);
      return _this;
    }

    _createClass(Mouse, [{
      key: "setLocation",
      value: function setLocation(x, y) {
        this.X = x;
        this.Y = y;
      }
    }, {
      key: "setMovement",
      value: function setMovement(dx, dy) {
        this.X += dx;
        this.Y += dy;
      }
    }]);

    return Mouse;
  }(Primrose.InputProcessor);

  Primrose.InputProcessor.defineAxisProperties(Mouse, ["X", "Y", "Z", "W", "BUTTONS"]);

  return Mouse;
}();