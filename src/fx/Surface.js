pliny.class("Primrose", {
  name: "Surface",
  description: "Cascades through a number of options to eventually return a CanvasRenderingContext2D object on which one will perform drawing operations.",
  parameters: [
    { name: "options.id", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." },
    { name: "options.bounds", type: "Primrose.Text.Rectangle", description: "The size and location of the surface to create." }
  ]
});
Primrose.Surface = (function () {
  "use strict";

  let COUNTER = 0;

  class Surface extends Primrose.Entity {

    constructor(options) {
      super();
      options = patch(options, {
        id: "Primrose.Surface[" + (COUNTER++) + "]"
      });
      this.canvas = null;
      this.context = null;
      this.bounds = options.bounds || new Primrose.Text.Rectangle();
      this.id = options.id;

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
        console.log(this.id);
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
    }


    invalidate(bounds) {
      bounds = clone(bounds);
      for (let i = 0; i < this.children.length; ++i) {
        const child = this.children[i];
        if (!(child.bounds.right < bounds.left || child.bounds.left > bounds.right ||
          child.bounds.bottom < bounds.top || child.bounds.right > bounds.buttom)) {
          this.context.drawImage(child.canvas, child.bounds.left, child.bounds.top);
          bounds.left = Math.min(bounds.left, child.bounds.left);
          bounds.top = Math.min(bounds.top, child.bounds.top);
          bounds.right = Math.max(bounds.right, child.bounds.right);
          bounds.bottom = Math.max(bounds.bottom, child.bounds.bottom);
        }
        else {
          console.log("did not draw", child.id);
        }
      }
      if (this._material) {
        this._texture.needsUpdate = true;
        this._material.needsUpdate = true;
      }
      if (this.parent && this.parent.invalidate) {
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

    resized() {
      return this.imageWidth !== this.surfaceWidth ||
        this.imageHeight !== this.surfaceHeight;
    }

    resize() {
      this.setSize(this.surfaceWidth, this.surfaceHeight);
    }

    setSize(width, height) {
      const oldWidth = this.imageWidth,
        oldHeight = this.imageHeight,
        rX = width / oldWidth,
        rY = height / oldHeight;
      this.imageWidth = width;
      this.imageHeight = height;
      this.bounds.left *= rX;
      this.bounds.top *= rY;

      for (let i = 0; i < this.children.length; ++i) {
        let child = this.children[i];
        if (child.setSize) {
          child.setSize(child.bounds.width * rX, child.bounds.height * rY);
        }
      }
    }

    get material() {
      if (!this._material) {
        this._material = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          transparent: false,
          side: THREE.DoubleSide,
          opacity: 1,
          map: this.texture
        });
      }
      return this._material;
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
      this.invalidate(child.bounds);
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
      let found = false;
      for (let i = this.children.length - 1; i >= 0; --i) {
        let child = this.children[i];
        if (!found &&
          child.bounds.left <= x && x < child.bounds.right &&
          child.bounds.top <= y && y < child.bounds.bottom) {
          found = true;
          if (!child.focused) {
            child.focus();
          }
          thunk(child, x - child.bounds.left, y - child.bounds.top);
        }
        else if (child.focused) {
          child.blur();
        }
      }
      return found;
    }

    startDOMPointer(x, y) {
      return this.startPointer(x * devicePixelRatio, y * devicePixelRatio);
    }

    moveDOMPointer(x, y) {
      return this.movePointer(x * devicePixelRatio, y * devicePixelRatio);
    }

    startPointer(x, y) {
      return this._findChild(x, y, (child, x2, y2) => child.startPointer(x2, y2));
    }

    movePointer(x, y) {
      return this._findChild(x, y, (child, x2, y2) => child.movePointer(x2, y2));
    }

    startUV(point) {
      var p = this.mapUV(point);
      return this.startPointer(p.x, p.y);
    }

    moveUV(point) {
      var p = this.mapUV(point);
      return this.movePointer(p.x, p.y);
    }

    endPointer() {
      for (var i = 0; i < this.children.length; ++i) {
        this.children[i].endPointer();
      }
    }
  }

  return Surface;
})();
