import quad from "../../live-api/quad";
import Entity from "./Entity";
import Image from "./Image";
import Pointer from "../Pointer";

export default class Ground extends Entity {

  constructor(options) {
    super("Ground", {
      transparent: false,
      dim: options.drawDistance,
      texture: options.groundTexture,
      shadow: options.enableShadows,
      progress: options.progress
    });

    this._image = null;

    this.ready = this.ready.then(() => {
      this.children.forEach((mesh) =>
        mesh.rot(-Math.PI / 2, 0, 0));
    });
  }

  get _ready() {
    const dim = this.options.dim,
      type = typeof  this.options.texture;

    if(type === "number") {
      this._image = quad(dim, dim)
        .colored(this.options.texture, this.options);
    }
    else if(type === "string") {
      this._image = new Image(this.options.texture, Object.assign({}, this.options, {
        width: dim,
        height: dim,
        txtRepeatX: dim,
        txtRepeatY: dim,
        anisotropy: 8
      }));
    }

    if(this._image) {
      this._image
        .named(this.name + "-" + this.options.texture)
        .addTo(this);

      this.watch(this._image, Pointer.EVENTS);
    }

    return this._image && this._image.ready || super._ready;
  }
};