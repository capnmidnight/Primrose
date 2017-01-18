pliny.class({
  parent: "Primrose.Controls",
  name: "Entity",
  baseClass: "THREE.Object3D",
  description: "The Entity class is the parent class for all 3D controls. It manages a unique ID for every new control, the focus state of the control, and performs basic conversions from DOM elements to the internal Control format."
});

import { Object3D } from "three/src/core/Object3D";

export default class Entity extends Object3D {

  constructor(options) {
    super();
    this.isEntity = true;
    this.options = options || {};
    this.name = this.options && this.options.id || "";
    this.ready = this._ready.then(() => this);
  }

  get disabled() {
    return this._pickingObject && this._pickingObject.disabled;
  }

  set disabled(v) {
    if(this._pickingObject) {
      this._pickingObject.disabled = v;
    }
  }

  get _ready() {
    return Promise.resolve();
  }

  get _pickingObject() {
    return this.children[0];
  }

  addEventListener(event, listener) {
    this.ready.then(() =>
      this.children.forEach((child) =>
        child.addEventListener(event, listener)));
  }
};