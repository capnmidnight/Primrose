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
      if (this._lastValue !== this._value) {
        this._lastValue = this._value;
        this._surrogate.innerHTML = this.value;
        html2canvas(this._surrogate, {
          onrendered: (canvas) => {
            this._image = canvas;
            this.setSize(canvas.width, canvas.height);
            this.render();
          }
        });
      }
    }

    render() {
      if (this._image !== this._lastImage) {
        this._lastImage = this._image;
        this.context[clearFunc](0, 0, this.imageWidth, this.imageHeight);
        this.context.drawImage(0, 0, this._image);
        this.invalidate();
      }
    }
  }


  return Label;
})();

