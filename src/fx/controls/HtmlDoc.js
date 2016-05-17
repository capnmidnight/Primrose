Primrose.Controls.HtmlDoc = (function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Controls",
    name: "HtmlDoc",
    description: "A rendering of an HTML document.",
    baseClass: "Primrose.Surface",
    parameters: [
      { name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." },
      { name: "options", type: "Object", description: "Named parameters for creating the Button." }
    ]
  });
  class HtmlDoc extends Primrose.Surface {
    constructor(options) {
      super(patch(options, {
        id: "Primrose.Controls.HtmlDoc[" + (COUNTER++) + "]"
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
      this._lastValue = null;
      this._lastImage = null;
      this._image = null;
      this._surrogate = document.createElement("div");
      this.value = this.options.value;
    }

    get value() {
      return this._value;
    }

    set value(txt) {
      txt = txt || "";
      this._value = txt.replace(/\r\n/g, "\n");
      this.render();
    }

    
    _isChanged() {
      var textChanged = this._lastValue !== this.value,
        imageChanged = this._lastImage !== this._image,
        changed = textChanged || imageChanged;
      return changed;
    }

    render() {
      if (this.resized) {
        this.resize();
      }

      if (this._isChanged) {
        this._lastValue = this.value;
        this._lastWidth = this.imageWidth;
        this._lastHeight = this.imageHeight;

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

            var font = (this.theme.regular.fontWeight || "") +
              " " + (this.theme.regular.fontStyle || "") +
              " " + this.character.height + "px " + this.theme.fontFamily;
            this.context.font = font.trim();
            this.context.fillStyle = foreColor;
            this.context.fillText(line, textX, textY);
          }
        }

        this.renderCanvasTrim();
        
        this.invalidate();
      }
    }

    renderCanvasTrim() {
    }
  }


  return Label;
})();

