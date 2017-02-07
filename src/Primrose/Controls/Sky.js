import quad from "../../live-api/quad";
import Entity from "./Entity";
import Image from "./Image";

import { DirectionalLight } from "three";

import { AmbientLight, BackSide } from "three";

export default class Sky extends Entity {

  constructor(options) {
    super("Sky", {
      transparent: false,
      useFog: false,
      unshaded: true,
      radius: options.drawDistance,
      texture: options.skyTexture,
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
      this.sun = new DirectionalLight(0xffffff, 1)
        .addTo(this)
        .at(0, 1, 1);
        this.add(this.sun.target);
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
