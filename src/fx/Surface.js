pliny.class("Primrose", {
  name: "Surface",
  description: "Cascades through a number of options to eventually return a CanvasRenderingContext2D object on which one will perform drawing operations.",
  parameters: [
    { name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." },
    { name: "width", type: "Number", description: "The width of the surface to create." },
    { name: "height", type: "Number", description: "The height of the surface to create." }
  ]
});
Primrose.Surface = (function () {
  "use strict";

  class Surface extends Primrose.Entity {

    constructor(idOrCanvasOrContext, width, height) {
      super();

      if (height === undefined && width !== undefined) {
        height = width;
        width = idOrCanvasOrContext;
        idOrCanvasOrContext = undefined;
      }

      this.canvas = null;
      this.context = null;

      if (idOrCanvasOrContext instanceof Surface) {
        throw new Error("Object is already a Surface. Please don't try to wrap them.");
      }
      else if (idOrCanvasOrContext instanceof CanvasRenderingContext2D) {
        this.context = idOrCanvasOrContext;
        this.canvas = this.context.canvas;
      }
      else if (idOrCanvasOrContext instanceof HTMLCanvasElement) {
        this.canvas = idOrCanvasOrContext;
      }
      else if (typeof (idOrCanvasOrContext) === "string" || idOrCanvasOrContext instanceof String) {
        this.canvas = document.getElementById(idOrCanvasOrContext);
        if (this.canvas === null) {
          this.canvas = document.createElement("canvas");
          this.canvas.id = idOrCanvasOrContext;
        }
        else if (this.canvas.tagName !== "CANVAS") {
          this.canvas = null;
        }
      }
      else if (typeof (idOrCanvasOrContext) === "undefined") {
        this.canvas = document.createElement("canvas");
        this.canvas.id = idOrCanvasOrContext = "auto_canvas" + (Date.now() ^ (Math.random() * 0xffffffff));
      }

      if (this.canvas === null) {
        pliny.error({ name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation." });
        console.error(idOrCanvasOrContext);
        throw new Error(idOrCanvasOrContext + " does not refer to a valid canvas element.");
      }

      if (height !== undefined) {
        this.canvas.width = width;
        this.canvas.height = height;
      }

      if (this.context === null) {
        this.context = this.canvas.getContext("2d");
      }


      this.canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
      this.context.imageSmoothingEnabled = false;

      document.body.appendChild(this.canvas);

      this.id = this.canvas.id;
    }

    drawImage(image, bounds) {
      this.context.drawImage(image, bounds.left, bounds.top, bounds.width, bounds.height);
      if (this._material) {
        this._texture.needsUpdate = true;
        this._material.needsUpdate = true;
      }
      if (this.parent) {
        this.parent.drawImage(this.canvas, this.bounds);
      }
      else {
        console.log("no parent", this.id);
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

    setSize(width, height) {
      const oldWidth = this.canvas.width,
        oldHeight = this.canvas.height,
        rX = width / oldWidth,
        rY = heigh / oldHeight;
      this.canvas.width = width;
      this.canvas.height = height;

      for (let i = 0; i < this.children.length; ++i) {
        let child = this.children[i];
        if (child.setSize) {
          child.setSize(child.bounds.width * rX, child.bounds.height * rY);
        }
        if (child.bounds) {
          child.bounds.left *= rX;
          child.bounds.top *= rY;
          child.bounds.width *= rX;
          child.bounds.height *= rY;
        }
      }
    }

    startUV(point) {
      console.log("startUV", this.id);
      for (var i = 0; i < this.children.length; ++i) {
        console.log(this.children[i]);
      }
    }

    moveUV(point) {
      console.log("moveUV", this.id);
    }

    endPointer() {
      console.log("endPointer", this.id);
    }
  }

  return Surface;
})();
