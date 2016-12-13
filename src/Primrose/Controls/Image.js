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

let COUNTER = 0;

import BaseTextured from "./BaseTextured";
import textured from "../../live-api/textured";
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
          progress: progress,
          resolve: (txt) => {
            this._textures[i] = txt;
            this.object.add(this._meshes[i]);
          }
        });

        this._meshes[i] = textured(
          this.options.geometry,
          src,
          loadOptions);
        return loadOptions.promise;
      }));
  }
}