/*
pliny.class({
  parent: "Primrose.Controls",
  name: "Entity",
  baseClass: "THREE.Object3D",
  description: "The Entity class is the parent class for all 3D controls. It manages a unique ID for every new control, the focus state of the control, and performs basic conversions from DOM elements to the internal Control format."
});
*/

import { Object3D, Euler, Quaternion } from "three";


const TEMP_EULER = new Euler(),
  TEMP_QUAT = new Quaternion(),
  entities = [];

export function preStepAllEntities() {
  for(let i = 0; i < entities.length; ++i) {
    entities[i].preStep();
  }
}

export function postStepAllEntities() {
  for(let i = 0; i < entities.length; ++i) {
    entities[i].postStep();
  }
}

export function updateAllEntities() {
  for(let i = 0; i < entities.length; ++i) {
    entities[i].update();
  }
}

export default class Entity extends Object3D {

  constructor(name, options) {
    super();
    this.isEntity = true;
    this.name = name;
    this.options = options || {};
    this.ready = this._ready.then(() => this);
    this.disabled = false;
    this.mesh = null;
    this.rigidBody = null;
    this.components = [];
    entities.push(this);
  }

  get _ready() {
    return Promise.resolve();
  }

  updateMatrix() {
    if(this.rigidBody) {
      this.position.copy(this.rigidBody.position);
      this.quaternion.copy(this.rigidBody.quaternion);
    }
    super.updateMatrix();
  }

  at(x, y, z) {
    if(this.rigidBody) {
      this.rigidBody.position.set(x, y, z);
    }
    else{
      this.position.set(x, y, z);
    }
    return this;
  }

  rot(x, y, z) {
    TEMP_EULER.set(x, y, z);
    TEMP_QUAT.setFromEueler(TEMP_EULER);
    if(this.rigidBody) {
      this.rigidBody.quaternion.copy(TEMP_QUAT);
    }
    else{
      this.quaternion.copy(TEMP_QUAT);
    }
    return this;
  }

  vel(x, y, z) {
    if(this.rigidBody) {
      this.rigidBody.velocity.set(x, y, z);
    }
    return this;
  }

  get velocity() {
    if(this.rigidBody) {
      return this.rigidBody.velocity;
    }
  }

  get angularVelocity() {
    if(this.rigidBody){
      return this.rigidBody.angularVelocity;
    }
  }

  get position() {
    return this.rigidBody && this.rigidBody.position || super.position;
  }

  get quaternion() {
    return this.rigidBody && this.rigidBody.quaternion || super.quaternion;
  }

  linearDamping(v) {
    if(this.rigidBody){
      this.rigidBody.linearDamping = v;
    }
    return this;
  }

  angularDamping(v) {
    if(this.rigidBody){
      this.rigidBody.angularDamping = v;
    }
    return this;
  }

  angVel(x, y, z) {
    if(this.rigidBody) {
      this.rigidBody.angularVelocity.set(x, y, z);
    }
    return this;
  }

  addShape(shape) {
    if(this.rigidBody) {
      this.rigidBody.addShape(shape);
    }
    return this;
  }

  preStep() {
    for(let i = 0; i < this.components.length; ++i) {
      this.components[i].preStep();
    }
  }

  postStep() {
    for(let i = 0; i < this.components.length; ++i) {
      this.components[i].postStep();
    }
  }

  update() {
    for(let i = 0; i < this.components.length; ++i) {
      this.components[i].update();
    }
  }
};
