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
export default class BaseTextured extends Entity {

  constructor(files, options) {
    super(options.id);

    this.options = options;

    Entity.registerEntity(this);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    this._meshes = [];
    this._textures = [];
    this._currentImageIndex = 0;
    this._environment = null;
    this._pickableRegistered = false;
    this.object = hub();

    if(!this.options.geometry){
      if(this.options.radius){
        this.options.geometry = shell(
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
        this.options.geometry = quad(this.options.width, this.options.height, options);
      }
    }

    this.ready = this._loadFiles(files, this.options.progress)
    .then(() => this._registerPickableObjects())
    .then(() => this);
  }

  add(child){
    this.object.add(child);
  }

  get matrixWorld() {
    return this.object.matrixWorld;
  }

  get position(){
    return this.object.position;
  }

  get quaternion(){
    return this.object.quaternion;
  }

  get scale(){
    return this.object.scale;
  }

  get visible(){
    return this.object.visible;
  }

  set visible(v){
    this.object.visible = v;
  }

  addToBrowserEnvironment(env, scene) {
    scene.add(this.object);
    this._environment = env;
    this._registerPickableObjects();
  }

  _registerPickableObjects(){
    if(this._environment && this.options.pickable && this._meshes.length > 0 && !this._pickableRegistered){
      this._environment.registerPickableObject(this._meshes[0]);
      this._pickableRegistered = true;
    }
  }

  eyeBlank(eye) {
    if(this._meshes) {
      this._currentImageIndex = eye % this._meshes.length;
      for(let i = 0; i < this._meshes.length; ++i){
        this._meshes[i].visible = i === this._currentImageIndex;
      }
    }
  }

  update(){
  }
}