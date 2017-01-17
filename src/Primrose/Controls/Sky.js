import quad from "../../live-api/quad";
import Entity from "./Entity";
import Image from "./Image";

import light from "../../live-api/light";

import { AmbientLight } from "three/src/lights/AmbientLight";
import { BackSide } from "three/src/constants";

export default class Sky extends Entity {

  constructor(options) {
    super({
      id: "Sky",
      transparent: false,
      useFog: false,
      unshaded: true,
      radius: options.drawDistance,
      texture: options.skyTexture,
      pickable: true,
      progress: options.progress
    });

    this._image = null;

    if(options.disableDefaultLighting) {
      this.ambient = null;
      this.sun = null;
    }
    else{

      pliny.property({
        parent: "Primrose.Controls.Sky",
        name: "ambient",
        type: "THREE.AmbientLight",
        description: "If the `disableDefaultLighting` option is not present, the ambient light provides a fill light so that dark shadows do not completely obscure object details."
      });
      this.ambient = new AmbientLight(0xffffff, 0.5)
        .addTo(this);

      pliny.property({
        parent: "Primrose.Controls.Sky",
        name: "sun",
        type: "THREE.PointLight",
        description: "If the `disableDefaultLighting` option is not present, the sun light provides a key light so that objects have shading and relief."
      });
      this.sun = light(0xffffff, 1, 50)
        .addTo(this)
        .at(0, 10, 10);
    }
  }

  replace(files){
    this.options.texture = files;
    this.children.splice(0);
    return this._ready;
  }

  get _ready() {
    const type = typeof  this.options.texture;
    if(type === "number") {
      const skyDim = this.options.radius / Math.sqrt(2);
      this.options.side = BackSide;
      this.add(box(skyDim, skyDim, skyDim)
        .colored(this.options.texture, this.options));
    }
    else if(type === "string" || (this.options.texture instanceof Array && this.options.texture.length === 6 && typeof this.options.texture[0] === "string")) {
      this._image = new Image(this.options.texture, this.options);
      this.add(this._image);
    }

    return this._image && this._image.ready || super._ready;
  }


};