/*
pliny.class({
  parent: "Primrose.Controls",
  name: "Image",
  baseClass: "Primrose.Controls.BaseTextured",
  description: "A simple 2D image to put on a Surface.",
  parameters: [{
    name: "options",
    type: "Object",
    description: "Named parameters for creating the Image."
  }]
});
*/

import { textured } from "../../live-api";

import BaseTextured from "./BaseTextured";


let COUNTER = 0;

export default class Image extends BaseTextured {

  constructor(images, options) {
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////
    if(!(images instanceof Array)) {
      images = [images];
    }

    options = Object.assign({}, {
      id: "Primrose.Controls.Image[" + (COUNTER++) + "]"
    }, options);

    super(images, options);
  }

  _loadFiles(images, progress) {
    return Promise.all(Array.prototype.map.call(images, (src, i) => {
      const loadOptions = Object.assign({}, this.options, {
        progress: progress
      });

      this._meshes[i] = this._geometry.textured(src, loadOptions)
        .named(this.name + "-mesh-" + i);

      return loadOptions.promise.then((txt) => this._textures[i] = txt);
    }));
  }
}
