/*
pliny.class({
  parent: "Primrose.Controls",
  name: "Surface",
  baseClass: "Primrose.Controls.BaseTextured",
  description: "Cascades through a number of options to eventually return a CanvasRenderingContext2D object on which one will perform drawing operations.",
  parameters: [{
    name: "options",
    type: "Primrose.Controls.Surface.optionsHash",
    optional: true,
    description: "Optional settings for creating the surface, including ID and Bounds. See [`Primrose.Controls.Surface.optionsHash`](#Primrose_Controls_Surface_optionsHash) for more information."
  }]
});
*/

/*
pliny.record({
  parent: "Primrose.Controls.Surface",
  name: "optionsHash",
  parameters: [{
    name: "id",
    type: "String or HTMLCanvasElement or CanvasRenderingContext2D",
    description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created."
  }, {
    name: "bounds",
    type: "Primrose.Text.Rectangle",
    description: "The size and location of the surface to create."
  }]
});
*/

var COUNTER = 0;

import { Texture } from "three";
import { isChrome } from "../../flags";
import BaseTextured from "./BaseTextured";
import Rectangle from "../Text/Rectangle";
import { textured,  quad, shell }from "../../live-api";

export default class Surface extends BaseTextured {

  constructor(options) {
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "focus", description: "If the element is focusable, occurs when the user clicks on an element for the first time, or when a program calls the `focus()` method." });
*/
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "blur", description: "If the element is focused (which implies it is also focusable), occurs when the user clicks off of an element, or when a program calls the `blur()` method." });
*/
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "click", description: "Occurs whenever the user clicks on an element." });
*/
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "keydown", description: "Occurs when the user pushes a key down while focused on the element." });
*/
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "keyup", description: "Occurs when the user releases a key while focused on the element." });
*/
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "paste", description: "Occurs when the user activates the clipboard's `paste` command while focused on the element." });
*/
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "cut", description: "Occurs when the user activates the clipboard's `cut` command while focused on the element." });
*/
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "copy", description: "Occurs when the user activates the clipboard's `copy` command while focused on the element." });
*/
    /*
    pliny.event({ parent: "Primrose.Controls.Surface", name: "wheel", description: "Occurs when the user scrolls the mouse wheel while focused on the element." });
*/



    options = Object.assign({}, {
      id: "Primrose.Controls.Surface[" + (COUNTER++) + "]",
      bounds: new Rectangle()
    }, options);

    if(options.width) {
      options.bounds.width = options.width;
    }

    if(options.height) {
      options.bounds.height = options.height;
    }

    let canvas = null,
      context = null;

    if (options.id instanceof Surface) {
      throw new Error("Object is already a Surface. Please don't try to wrap them.");
    }
    else if (options.id instanceof CanvasRenderingContext2D) {
      context = options.id;
      canvas = context.canvas;
    }
    else if (options.id instanceof HTMLCanvasElement) {
      canvas = options.id;
    }
    else if (typeof (options.id) === "string" || options.id instanceof String) {
      canvas = document.getElementById(options.id);
      if (canvas === null) {
        canvas = document.createElement("canvas");
        canvas.id = options.id;
      }
      else if (canvas.tagName !== "CANVAS") {
        canvas = null;
      }
    }

    if (canvas === null) {
      /*
      pliny.error({
        parent: "Primrose.Controls.Surface",
        name: "Invalid element",
        type: "Error",
        description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation."
      });
      */
      console.error(typeof (options.id));
      console.error(options.id);
      throw new Error(options.id + " does not refer to a valid canvas element.");
    }

    super([canvas], options);
    this.isSurface = true;
    this.bounds = this.options.bounds;
    this.canvas = canvas;
    this.context = context || this.canvas.getContext("2d");
    this._opacity = 1;

    /*
    pliny.property({
      parent: "Primrose.Controls.Surface",
      name: "focused",
      type: "Boolean",
      description: "A flag indicating if the element, or a child element within it, has received focus from the user."
    });
    */
    this.focused = false;

    /*
    pliny.property({
      parent: "Primrose.Controls.Surface",
      name: "focusable",
      type: "Boolean",
      description: "A flag indicating if the element, or any child elements within it, is capable of receiving focus."
    });
    */
    this.focusable = true;

    this.style = {};

    Object.defineProperties(this.style, {
      width: {
        get: () => {
          return this.bounds.width;
        },
        set: (v) => {
          this.bounds.width = v;
          this.resize();
        }
      },
      height: {
        get: () => {
          return this.bounds.height;
        },
        set: (v) => {
          this.bounds.height = v;
          this.resize();
        }
      },
      left: {
        get: () => {
          return this.bounds.left;
        },
        set: (v) => {
          this.bounds.left = v;
        }
      },
      top: {
        get: () => {
          return this.bounds.top;
        },
        set: (v) => {
          this.bounds.top = v;
        }
      },
      opacity: {
        get: () => {
          return this._opacity;
        },
        set: (v) => {
          this._opacity = v;
        }
      },
      fontSize: {
        get: () => {
          return this.fontSize;
        },
        set: (v) => {
          this.fontSize = v;
        }
      },
      backgroundColor: {
        get: () => {
          return this.backgroundColor;
        },
        set: (v) => {
          this.backgroundColor = v;
        }
      },
      color: {
        get: () => {
          return this.color;
        },
        set: (v) => {
          this.color = v;
        }
      }
    });

    if (this.bounds.width === 0) {
      this.bounds.width = this.imageWidth;
      this.bounds.height = this.imageHeight;
    }

    this.imageWidth = this.bounds.width;
    this.imageHeight = this.bounds.height;

    this.canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
    this.context.imageSmoothingEnabled = false;
    this.context.textBaseline = "top";

    this.subSurfaces = [];

    this.render = this.render.bind(this);

    this.on("focus", this.render)
      .on("blur", this.render)
      .on("pointerstart", this.startUV.bind(this))
      .on("pointermove", this.moveUV.bind(this))
      .on("gazemove", this.moveUV.bind(this))
      .on("pointerend", this.endPointer.bind(this))
      .on("gazecomplete", (evt) => {
        this.startUV(evt);
        setTimeout(() => this.endPointer(evt), 100);
      })
      .on("keydown", this.keyDown.bind(this))
      .on("keyup", this.keyUp.bind(this));

    this.render();
  }

  get pickable() {
    return true;
  }


  _loadFiles(canvases, progress) {
    return Promise.all(canvases.map((canvas, i) => {
      const loadOptions = Object.assign({}, this.options);
      this._meshes[i] = this._geometry.textured(canvas, loadOptions);
      return loadOptions.promise.then((txt) => this._textures[i] = txt);
    }));
  }

  invalidate(bounds) {
    var useDefault = !bounds;
    if (!bounds) {
      bounds = this.bounds.clone();
      bounds.left = 0;
      bounds.top = 0;
    }
    else if (bounds.isRectangle) {
      bounds = bounds.clone();
    }
    for (var i = 0; i < this.subSurfaces.length; ++i) {
      var subSurface = this.subSurfaces[i],
        overlap = bounds.overlap(subSurface.bounds);
      if (overlap) {
        var x = overlap.left - subSurface.bounds.left,
          y = overlap.top - subSurface.bounds.top;
        this.context.drawImage(
          subSurface.canvas,
          x, y, overlap.width, overlap.height,
          overlap.x, overlap.y, overlap.width, overlap.height);
      }
    }
    if (this._textures[0]) {
      this._textures[0].needsUpdate = true;
    }
    if (this._meshes[0]) {
      this._meshes[0].material.needsUpdate = true;
    }
    if (this.parent instanceof Surface) {
      bounds.left += this.bounds.left;
      bounds.top += this.bounds.top;
      this.parent.invalidate(bounds);
    }
  }

  render() {
    this.invalidate();
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

  get environment() {
    var head = this;
    while(head){
      if(head._environment){
        if(head !== this){
          this._environment = head._environment;
        }
        return this._environment;
      }
      head = head.parent;
    }
  }

  add(child) {
    if(child.isSurface) {
      this.subSurfaces.push(child);
      this.invalidate();
    }
    else if (child.isObject3D) {
      super.add(child);
    }
    else {
      throw new Error("Can only append other Surfaces to a Surface. You gave: " + child);
    }
  }

  mapUV(point) {
    if(point instanceof Array){
      return {
        x: point[0] * this.imageWidth,
        y: (1 - point[1]) * this.imageHeight
      };
    }
    else if(point.isVector2) {
      return {
        x: point.x * this.imageWidth,
        y: (1 - point.y) * this.imageHeight
      };
    }
  }

  unmapUV(point) {
    return [point.x / this.imageWidth, (1 - point.y / this.imageHeight)];
  }

  _findSubSurface(x, y, thunk) {
    var here = this.inBounds(x, y),
      found = null;
    for (var i = this.subSurfaces.length - 1; i >= 0; --i) {
      var subSurface = this.subSurfaces[i];
      if (!found && subSurface.inBounds(x - this.bounds.left, y - this.bounds.top)) {
        found = subSurface;
      }
      else if (subSurface.focused) {
        subSurface.blur();
      }
    }
    return found || here && this;
  }

  inBounds(x, y) {
    return this.bounds.left <= x && x < this.bounds.right && this.bounds.top <= y && y < this.bounds.bottom;
  }

  startPointer(x, y) {
    if (this.inBounds(x, y)) {
      var target = this._findSubSurface(x, y, (subSurface, x2, y2) => subSurface.startPointer(x2, y2));
      if (target) {
        if (!this.focused) {
          this.focus();
        }
        this.emit("click", {
          target,
          x,
          y
        });
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
    var target = this._findSubSurface(x, y, (subSurface, x2, y2) => subSurface.startPointer(x2, y2));
    if (target) {
      this.emit("move", {
        target,
        x,
        y
      });
      if (target !== this) {
        target.movePointer(x - this.bounds.left, y - this.bounds.top);
      }
    }
  }

  _forFocusedSubSurface(name, evt) {
    var elem = this.focusedElement;
    if (elem && elem !== this) {
      elem[name](evt);
      return true;
    }
    return false;
  }

  startUV(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "startUV",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The pointer event to read"
      }],
      description: "Hooks up to the window's `mouseDown` and `touchStart` events, with coordinates translated to tangent-space UV coordinates, and propagates it to any of its focused subSurfaces."
    });
    */
    if(!this._forFocusedSubSurface("startUV", evt)){
      var p = this.mapUV(evt.hit.uv);
      this.startPointer(p.x, p.y);
    }
  }

  moveUV(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "moveUV",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The pointer event to read"
      }],
      description: "Hooks up to the window's `mouseMove` and `touchMove` events, with coordinates translated to tangent-space UV coordinates, and propagates it to any of its focused subSurfaces."
    });
    */
    if(!this._forFocusedSubSurface("moveUV", evt)) {
      var p = this.mapUV(evt.hit.uv);
      this.movePointer(p.x, p.y);
    }
  }

  endPointer(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "endPointer",
      description: "Hooks up to the window's `mouseUp` and `toucheEnd` events and propagates it to any of its focused subSurfaces."
    });
    */
    this._forFocusedSubSurface("endPointer", evt);
  }

  focus() {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "focus",
      description: "If the control is focusable, sets the focus property of the control, does not change the focus property of any other control.",
      examples: [{
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
  grammar(\"JavaScript\");\n\
  var ctrls = [\n\
  new Primrose.Controls.TextBox(),\n\
  new Primrose.Controls.TextBox(),\n\
  new Primrose.Controls.Button()\n\
  ];\n\
  \n\
  function focusOn(id){\n\
    for(var i = 0; i < ctrls.length; ++i){\n\
      var c = ctrls[i];\n\
      if(c.controlID === id){\n\
        c.focus();\n\
      }\n\
      else{\n\
        c.blur();\n\
      }\n\
    }\n\
  }"
      }]
    });
    */

    if (this.focusable && !this.focused) {
      this.focused = true;
      this.emit("focus");
    }
  }

  blur() {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "blur",
      description: "If the element is focused, unsets the focus property of the control and all child controls. Does not change the focus property of any parent or sibling controls.",
      examples: [{
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
  grammar(\"JavaScript\");\n\
  var ctrls = [\n\
  new Primrose.Controls.TextBox(),\n\
  new Primrose.Controls.TextBox(),\n\
  new Primrose.Controls.Button()\n\
  ];\n\
  \n\
  function focusOn(id){\n\
    for(var i = 0; i < ctrls.length; ++i){\n\
      var c = ctrls[i];\n\
      if(c.controlID === id){\n\
        c.focus();\n\
      }\n\
      else{\n\
        c.blur();\n\
      }\n\
    }\n\
  }"
      }]
    });
    */
    if (this.focused) {
      this.focused = false;
      for (var i = 0; i < this.subSurfaces.length; ++i) {
        if (this.subSurfaces[i].focused) {
          this.subSurfaces[i].blur();
        }
      }
      this.emit("blur");
    }
  }

  get theme() {
    /*
    pliny.property({
      parent: "Primrose.Controls.Surface",
      name: "theme",
      type: "Primrose.Text.Themes.*",
      description: "Get or set the theme used for rendering text on any controls in the control tree."
    });
    */
    return null;
  }

  set theme(v) {
    for (var i = 0; i < this.subSurfaces.length; ++i) {
      this.subSurfaces[i].theme = v;
    }
  }

  get lockMovement() {
    /*
    pliny.property({
      parent: "Primrose.Controls.Surface",
      name: "lockMovement",
      type: "Boolean",
      description: "Recursively searches the deepest leaf-node of the control graph for a control that has its `lockMovement` property set to `true`, indicating that key events should not be used to navigate the user, because they are being interpreted as typing commands."
    });
    */
    var lock = false;
    for (var i = 0; i < this.subSurfaces.length && !lock; ++i) {
      lock = lock || this.subSurfaces[i].lockMovement;
    }
    return lock;
  }

  get focusedElement() {
    /*
    pliny.property({
      parent: "Primrose.Controls.Surface",
      name: "focusedElement",
      type: "Primrose.Controls.Surface",
      description: "Searches the deepest leaf-node of the control graph for a control that has its `focused` property set to `true`."
    });
    */
    var result = null,
      head = this;
    while (head && head.focused) {
      result = head;
      var subSurfaces = head.subSurfaces;
      head = null;
      for (var i = 0; i < subSurfaces.length; ++i) {
        var subSurface = subSurfaces[i];
        if (subSurface.focused) {
          head = subSurface;
        }
      }
    }
    return result;
  }

  keyDown(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "keyDown",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The key event to read"
      }],
      description: "Hooks up to the window's `keyDown` event and propagates it to any of its focused subSurfaces."
    });
    */
    this._forFocusedSubSurface("keyDown", evt);
  }

  keyUp(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "keyUp",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The key event to read"
      }],
      description: "Hooks up to the window's `keyUp` event and propagates it to any of its focused subSurfaces."
    });
    */
    this._forFocusedSubSurface("keyUp", evt);
  }

  readClipboard(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "readClipboard",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `paste` event and propagates it to any of its focused subSurfaces."
    });
    */
    this._forFocusedSubSurface("readClipboard", evt);
  }

  copySelectedText(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "copySelectedText",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `copy` event and propagates it to any of its focused subSurfaces."
    });
    */
    this._forFocusedSubSurface("copySelectedText", evt);
  }

  cutSelectedText(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "cutSelectedText",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `cut` event and propagates it to any of its focused subSurfaces."
    });
    */
    this._forFocusedSubSurface("cutSelectedText", evt);
  }

  readWheel(evt) {
    /*
    pliny.method({
      parent: "Primrose.Controls.Surface",
      name: "readWheel",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The wheel event to read"
      }],
      description: "Hooks up to the window's `wheel` event and propagates it to any of its focused subSurfaces."
    });
    */
    this._forFocusedSubSurface("readWheel", evt);
  }
}
