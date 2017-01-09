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

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    this._meshes = [];
    this._textures = [];
    this._currentImageIndex = 0;

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

    if(files) {
      this.ready = this._loadFiles(files, this.options.progress)
        .then(() => this._meshes.forEach((mesh) => this.add(mesh)))
        .then(() => this);
    }
    else{
      this.ready = Promise.resolve(this);
    }
  }

  _getFirstProp(name){
    return this._meshes && this._meshes.length > 0 && this._meshes[0][name];
  }

  _setFirstProp(name, value){
    if(this._meshes && this._meshes.length > 0) {
      this._meshes[0][name] = value;
    }
  }

  get disabled() {
    return this._getFirstProp("disabled");
  }

  set disabled(v) {
    this._setFirstProp("disabled", v);
  }

  get onselect(){
    return this._getFirstProp("onselect");
  }

  set onselect(v){
    this._setFirstProp("onselect", v);
  }

  get onenter(){
    return this._getFirstProp("onenter");
  }

  set onenter(v){
    this._setFirstProp("onenter", v);
  }

  get onexit(){
    return this._getFirstProp("onexit");
  }

  set onexit(v){
    this._setFirstProp("onexit", v);
  }

  addToBrowserEnvironment(env, scene) {
    scene.add(this);
    this.n = 10;
    return this.ready.then(() => {
      if(this.options.pickable && this._meshes.length > 0) {
        env.registerPickableObject(this._meshes[0]);
      }
    });
  }

  eyeBlank(eye) {
    if(this._meshes && this._meshes.length > 0) {
      this._currentImageIndex = eye % this._meshes.length;
      for(let i = 0; i < this._meshes.length; ++i){
        this._meshes[i].visible = (i === this._currentImageIndex);
      }
    }
  }

  update(){
  }
}