pliny.class({
  parent: "Primrose",
  name: "Surface",
  description: "Cascades through a number of options to eventually return a CanvasRenderingContext2D object on which one will perform drawing operations.",
  baseClass: "Primrose.Entity",
  parameters: [
    { name: "options.id", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." },
    { name: "options.bounds", type: "Primrose.Text.Rectangle", description: "The size and location of the surface to create." }
  ]
});
Primrose.Surface = (function () {
  "use strict";

  var COUNTER = 0;

  class Surface extends Primrose.Entity {

    constructor(options) {
      super();
      options = patch(options, {
        id: "Primrose.Surface[" + (COUNTER++) + "]"
      });
      this.listeners.move = [];
      this.bounds = options.bounds || new Primrose.Text.Rectangle();
      this.canvas = null;
      this.context = null;

      if (options.id instanceof Surface) {
        throw new Error("Object is already a Surface. Please don't try to wrap them.");
      }
      else if (options.id instanceof CanvasRenderingContext2D) {
        this.context = options.id;
        this.canvas = this.context.canvas;
      }
      else if (options.id instanceof HTMLCanvasElement) {
        this.canvas = options.id;
      }
      else if (typeof (options.id) === "string" || options.id instanceof String) {
        this.canvas = document.getElementById(options.id);
        if (this.canvas === null) {
          this.canvas = document.createElement("canvas");
          this.canvas.id = options.id;
        }
        else if (this.canvas.tagName !== "CANVAS") {
          this.canvas = null;
        }
      }

      if (this.canvas === null) {
        pliny.error({ name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation." });
        console.error(typeof (options.id));
        console.error(options.id);
        throw new Error(options.id + " does not refer to a valid canvas element.");
      }

      this.id = this.canvas.id;

      if (this.bounds.width === 0) {
        this.bounds.width = this.imageWidth;
        this.bounds.height = this.imageHeight;
      }

      this.imageWidth = this.bounds.width;
      this.imageHeight = this.bounds.height;

      if (this.context === null) {
        this.context = this.canvas.getContext("2d");
      }

      this.canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
      this.context.imageSmoothingEnabled = false;
      this.context.textBaseline = "top";

      this._texture = null;
      this._material = null;
    }


    invalidate(bounds) {
      var useDefault = !bounds;
      if (!bounds) {
        bounds = this.bounds.clone();
        bounds.left = 0;
        bounds.top = 0;
      }
      else if(bounds instanceof Primrose.Text.Rectangle){
        bounds = bounds.clone();
      }
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i],
          overlap = bounds.overlap(child.bounds);
        if (overlap) {
          var x = overlap.left - child.bounds.left,
            y = overlap.top - child.bounds.top;
          this.context.drawImage(
            child.canvas,
            x, y, overlap.width, overlap.height,
            overlap.x, overlap.y, overlap.width, overlap.height);
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

    get imageWidth() {
      return this.canvas.width;
    }

    set imageWidth(v) {
      this.canvas.width = v;
      this.bounds.width = v;
    }

    get imageHeight() {
      return this.canvas.height;
    }

    set imageHeight(v) {
      this.canvas.height = v;
      this.bounds.height = v;
    }

    get elementWidth() {
      return this.canvas.clientWidth * devicePixelRatio;
    }

    set elementWidth(v) {
      this.canvas.style.width = (v / devicePixelRatio) + "px";
    }

    get elementHeight() {
      return this.canvas.clientHeight * devicePixelRatio;
    }

    set elementHeight(v) {
      this.canvas.style.height = (v / devicePixelRatio) + "px";
    }

    get surfaceWidth() {
      return this.canvas.parentElement ? this.elementWidth : this.bounds.width;
    }

    get surfaceHeight() {
      return this.canvas.parentElement ? this.elementHeight : this.bounds.height;
    }

    get resized() {
      return this.imageWidth !== this.surfaceWidth ||
        this.imageHeight !== this.surfaceHeight;
    }

    resize() {
      this.setSize(this.surfaceWidth, this.surfaceHeight);
    }

    setSize(width, height) {
      const oldTextBaseline = this.context.textBaseline,
        oldTextAlign = this.context.textAlign;
      this.imageWidth = width;
      this.imageHeight = height;

      this.context.textBaseline = oldTextBaseline;
      this.context.textAlign = oldTextAlign;
    }

    get texture() {
      if (!this._texture) {
        this._texture = new THREE.Texture(this.canvas);
      }
      return this._texture;
    }

    appendChild(child) {
      if (!(child instanceof Surface)) {
        throw new Error("Can only append other Surfaces to a Surface. You gave: " + child);
      }
      super.appendChild(child);
      this.invalidate();
    }

    mapUV(point) {
      return {
        x: point[0] * this.imageWidth,
        y: (1 - point[1]) * this.imageHeight
      };
    }

    unmapUV(point) {
      return [point.x / this.imageWidth, (1 - point.y / this.imageHeight)];
    }

    _findChild(x, y, thunk) {
      var here = this.inBounds(x, y),
        found = null;
      for (var i = this.children.length - 1; i >= 0; --i) {
        var child = this.children[i];
        if (!found && child.inBounds(x - this.bounds.left, y - this.bounds.top)) {
          found = child;
        }
        else if (child.focused) {
          child.blur();
        }
      }
      return found || here && this;
    }

    DOMInBounds(x, y) {
      return this.inBounds(x * devicePixelRatio, y * devicePixelRatio);
    }

    UVInBounds(point) {
      return this.inBounds(point[0] * this.imageWidth, (1 - point[1]) * this.imageHeight);
    }

    inBounds(x, y) {
      return this.bounds.left <= x && x < this.bounds.right && this.bounds.top <= y && y < this.bounds.bottom;
    }

    startDOMPointer(evt) {
      this.startPointer(x * devicePixelRatio, y * devicePixelRatio);
    }

    moveDOMPointer(evt) {
      this.movePointer(x * devicePixelRatio, y * devicePixelRatio);
    }

    startPointer(x, y) {
      if (this.inBounds(x, y)) {
        var target = this._findChild(x, y, (child, x2, y2) => child.startPointer(x2, y2));
        if (target) {
          if (!this.focused) {
            this.focus();
          }
          emit.call(this, "click", { target, x, y });
          if (target !== this) {
            target.startPointer(x - this.bounds.left, y - this.bounds.top);
          }
        }
        else if (this.focused) {
          this.blur();
        }
      }
    }

    movePointer(x, y) {
      var target = this._findChild(x, y, (child, x2, y2) => child.startPointer(x2, y2));
      if (target) {
        emit.call(this, "move", { target, x, y });
        if (target !== this) {
          target.movePointer(x - this.bounds.left, y - this.bounds.top);
        }
      }
    }

    startUV(point) {
      var p = this.mapUV(point);
      this.startPointer(p.x, p.y);
    }

    moveUV(point) {
      var p = this.mapUV(point);
      this.movePointer(p.x, p.y);
    }
  }

  return Surface;
})();
