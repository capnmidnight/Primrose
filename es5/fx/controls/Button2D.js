"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.Button2D = function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Controls",
    name: "Button2D",
    description: "A simple button to put on a Surface.",
    baseClass: "Primrose.Controls.Label",
    parameters: [{ name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options", type: "Object", description: "Named parameters for creating the Button." }]
  });

  var Button2D = function (_Primrose$Controls$La) {
    _inherits(Button2D, _Primrose$Controls$La);

    function Button2D(options) {
      _classCallCheck(this, Button2D);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Button2D).call(this, patch(options, {
        id: "Primrose.Controls.Button2D[" + COUNTER++ + "]",
        textAlign: "center"
      })));

      _this._lastActivated = null;
      return _this;
    }

    _createClass(Button2D, [{
      key: "startPointer",
      value: function startPointer(x, y) {
        this.focus();
        this._activated = true;
        this.render();
      }
    }, {
      key: "endPointer",
      value: function endPointer() {
        if (this._activated) {
          this._activated = false;
          emit.call(this, "click", { target: this });
          this.render();
        }
      }
    }, {
      key: "_isChanged",
      value: function _isChanged() {
        var activatedChanged = this._activated !== this._lastActivated,
            changed = _get(Object.getPrototypeOf(Button2D.prototype), "_isChanged", this) || activatedChanged;
        return changed;
      }
    }, {
      key: "renderCanvasTrim",
      value: function renderCanvasTrim() {
        this.context.lineWidth = this._activated ? 4 : 2;
        this.context.strokeStyle = this.theme.regular.foreColor || Primrose.Text.Themes.Default.regular.foreColor;
        this.context.strokeRect(0, 0, this.imageWidth, this.imageHeight);
      }
    }]);

    return Button2D;
  }(Primrose.Controls.Label);

  return Button2D;
}();