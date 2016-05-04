Primrose.Controls.Image = (function () {
  "use strict";

  var COUNTER = 0,
    HTMLImage = window.Image,
    imageCache = {};

  pliny.class({
    parent: "Primrose.Controls",
    name: "Image",
    description: "A simple 2D image to put on a Surface.",
    baseClass: "Primrose.Surface",
    parameters: [
      { name: "options", type: "Object", description: "Named parameters for creating the Button." }
    ]
  });
  class Image extends Primrose.Surface {
    constructor(options) {
      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      options = options || {};
      if (typeof options === "string") {
        options = { value: options };
      }

      super(patch(options, {
        id: "Primrose.Controls.Image[" + (COUNTER++) + "]",
        bounds: new Primrose.Text.Rectangle(0, 0, 1, 1)
      }));
      this.listeners.load = [];

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////

      this._lastWidth = -1;
      this._lastHeight = -1;
      this._lastImage = null;
      this._images = [];
      this._currentImageIndex = 0;

      setTimeout(() => {
        if (options.value) {
          if (/\.stereo\./.test(options.value)) {
            this.loadStereoImage(options.value);
          }
          else {
            this.loadImage(options.value);
          }
        }
      });
    }

    loadImage(i, src) {
      if (typeof i !== "number" && !(i instanceof Number)) {
        src = i;
        i = 0;
      }
      return new Promise((resolve, reject) => {
        if (imageCache[src]) {
          resolve(imageCache[src]);
        }
        else if (src) {
          var temp = new HTMLImage();
          temp.addEventListener("load", () => {
            imageCache[src] = temp;
            resolve(imageCache[src]);
          }, false);
          temp.addEventListener("error", () => {
            reject("error loading image");
          }, false);
          temp.src = src;
        }
        else {
          reject("Image was null");
        }
      }).then((img) => {
        this.setImage(i, img);
        return img;
      }).catch((err) => {
        console.error("Failed to load image " + src);
        console.error(err);
        this.setImage(i, null);
      });
    }

    loadStereoImage(src) {
      return this.loadImage(src).then((img) => {
        var bounds = new Primrose.Text.Rectangle(0, 0, img.width / 2, img.height),
          a = new Primrose.Surface({
            id: this.id + "-left",
            bounds: bounds
          }),
          b = new Primrose.Surface({
            id: this.id + "-right",
            bounds: bounds
          });
        a.context.drawImage(img, 0, 0);
        b.context.drawImage(img, -bounds.width, 0);
        this.setImage(0, a.canvas);
        this.setImage(1, b.canvas);
        this.bounds.width = bounds.width;
        this.bounds.height = bounds.height;
        this.render();
        return this;
      });
    }

    get image() {
      return this.getImage(this._currentImageIndex);
    }

    set image(img) {
      this.setImage(this._currentImageIndex, img);
    }

    getImage(i) {
      return this._images[i % this._images.length];
    }

    setImage(i, img) {
      this._images[i] = img;
      this.render();
      emit.call(this, "load", { target: this });
    }

    get _changed() {
      return this.resized || this.image !== this._lastImage;
    }

    eyeBlank(eye) {
      this._currentImageIndex = eye;
      this.render();
    }

    render(force) {
      if (this._changed || force) {
        if (this.resized) {
          this.resize();
        }
        else if (this.image !== this._lastImage) {
          this.context.clearRect(0, 0, this.imageWidth, this.imageHeight);
        }

        if (this.image) {
          this.context.drawImage(this.image, 0, 0);
        }

        this._lastWidth = this.imageWidth;
        this._lastHeight = this.imageHeight;
        this._lastImage = this.image;

        this.invalidate();
      }
    }
  }


  return Image;
})();

