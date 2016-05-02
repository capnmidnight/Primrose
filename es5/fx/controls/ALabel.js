"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.Label = function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Controls",
    name: "Label",
    description: "A simple label of text to put on a Surface.",
    baseClass: "Primrose.Surface",
    parameters: [{ name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options", type: "Object", description: "Named parameters for creating the Button." }]
  });

  var Label = function (_Primrose$Surface) {
    _inherits(Label, _Primrose$Surface);

    function Label(options) {
      _classCallCheck(this, Label);

      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Label).call(this, patch(options, {
        id: "Primrose.Controls.Label[" + COUNTER++ + "]"
      })));

      if (typeof options === "string") {
        _this.options = { value: _this.options };
      } else {
        _this.options = options || {};
      }

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////

      _this._lastFont = null;
      _this._lastText = null;
      _this._lastCharacterWidth = null;
      _this._lastCharacterHeight = null;
      _this._lastPadding = null;
      _this._lastWidth = -1;
      _this._lastHeight = -1;
      _this._lastTextAlign = null;

      _this.textAlign = _this.options.textAlign;
      _this.character = new Primrose.Text.Size();
      _this.theme = _this.options.theme;
      _this.fontSize = _this.options.fontSize || 16;
      _this.refreshCharacter();
      _this.value = _this.options.value;
      return _this;
    }

    _createClass(Label, [{
      key: "refreshCharacter",
      value: function refreshCharacter() {
        this.character.height = this.fontSize;
        this.context.font = this.character.height + "px " + this.theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = this.context.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width / 100;
      }
    }, {
      key: "_isChanged",
      value: function _isChanged() {
        var textChanged = this._lastText !== this.value,
            characterWidthChanged = this.character.width !== this._lastCharacterWidth,
            characterHeightChanged = this.character.height !== this._lastCharacterHeight,
            fontChanged = this.context.font !== this._lastFont,
            alignChanged = this.textAlign !== this._lastTextAlign,
            changed = this.resized || textChanged || characterWidthChanged || characterHeightChanged || this.resized || fontChanged || alignChanged;
        return changed;
      }
    }, {
      key: "render",
      value: function render() {
        if (this.resized) {
          this.resize();
        }

        if (this.theme && this._isChanged) {
          this._lastText = this.value;
          this._lastCharacterWidth = this.character.width;
          this._lastCharacterHeight = this.character.height;
          this._lastWidth = this.imageWidth;
          this._lastHeight = this.imageHeight;
          this._lastFont = this.context.font;
          this._lastTextAlign = this.textAlign;

          this.context.textAlign = this.textAlign || "left";

          var backColor = this.options.backgroundColor || this.theme.regular.backColor,
              foreColor = this.options.color || this.theme.regular.foreColor;

          var clearFunc = backColor ? "fillRect" : "clearRect";

          if (this.theme.regular.backColor) {
            this.context.fillStyle = backColor;
          }

          this.context[clearFunc](0, 0, this.imageWidth, this.imageHeight);

          if (this.value) {
            var lines = this.value.split("\n");
            for (var y = 0; y < lines.length; ++y) {
              var line = lines[y],
                  textY = (this.imageHeight - lines.length * this.character.height) / 2 + y * this.character.height;

              var textX = null;
              switch (this.textAlign) {
                case "right":
                  textX = this.imageWidth;
                  break;
                case "center":
                  textX = this.imageWidth / 2;
                  break;
                default:
                  textX = 0;
              }

              var font = (this.theme.regular.fontWeight || "") + " " + (this.theme.regular.fontStyle || "") + " " + this.character.height + "px " + this.theme.fontFamily;
              this.context.font = font.trim();
              this.context.fillStyle = foreColor;
              this.context.fillText(line, textX, textY);
            }
          }

          this.renderCanvasTrim();

          this.invalidate();
        }
      }
    }, {
      key: "renderCanvasTrim",
      value: function renderCanvasTrim() {}
    }, {
      key: "textAlign",
      get: function get() {
        return this.context.textAlign;
      },
      set: function set(v) {
        this.context.textAlign = v;
        this.render();
      }
    }, {
      key: "value",
      get: function get() {
        return this._value;
      },
      set: function set(txt) {
        txt = txt || "";
        this._value = txt.replace(/\r\n/g, "\n");
        this.render();
      }
    }, {
      key: "theme",
      get: function get() {
        return this._theme;
      },
      set: function set(t) {
        this._theme = clone(t || Primrose.Text.Themes.Default);
        this._theme.fontSize = this.fontSize;
        this.refreshCharacter();
        this.render();
      }
    }]);

    return Label;
  }(Primrose.Surface);

  return Label;
}();