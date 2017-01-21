pliny.class({
  parent: "Primrose.Controls",
  name: "BaseTextured",
  baseClass: "Primrose.Controls.Surface",
  description: "A simple 2D texture that has to be loaded from a file.",
  parameters: [{
    name: "options",
    type: "Object",
    description: "Named parameters for creating the textured object."
  }]
});

let COUNTER = 0;

import Entity from "./Entity";
import quad from "../../live-api/quad";
import shell from "../../live-api/shell";
import hub from "../../live-api/hub";

var entities = [];

pliny.function({
  parent: "Primrose.Controls.Entity",
  name: "updateAll",
  description: "Trigger the eyeBlank event for all registered entities.",
  parameters: [{
    name: "eye",
    type: "Number",
    description: "The eye to switch to: -1 for left, +1 for right."
  }]
});
export function updateAll(){
  entities.forEach((entity) => {
    entity.eyeBlank(0);
    entity.update();
  });
};

export function eyeBlankAll(eye) {
  entities.forEach((entity) =>
    entity.eyeBlank(eye));
};

export default class BaseTextured extends Entity {

  constructor(files, options) {
    options = Object.assign({
      id: files.join()
    }, options);

    super(options);

    entities.push(this);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    this._files = files;
    this._meshes = [];
    this._textures = [];
    this._currentImageIndex = 0;

    if(this.options.geometry){
      this._geometry = this.options.geometry;
    }
    else if(this.options.radius){
      this._geometry = shell(
        this.options.radius,
        72,
        36,
        Math.PI * 2,
        Math.PI,
        options);
    }
    else {
      if(!this.options.width){
        this.options.width = 0.5;
      }
      if(!this.options.height){
        this.options.height = 0.5;
      }
      this._geometry = quad(this.options.width, this.options.height, options);
    }
  }

  get _ready() {
    return super._ready
      .then(() => this._loadFiles(this._files, this.options.progress))
      .then(() => this._meshes.forEach((mesh) =>
        this.add(mesh)));
  }

  get blending() {
    return this._meshes && this._meshes.length > 0 && this._meshes[0] && this._meshes[0].material.blending;
  }

  set blending(v){
    this._meshes.forEach((mesh) => mesh.material.blending = v);
  }

  eyeBlank(eye) {
    if(this._meshes && this._meshes.length > 0) {
      this._currentImageIndex = eye % this._meshes.length;
      for(let i = 0; i < this._meshes.length; ++i){
        this._meshes[i].visible = (i === this._currentImageIndex);
      }
    }
  }

  update() {

  }
}