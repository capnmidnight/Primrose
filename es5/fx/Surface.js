"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

pliny.class({
  parent: "Primrose",
  name: "Surface",
  description: "Cascades through a number of options to eventually return a CanvasRenderingContext2D object on which one will perform drawing operations.",
  baseClass: "Primrose.Entity",
  parameters: [{ name: "options.id", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options.bounds", type: "Primrose.Text.Rectangle", description: "The size and location of the surface to create." }]
});
Primrose.Surface = function () {
  "use strict";

  var COUNTER = 0;

  var Surface = function (_Primrose$Entity) {
    _inherits(Surface, _Primrose$Entity);

    function Surface(options) {
      _classCallCheck(this, Surface);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Surface).call(this));

      options = patch(options, {
        id: "Primrose.Surface[" + COUNTER++ + "]"
      });
      _this.listeners.move = [];
      _this.bounds = options.bounds || new Primrose.Text.Rectangle();
      _this.canvas = null;
      _this.context = null;

      if (options.id instanceof Surface) {
        throw new Error("Object is already a Surface. Please don't try to wrap them.");
      } else if (options.id instanceof CanvasRenderingContext2D) {
        _this.context = options.id;
        _this.canvas = _this.context.canvas;
      } else if (options.id instanceof HTMLCanvasElement) {
        _this.canvas = options.id;
      } else if (typeof options.id === "string" || options.id instanceof String) {
        _this.canvas = document.getElementById(options.id);
        if (_this.canvas === null) {
          _this.canvas = document.createElement("canvas");
          _this.canvas.id = options.id;
        } else if (_this.canvas.tagName !== "CANVAS") {
          _this.canvas = null;
        }
      }

      if (_this.canvas === null) {
        pliny.error({ name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation." });
        console.error(_typeof(options.id));
        console.error(options.id);
        throw new Error(options.id + " does not refer to a valid canvas element.");
      }

      _this.id = _this.canvas.id;

      if (_this.bounds.width === 0) {
        _this.bounds.width = _this.imageWidth;
        _this.bounds.height = _this.imageHeight;
      }

      _this.imageWidth = _this.bounds.width;
      _this.imageHeight = _this.bounds.height;

      if (_this.context === null) {
        _this.context = _this.canvas.getContext("2d");
      }

      _this.canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
      _this.context.imageSmoothingEnabled = false;
      _this.context.textBaseline = "top";

      _this._texture = null;
      _this._material = null;
      return _this;
    }

    _createClass(Surface, [{
      key: "invalidate",
      value: function invalidate(bounds) {
        var useDefault = !bounds;
        if (!bounds) {
          bounds = this.bounds.clone();
          bounds.left = 0;
          bounds.top = 0;
        } else if (bounds instanceof Primrose.Text.Rectangle) {
          bounds = bounds.clone();
        }
        for (var i = 0; i < this.children.length; ++i) {
          var child = this.children[i],
              overlap = bounds.overlap(child.bounds);
          if (overlap) {
            var x = overlap.left - child.bounds.left,
                y = overlap.top - child.bounds.top;
            this.context.drawImage(child.canvas, x, y, overlap.width, overlap.height, overlap.x, overlap.y, overlap.width, overlap.height);
          }
        }
        if (this._texture) {
          this._texture.needsUpdate = true;
        }
        if (this._material) {
          this._material.needsUpdate = true;
        }
        if (this.parent && this.parent.invalidate) {
          bounds.left += this.bounds.left;
          bounds.top += this.bounds.top;
          this.parent.invalidate(bounds);
        }
      }
    }, {
      key: "resize",
      value: function resize() {
        this.setSize(this.surfaceWidth, this.surfaceHeight);
      }
    }, {
      key: "setSize",
      value: function setSize(width, height) {
        var oldTextBaseline = this.context.textBaseline,
            oldTextAlign = this.context.textAlign;
        this.imageWidth = width;
        this.imageHeight = height;

        this.context.textBaseline = oldTextBaseline;
        this.context.textAlign = oldTextAlign;
      }
    }, {
      key: "appendChild",
      value: function appendChild(child) {
        if (!(child instanceof Surface)) {
          throw new Error("Can only append other Surfaces to a Surface. You gave: " + child);
        }
        _get(Object.getPrototypeOf(Surface.prototype), "appendChild", this).call(this, child);
        this.invalidate();
      }
    }, {
      key: "mapUV",
      value: function mapUV(point) {
        return {
          x: point[0] * this.imageWidth,
          y: (1 - point[1]) * this.imageHeight
        };
      }
    }, {
      key: "unmapUV",
      value: function unmapUV(point) {
        return [point.x / this.imageWidth, 1 - point.y / this.imageHeight];
      }
    }, {
      key: "_findChild",
      value: function _findChild(x, y, thunk) {
        var here = this.inBounds(x, y),
            found = null;
        for (var i = this.children.length - 1; i >= 0; --i) {
          var child = this.children[i];
          if (!found && child.inBounds(x - this.bounds.left, y - this.bounds.top)) {
            found = child;
          } else if (child.focused) {
            child.blur();
          }
        }
        return found || here && this;
      }
    }, {
      key: "DOMInBounds",
      value: function DOMInBounds(x, y) {
        return this.inBounds(x * devicePixelRatio, y * devicePixelRatio);
      }
    }, {
      key: "UVInBounds",
      value: function UVInBounds(point) {
        return this.inBounds(point[0] * this.imageWidth, (1 - point[1]) * this.imageHeight);
      }
    }, {
      key: "inBounds",
      value: function inBounds(x, y) {
        return this.bounds.left <= x && x < this.bounds.right && this.bounds.top <= y && y < this.bounds.bottom;
      }
    }, {
      key: "startDOMPointer",
      value: function startDOMPointer(evt) {
        this.startPointer(x * devicePixelRatio, y * devicePixelRatio);
      }
    }, {
      key: "moveDOMPointer",
      value: function moveDOMPointer(evt) {
        this.movePointer(x * devicePixelRatio, y * devicePixelRatio);
      }
    }, {
      key: "startPointer",
      value: function startPointer(x, y) {
        if (this.inBounds(x, y)) {
          var target = this._findChild(x, y, function (child, x2, y2) {
            return child.startPointer(x2, y2);
          });
          if (target) {
            if (!this.focused) {
              this.focus();
            }
            emit.call(this, "click", { target: target, x: x, y: y });
            if (target !== this) {
              target.startPointer(x - this.bounds.left, y - this.bounds.top);
            }
          } else if (this.focused) {
            this.blur();
          }
        }
      }
    }, {
      key: "movePointer",
      value: function movePointer(x, y) {
        var target = this._findChild(x, y, function (child, x2, y2) {
          return child.startPointer(x2, y2);
        });
        if (target) {
          emit.call(this, "move", { target: target, x: x, y: y });
          if (target !== this) {
            target.movePointer(x - this.bounds.left, y - this.bounds.top);
          }
        }
      }
    }, {
      key: "startUV",
      value: function startUV(point) {
        var p = this.mapUV(point);
        this.startPointer(p.x, p.y);
      }
    }, {
      key: "moveUV",
      value: function moveUV(point) {
        var p = this.mapUV(point);
        this.movePointer(p.x, p.y);
      }
    }, {
      key: "imageWidth",
      get: function get() {
        return this.canvas.width;
      },
      set: function set(v) {
        this.canvas.width = v;
        this.bounds.width = v;
      }
    }, {
      key: "imageHeight",
      get: function get() {
        return this.canvas.height;
      },
      set: function set(v) {
        this.canvas.height = v;
        this.bounds.height = v;
      }
    }, {
      key: "elementWidth",
      get: function get() {
        return this.canvas.clientWidth * devicePixelRatio;
      },
      set: function set(v) {
        this.canvas.style.width = v / devicePixelRatio + "px";
      }
    }, {
      key: "elementHeight",
      get: function get() {
        return this.canvas.clientHeight * devicePixelRatio;
      },
      set: function set(v) {
        this.canvas.style.height = v / devicePixelRatio + "px";
      }
    }, {
      key: "surfaceWidth",
      get: function get() {
        return this.canvas.parentElement ? this.elementWidth : this.bounds.width;
      }
    }, {
      key: "surfaceHeight",
      get: function get() {
        return this.canvas.parentElement ? this.elementHeight : this.bounds.height;
      }
    }, {
      key: "resized",
      get: function get() {
        return this.imageWidth !== this.surfaceWidth || this.imageHeight !== this.surfaceHeight;
      }
    }, {
      key: "texture",
      get: function get() {
        if (!this._texture) {
          this._texture = new THREE.Texture(this.canvas);
        }
        return this._texture;
      }
    }]);

    return Surface;
  }(Primrose.Entity);

  return Surface;
}();