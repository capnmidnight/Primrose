/* global qp, Primrose, isOSX, isIE, isOpera, isChrome, isFirefox, isSafari, devicePixelRatio, HTMLCanvasElement, pliny */

Primrose.Controls.Button2D = (function () {
  "use strict";

  var COUNTER = 0;

  pliny.class("Primrose.Controls", {
    name: "Button2D",
    description: "A simple button to put on a Surface.",
    parameters: [
      { name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." },
      { name: "options", type: "Object", description: "Named parameters for creating the Button." }
    ]
  });
  class Button2D extends Primrose.Surface {
    constructor(options) {
      super(patch(options, {
        id: "Primrose.Controls.Button2D[" + (COUNTER++) + "]"
      }));
      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////
    
      if (typeof options === "string") {
        this.options = { value: this.options };
      }
      else {
        this.options = options || {};
      }

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////

      this._subBounds = new Primrose.Text.Rectangle(0, 0, this.imageWidth, this.imageHeight);

      this._currentTouchID = null;

      this._lastFont = null;
      this._lastText = null;
      this._lastCharacterWidth = null;
      this._lastCharacterHeight = null;
      this._lastPadding = null;
      this._lastWidth = -1;
      this._lastHeight = -1;
      this._lastActivated = null;

      this.character = new Primrose.Text.Size();
      this.theme = this.options.theme;
      this.fontSize = this.options.fontSize || 32;
      this.refreshCharacter();
      this.value = this.options.value;

      this.addEventListener("focus", this.render.bind(this), false);
      this.addEventListener("blur", this.render.bind(this), false);
    }

    get value() {
      return this._value;
    }

    set value(txt) {
      txt = txt || "";
      this._value = txt.replace(/\r\n/g, "\n");
      this.render();
    }

    get theme() {
      return this._theme;
    }

    set theme(t) {
      this._theme = clone(t || Primrose.Text.Themes.Default);
      this._theme.fontSize = this.fontSize;
      this.refreshCharacter();
      this.render();
    }

    get resized() {
      return this.imageWidth !== this.surfaceWidth || this.imageHeight !== this.surfaceHeight;
    }

    startPointer(x, y) {
      this.focus();
      this._activated = true;
      this.render();
    }

    endPointer() {
      if (this._activated) {
        this._activated = false;
        emit.call(this, "click", { target: this });
        this.render();
      }
    }

    resize() {
      if (this.theme &&
        (this._lastWidth !== this.surfaceWidth || this._lastHeight !== this.surfaceHeight)
        && this.surfaceWidth > 0
        && this.surfaceHeight > 0) {
        this._lastWidth = this.imageWidth = this.surfaceWidth;
        this._lastHeight = this.imageHeight = this.surfaceHeight;
      }
    }

    refreshCharacter() {
      this.character.height = this.fontSize;
      this.context.font = this.character.height + "px " + this.theme.fontFamily;
      // measure 100 letter M's, then divide by 100, to get the width of an M
      // to two decimal places on systems that return integer values from
      // measureText.
      this.character.width = this.context.measureText(
        "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width /
        100;
    }

    setSize(w, h) {
      this.canvas.style.width = Math.round(w) + "px";
      this.canvas.style.height = Math.round(h) + "px";
      this.resize();
    }

    render() {
      var resized = this.resized;
      if (resized) {
        this.resize();
      }

      var textChanged = this._lastText !== this.value,
        characterWidthChanged = this.character.width !== this._lastCharacterWidth,
        characterHeightChanged = this.character.height !== this._lastCharacterHeight,
        fontChanged = this.context.font !== this._lastFont,
        activatedChanged = this._activated !== this._lastActivated,
        changed = resized || textChanged || characterWidthChanged || characterHeightChanged || this.resized || fontChanged || activatedChanged;

      if (this.theme && changed) {
        this._lastText = this.value;
        this._lastCharacterWidth = this.character.width;
        this._lastCharacterHeight = this.character.height;
        this._lastWidth = this.imageWidth;
        this._lastHeight = this.imageHeight;
        this._lastFont = this.context.font;
        this._lastActivated = this._activated;

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
              textY = (this.imageHeight - lines.length * this.character.height) / 2 + y * this.character.height,
              testWidth = "";

            for (var x = 0; x < 10; ++x) {
              testWidth += line;
            }

            var textWidth = this.context.measureText(testWidth).width / 10,
              textX = (this.imageWidth - textWidth) / 2,
              font = (this.theme.regular.fontWeight || "") +
                " " + (this.theme.regular.fontStyle || "") +
                " " + this.character.height + "px " + this.theme.fontFamily;
            this.context.font = font.trim();
            this.context.fillStyle = foreColor;
            this.context.fillText(line, textX, textY);
          }
        }

        this.context.lineWidth = this._activated ? 4 : 2;
        this.context.strokeStyle = this.theme.regular.foreColor || Primrose.Text.Themes.Default.regular.foreColor;
        this.context.strokeRect(0, 0, this.imageWidth, this.imageHeight);

        if (this.parent) {
          this.parent.invalidate(this.bounds);
        }
      }
    }
  }

  return Button2D;
})();

pliny.issue("Primrose.Controls.Button2D", {
  name: "document Button2D",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Controls.Button2D](#Primrose_Controls_Button2D)\n\
class in the controls/ directory."
});