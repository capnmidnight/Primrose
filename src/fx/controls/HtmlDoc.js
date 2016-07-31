Primrose.Controls.HtmlDoc = (function () {
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
  class HtmlDoc extends Primrose.Surface {

    static create() {
      return new HtmlDoc();
    }

    constructor(options) {
      super(patch(options, {
        id: "Primrose.Controls.HtmlDoc[" + (COUNTER++) + "]"
      }));
      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      if (typeof options === "string") {
        this.options = {
          element: this.options
        };
      }
      else {
        this.options = options || {};
      }

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////
      this._lastImage = null;
      this._image = null;
      this.element = this.options.element;
    }

    get element() {
      return this._element;
    }

    set element(v) {
      if (v) {
        this._element = Primrose.DOM.cascadeElement(v, "DIV", HTMLDivElement);
        this._element.style.position = "absolute";
        this._element.style.display = "";
        this._element.style.width = this.bounds.width + "px";
        this._element.style.height = this.bounds.height + "px";
        document.body.appendChild(Primrose.DOM.makeHidingContainer(this.id + "-hider", this._element));
        this._render();
      }
    }

    addToBrowserEnvironment(env, scene) {
      var mesh = textured(quad(2, 2), this);
      scene.add(mesh);
      env.registerPickableObject(mesh);
      return mesh;
    }

    get value() {
      return this._element.innerHTML;
    }

    set value(v) {
      if (v !== this._element.innerHTML) {
        this._element.innerHTML = v;
        this._render();
      }
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