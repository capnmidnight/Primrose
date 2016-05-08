"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.Image = function () {
  "use strict";

  var COUNTER = 0,
      HTMLImage = window.Image,
      imageCache = {};

  pliny.class({
    parent: "Primrose.Controls",
    name: "Image",
    description: "A simple 2D image to put on a Surface.",
    baseClass: "Primrose.Surface",
    parameters: [{ name: "options", type: "Object", description: "Named parameters for creating the Button." }]
  });

  var Image = function (_Primrose$Surface) {
    _inherits(Image, _Primrose$Surface);

    function Image(options) {
      _classCallCheck(this, Image);

      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      options = options || {};
      if (typeof options === "string") {
        options = { value: options };
      }

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Image).call(this, patch(options, {
        id: "Primrose.Controls.Image[" + COUNTER++ + "]",
        bounds: new Primrose.Text.Rectangle(0, 0, 1, 1)
      })));

      _this.listeners.load = [];

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////

      _this._lastWidth = -1;
      _this._lastHeight = -1;
      _this._lastImage = null;
      _this._images = [];
      _this._currentImageIndex = 0;

      setTimeout(function () {
        if (options.value) {
          if (/\.stereo\./.test(options.value)) {
            _this.loadStereoImage(options.value);
          } else {
            _this.loadImage(options.value);
          }
        }
      });
      return _this;
    }

    _createClass(Image, [{
      key: "loadImage",
      value: function loadImage(i, src) {
        var _this2 = this;

        if (typeof i !== "number" && !(i instanceof Number)) {
          src = i;
          i = 0;
        }
        return new Promise(function (resolve, reject) {
          if (imageCache[src]) {
            resolve(imageCache[src]);
          } else if (src) {
            var temp = new HTMLImage();
            temp.addEventListener("load", function () {
              imageCache[src] = temp;
              resolve(imageCache[src]);
            }, false);
            temp.addEventListener("error", function () {
              reject("error loading image");
            }, false);
            temp.src = src;
          } else {
            reject("Image was null");
          }
        }).then(function (img) {
          _this2.setImage(i, img);
          return img;
        }).catch(function (err) {
          console.error("Failed to load image " + src);
          console.error(err);
          _this2.setImage(i, null);
        });
      }
    }, {
      key: "loadStereoImage",
      value: function loadStereoImage(src) {
        var _this3 = this;

        return this.loadImage(src).then(function (img) {
          var bounds = new Primrose.Text.Rectangle(0, 0, img.width / 2, img.height),
              a = new Primrose.Surface({
            id: _this3.id + "-left",
            bounds: bounds
          }),
              b = new Primrose.Surface({
            id: _this3.id + "-right",
            bounds: bounds
          });
          a.context.drawImage(img, 0, 0);
          b.context.drawImage(img, -bounds.width, 0);
          _this3.setImage(0, a.canvas);
          _this3.setImage(1, b.canvas);
          _this3.bounds.width = bounds.width;
          _this3.bounds.height = bounds.height;
          _this3.render();
          return _this3;
        });
      }
    }, {
      key: "getImage",
      value: function getImage(i) {
        return this._images[i % this._images.length];
      }
    }, {
      key: "setImage",
      value: function setImage(i, img) {
        this._images[i] = img;
        this.render();
        emit.call(this, "load", { target: this });
      }
    }, {
      key: "eyeBlank",
      value: function eyeBlank(eye) {
        this._currentImageIndex = eye;
        this.render();
      }
    }, {
      key: "render",
      value: function render(force) {
        if (this._changed || force) {
          if (this.resized) {
            this.resize();
          } else if (this.image !== this._lastImage) {
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
    }, {
      key: "image",
      get: function get() {
        return this.getImage(this._currentImageIndex);
      },
      set: function set(img) {
        this.setImage(this._currentImageIndex, img);
      }
    }, {
      key: "_changed",
      get: function get() {
        return this.resized || this.image !== this._lastImage;
      }
    }]);

    return Image;
  }(Primrose.Surface);

  return Image;
}();