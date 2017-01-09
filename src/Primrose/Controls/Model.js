pliny.class({
  parent: "Primrose.Controls",
  name: "Model",
  baseClass: "Primrose.Controls.Entity",
  description: "An object loaded from a model file."
});


import Entity from "./Entity";
import ModelFactory from "../Graphics/ModelFactory";
import cache from "../../util/cache";

let COUNTER = 0;

export default class Model extends Entity {

  constructor(file, options) {
    options = Object.assign({
      id: "Primrose.Controls.Model[" + (COUNTER++) + "]"
    }, options);
    super(options);
    this._file = file;
    this._model = null;
  }

  get _ready() {
    return super._ready.then(() => cache(this._file, () =>
      ModelFactory.loadModel(this._file, options.type, options.progress))
    .then((factory) => {
      this._model = factory.clone();
      this.add(this._model);
      return this;
    }))
  }

  get _pickingObject() {
    return this._model;
  }

};