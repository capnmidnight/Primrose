Primrose.Controls.HtmlDoc = (function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Controls",
    name: "HtmlDoc",
    description: "A rendering of an HTML document.",
    baseClass: "Primrose.Surface",
    parameters: [
      { name: "options", type: "Object", description: "Named parameters for creating the Document." }
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
        this.options = { element: this.options };
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
      this._element = Primrose.DOM.cascadeElement(this.options.element, "DIV", HTMLDivElement);
      this._element.style.position = "absolute";
      this._element.style.width = px(this.bounds.width);
      this._element.style.height = px(this.bounds.height);
      document.body.appendChild(Primrose.DOM.makeHidingContainer(this.id + "-hider", this._element));
      this._render();
    }

    _render() {
      html2canvas(this._element, {
        onrendered: (canvas) => {
          this._image = canvas;
          this.setSize(canvas.width, canvas.height);
          this.render();
        }
      });
    }

    render() {
      if (this._image !== this._lastImage) {
        this._lastImage = this._image;
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.imageWidth, this.imageHeight);
        this.context.drawImage(this._image, 0, 0);
        this.invalidate();
      }
    }
  }


  return HtmlDoc;
})();

