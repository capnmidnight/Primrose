"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Text.Controls.TextInput = function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Text.Controls",
    name: "TextInput",
    description: "plain text input box.",
    baseClass: "Primrose.Text.Controls.TextBox",
    parameters: [{ name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options", type: "Object", description: "Named parameters for creating the TextInput." }]
  });

  var TextInput = function (_Primrose$Text$Contro) {
    _inherits(TextInput, _Primrose$Text$Contro);

    function TextInput(options) {
      _classCallCheck(this, TextInput);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextInput).call(this, overwrite(patch(options, {
        id: "Primrose.Text.Controls.TextInput[" + COUNTER++ + "]",
        padding: 5
      }), {
        singleLine: true,
        disableWordWrap: true,
        hideLineNumbers: true,
        hideScrollBars: true,
        tabWidth: 1,
        tokenizer: Primrose.Text.Grammars.PlainText,
        commands: Primrose.Text.CommandPacks.TextInput
      })));

      _this.passwordCharacter = _this.options.passwordCharacter;
      return _this;
    }

    _createClass(TextInput, [{
      key: "drawText",
      value: function drawText(ctx, txt, x, y) {
        if (this.passwordCharacter) {
          var val = "";
          for (var i = 0; i < txt.length; ++i) {
            val += this.passwordCharacter;
          }
          txt = val;
        }
        _get(Object.getPrototypeOf(TextInput.prototype), "drawText", this).call(this, ctx, txt, x, y);
      }
    }, {
      key: "value",
      get: function get() {
        return _get(Object.getPrototypeOf(TextInput.prototype), "value", this);
      },
      set: function set(v) {
        v = v || "";
        v = v.replace(/\r?\n/g, "");
        _set(Object.getPrototypeOf(TextInput.prototype), "value", v, this);
      }
    }, {
      key: "selectedText",
      get: function get() {
        return _get(Object.getPrototypeOf(TextInput.prototype), "selectedText", this);
      },
      set: function set(v) {
        v = v || "";
        v = v.replace(/\r?\n/g, "");
        _set(Object.getPrototypeOf(TextInput.prototype), "selectedText", v, this);
      }
    }]);

    return TextInput;
  }(Primrose.Text.Controls.TextBox);

  return TextInput;
}();