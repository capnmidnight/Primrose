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

      if (this.bounds.width === 0)
        console.log(this.id);

      this.canvas.width = this.bounds.width;
      this.canvas.height = this.bounds.height;

      if (this.context === null) {
        this.context = this.canvas.getContext("2d");
      }


      this.canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
      this.context.imageSmoothingEnabled = false;
      this.context.textBaseline = "top";
      
      //document.body.appendChild(this.canvas);
      //document.body.appendChild(Primrose.DOM.makeHidingContainer(this.id + "-hide", this.canvas));
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

    get width() {
      return this.canvas.width;
    }

    set width(v) {
      this.canvas.width = v;
    }

    get height() {
      return this.canvas.height;
    }

    set height(v) {
      this.canvas.height = v;
    }

    get elementWidth() {
      return (this.bounds && this.bounds.width) || (this.canvas.clientWidth * devicePixelRatio);
    }

    get elementHeight() {
      return (this.bounds && this.bounds.height) || (this.canvas.clientHeight * devicePixelRatio);
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

    setSize(width, height) {
      const oldWidth = this.canvas.width,
        oldHeight = this.canvas.height,
        rX = width / oldWidth,
        rY = heigh / oldHeight;
      this.canvas.width = width;
      this.canvas.height = height;
      this.bounds.left *= rX;
      this.bounds.top *= rY;
      this.bounds.width *= rX;
      this.bounds.width *= rY;

      for (let i = 0; i < this.children.length; ++i) {
        let child = this.children[i];
        if (child.setSize) {
          child.setSize(child.bounds.width * rX, child.bounds.height * rY);
        }
      }
    }

    mapUV(point) {
      return {
        x: point[0] * this.width,
        y: (1 - point[1]) * this.height
      };
    }

    unmapUV(point) {
      return [point.x / this.width, (1 - point.y / this.height)];
    }

    findChild(point, thunk) {
      let p = this.mapUV(point),
        found = false;
      for (let i = this.children.length - 1; i >= 0; --i) {
        let child = this.children[i];
        if (!found &&
          child.bounds.left <= p.x && p.x < child.bounds.right &&
          child.bounds.top <= p.y && p.y < child.bounds.bottom) {
          found = true;
          if (!child.focused) {
            child.focus();
          }
          let q = child.unmapUV({ x: p.x - child.bounds.left, y: p.y - child.bounds.top });
          thunk(child, q);
        }
        else if (child.focused) {
          child.blur();
        }
      }
      return found;
    }

    startUV(point) {
      return this.findChild(point, (child, q) => child.startUV(q));
    }

    moveUV(point) {
      return this.findChild(point, (child, q) => child.moveUV(q));
    }

    endPointer() {
      for (var i = 0; i < this.children.length; ++i) {
        this.children[i].endPointer();
      }
    }
  }

  return Surface;
})();
