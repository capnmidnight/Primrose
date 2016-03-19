/* global qp, Primrose, isOSX, isIE, isOpera, isChrome, isFirefox, isSafari, devicePixelRatio, HTMLCanvasElement, pliny */

Primrose.Controls.Image = (function () {
  "use strict";

  var COUNTER = 0,
    HTMLImage = window.Image,
    imageCache = {};

  pliny.class("Primrose.Controls", {
    name: "Image",
    description: "A simple 2D image to put on a Surface.",
    parameters: [
      { name: "options", type: "Object", description: "Named parameters for creating the Button." }
    ]
  });
  class Image extends Primrose.Surface {
    constructor(options) {
      super(patch(options, {
        id: "Primrose.Controls.Image[" + (COUNTER++) + "]"
      }));
      this.listeners.load = [];
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

      this._lastWidth = -1;
      this._lastHeight = -1;
      this._lastImage = null;

      this.value = this.options.value;
    }

    get value() {
      return this._value;
    }

    get image() {
      return this._image;
    }

    set image(img) {
      this._image = img;
      if (img) {
        this.setSize(this.image.width, this.image.height);
        this.render();
        emit.call(this, "load", { target: this });
      }
      else {
        this.render();
      }
    }

    set value(src) {
      this._value = src;
      if (imageCache[src]) {
        this.image = imageCache[src];
      }
      else {
        if (src) {
          var temp = new HTMLImage();
          temp.addEventListener("load", () => {
            imageCache[src] = temp;
            this.image = temp;
          }, false);
          temp.addEventListener("error", () => {
            this.image = null;
          }, false);
          temp.addEventListener("error", console.error.bind(console, "Failed to load image: " + src), false);
          temp.src = src;
        }
        else {
          this.image = null;
        }
      }
    }

    get resized() {
      return this.imageWidth !== this.surfaceWidth || this.imageHeight !== this.surfaceHeight;
    }

    get DOMElement() {
      return this.canvas;
    }

    resize() {
      if (this.resized
        && this.surfaceWidth > 0
        && this.surfaceHeight > 0) {
        this.imageWidth = this.surfaceWidth;
        this.imageHeight = this.surfaceHeight;
        this.render();
      }
    }

    setSize(w, h) {
      this.canvas.style.width = Math.round(w) + "px";
      this.canvas.style.height = Math.round(h) + "px";
      this.resize();
    }

    get _changed() {
      return this.resized || this.image !== this._lastImage;
    }

    render() {
      if (this._changed) {
        this._lastWidth = this.imageWidth;
        this._lastHeight = this.imageHeight;
        this._lastImage = this.image;

        this.context.clearRect(0, 0, this.imageWidth, this.imageHeight);
        if (this.image) {
          this.context.drawImage(this.image, 0, 0);
        }

        if (this.parent) {
          this.parent.invalidate(this.bounds);
        }
      }
    }
  }


  return Image;
})();

pliny.issue("Primrose.Controls.Image", {
  name: "document Image",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Controls.Image](#Primrose_Controls_Image)\n\
class in the controls/ directory."
});