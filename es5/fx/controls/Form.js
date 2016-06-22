"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.Form = function () {
  "use strict";

  var COUNTER = 0;
  pliny.class({
    parent: "Primrose.Controls",
    name: "Form",
    baseClass: "Primrose.Entity",
    description: "A basic 2D form control, with its own mesh to use as a frame."
  });

  var Form = function (_Primrose$Surface) {
    _inherits(Form, _Primrose$Surface);

    _createClass(Form, null, [{
      key: "create",
      value: function create() {
        return new Form();
      }
    }]);

    function Form(options) {
      _classCallCheck(this, Form);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, patch(options, {
        id: "Primrose.Controls.Form[" + COUNTER++ + "]"
      })));

      _this._mesh = textured(quad(1, _this.bounds.height / _this.bounds.width), _this);
      _this._mesh.name = _this.id + "-mesh";
      Object.defineProperties(_this.style, {
        display: {
          get: function get() {
            return _this._mesh.visible ? "" : "none";
          },
          set: function set(v) {
            if (v === "none") {
              _this.hide();
            } else {
              _this.show();
            }
          }
        },
        visible: {
          get: function get() {
            return _this._mesh.visible ? "" : "hidden";
          },
          set: function set(v) {
            return _this.visible = v !== "hidden";
          }
        }
      });
      return _this;
    }

    _createClass(Form, [{
      key: "addToBrowserEnvironment",
      value: function addToBrowserEnvironment(env, scene) {
        scene.add(this._mesh);
        env.registerPickableObject(this._mesh);
        return this._mesh;
      }
    }, {
      key: "hide",
      value: function hide() {
        this.visible = false;
        this.disabled = true;
      }
    }, {
      key: "show",
      value: function show() {
        this.visible = true;
        this.disabled = false;
      }
    }, {
      key: "position",
      get: function get() {
        return this._mesh.position;
      }
    }, {
      key: "visible",
      get: function get() {
        return this._mesh.visible;
      },
      set: function set(v) {
        this._mesh.visible = v;
      }
    }, {
      key: "disabled",
      get: function get() {
        return this._mesh.disabled;
      },
      set: function set(v) {
        this._mesh.disabled = v;
      }
    }, {
      key: "enabled",
      get: function get() {
        return !this.disabled;
      },
      set: function set(v) {
        this.disabled = !v;
      }
    }]);

    return Form;
  }(Primrose.Surface);

  return Form;
}();