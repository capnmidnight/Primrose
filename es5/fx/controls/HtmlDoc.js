"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.HtmlDoc = function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Controls",
    name: "HtmlDoc",
    baseClass: "Primrose.Surface",
    description: "A rendering of an HTML document.",
    parameters: [{
      name: "options",
      type: "Object",
      description: "Named parameters for creating the Document."
    }]
  });

  var HtmlDoc = function (_Primrose$Surface) {
    _inherits(HtmlDoc, _Primrose$Surface);

    _createClass(HtmlDoc, null, [{
      key: "create",
      value: function create() {
        return new HtmlDoc();
      }
    }]);

    function HtmlDoc(options) {
      _classCallCheck(this, HtmlDoc);

      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HtmlDoc).call(this, patch(options, {
        id: "Primrose.Controls.HtmlDoc[" + COUNTER++ + "]"
      })));

      if (typeof options === "string") {
        _this.options = {
          element: _this.options
        };
      } else {
        _this.options = options || {};
      }

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////
      _this._lastImage = null;
      _this._image = null;
      _this.element = _this.options.element;
      return _this;
    }

    _createClass(HtmlDoc, [{
      key: "addToBrowserEnvironment",
      value: function addToBrowserEnvironment(env, scene) {
        var mesh = textured(quad(2, 2), this);
        scene.add(mesh);
        env.registerPickableObject(mesh);
        return mesh;
      }
    }, {
      key: "_render",
      value: function _render() {
        var _this2 = this;

        html2canvas(this._element, {
          onrendered: function onrendered(canvas) {
            _this2._image = canvas;
            _this2.setSize(canvas.width, canvas.height);
            _this2.render();
          }
        });
      }
    }, {
      key: "render",
      value: function render() {
        if (this._image !== this._lastImage) {
          this._lastImage = this._image;
          this.context.fillStyle = "white";
          this.context.fillRect(0, 0, this.imageWidth, this.imageHeight);
          this.context.drawImage(this._image, 0, 0);
          this.invalidate();
        }
      }
    }, {
      key: "element",
      get: function get() {
        return this._element;
      },
      set: function set(v) {
        if (v) {
          this._element = Primrose.DOM.cascadeElement(v, "DIV", HTMLDivElement);
          this._element.style.position = "absolute";
          this._element.style.display = "";
          this._element.style.width = px(this.bounds.width);
          this._element.style.height = px(this.bounds.height);
          document.body.appendChild(Primrose.DOM.makeHidingContainer(this.id + "-hider", this._element));
          this._render();
        }
      }
    }, {
      key: "value",
      get: function get() {
        return this._element.innerHTML;
      },
      set: function set(v) {
        if (v !== this._element.innerHTML) {
          this._element.innerHTML = v;
          this._render();
        }
      }
    }]);

    return HtmlDoc;
  }(Primrose.Surface);

  return HtmlDoc;
}();