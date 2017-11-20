/*
pliny.class({
  parent: "Primrose.Controls",
  name: "Model",
  baseClass: "Primrose.Controls.Entity",
  description: "An object loaded from a model file."
});
*/


import Entity from "./Entity";
import ModelFactory from "../Graphics/ModelFactory";

import { cache } from "../../util";

let COUNTER = 0;

export default class Model extends Entity {

  constructor(file, options) {
    name = options && options.id || "Primrose.Controls.Model[" + (COUNTER++) + "]";
    super(name, options);
    this._file = file;
    this._model = null;
  }

  get _ready() {
    return super._ready.then(() => cache(this._file, () =>
      ModelFactory.loadModel(this._file, this.options.type, this.options.progress))
    .then((factory) => {
      this._model = factory.clone();
      this.add(this._model);
      return this;
    }))
  }

};
