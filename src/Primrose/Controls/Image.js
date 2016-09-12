var COUNTER = 0,
  HTMLImage = window.Image,
  imageCache = {};

pliny.class({
  parent: "Primrose.Controls",
    name: "Image",
    baseClass: "Primrose.Surface",
    description: "A simple 2D image to put on a Surface.",
    parameters: [{
      name: "options",
      type: "Object",
      description: "Named parameters for creating the Image."
    }]
});
class Image extends Primrose.Surface {

  static create() {
    return new Image();
  }

  constructor(options) {
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    options = options || {};
    if (typeof options === "string") {
      options = {
        value: options
      };
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
    this.className = "";
    this.mesh = null;

    if(options.value) {
      setTimeout(() => {
        console.log(options.value)
        if (options.value) {
          if(options.value instanceof Array){
            if(options.value.length === 2){
              this.loadStereoImage(options.value[0], options.value[1]);
            }
            else if(options.value === 1) {
              options.value = options.value[0];
            }
            else{
              throw new Error("Don't know what to do with " + options.value.length + " images");
            }
          }

          if(typeof options.value === "string") {
            if (/\.stereo\./.test(options.value)) {
              this.loadStereoImage(options.value);
            }
            else {
              this.loadImage(options.value);
            }
          }
        }
      });
    }
  }

  addToBrowserEnvironment(env, scene) {
    this.mesh = textured(
      this.options.geometry || quad(0.5, 0.5 * this.imageHeight / this.imageWidth),
      this,
      this.options);
    scene.add(this.mesh);
    env.registerPickableObject(this.mesh);
    return this.mesh;
  }

  get position(){
    return this.mesh.position;
  }

  get src() {
    return this.getImage(this._currentImageIndex)
      .src;
  }

  set src(v) {
    if (this.className === "stereo") {
      this.loadStereoImage(v);
    }
    else {
      this.loadImage(0, src);
    }
  }

  loadImage(i, src) {
    if (typeof i !== "number" && !(i instanceof Number)) {
      src = i;
      i = 0;
    }
    console.log("loadImage", i, src);
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
      })
      .then((img) => {
        this.bounds.width = img.width;
        this.bounds.height = img.height;
        this.setImage(i, img);
        return img;
      })
      .catch((err) => {
        console.error("Failed to load image " + src);
        console.error(err);
        this.setImage(i, null);
      });
  }

  loadStereoImage(srcLeft, srcRight) {
    var imageLoaders = [this.loadImage(srcLeft)];
    if(srcRight){
      imageLoaders.push(this.loadImage(srcRight));
    }
    return Promise.all(imageLoaders)
      .then((images) => {
        var bounds = null,
          imgLeft = null,
          imgRight = null;
        if(images.length === 2) {
          imgLeft = images[0];
          imgRight = images[1];
          bounds = new Primrose.Text.Rectangle(0, 0, imgLeft.width, imgLeft.height);
        }
        else {
          var img = images[0];
          bounds = new Primrose.Text.Rectangle(0, 0, img.width / 2, img.height);
          var a = new Primrose.Surface({
              id: this.id + "-left",
              bounds: bounds
            }),
            b = new Primrose.Surface({
              id: this.id + "-right",
              bounds: bounds
            });
          a.context.drawImage(img, 0, 0);
          b.context.drawImage(img, -bounds.width, 0);
          imgLeft = a.canvas;
          imgRight = b.canvas;
        }
        this.setStereoImage(imgLeft, imgRight, bounds);
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

  setStereoImage(left, right, bounds){
    this.bounds.width = bounds.width;
    this.bounds.height = bounds.height;
    this.setImage(0, left);
    this.setImage(1, right);
    emit.call(this, "load", {
      target: this
    });
  }

  setImage(i, img) {
    this._images[i] = img;
    this.render();
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