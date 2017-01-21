import quad from "../../live-api/quad";
import Entity from "./Entity";
import Image from "./Image";

export default class Ground extends Entity {

  constructor(options) {
    super({
      id: "Ground",
      transparent: false,
      dim: options.drawDistance,
      texture: options.groundTexture,
      progress: options.progress
    });

    this._image = null;

    this.ready = this.ready.then(() =>
      this.children.forEach((mesh) =>
        mesh.rot(-Math.PI / 2, 0, 0)));
  }

  get _ready() {
    const dim = this.options.dim,
      type = typeof  this.options.texture;

    if(type === "number") {
      this.add(quad(dim, dim)
        .colored(this.options.texture, this.options)
        .named(this.name + "-" + this.options.texture));
    }
    else if(type === "string") {
      this._image = new Image(this.options.texture, Object.assign({}, this.options, {
        width: dim,
        height: dim,
        txtRepeatX: dim,
        txtRepeatY: dim,
        anisotropy: 8
      }));
      this.add(this._image);
    }

    return this._image && this._image.ready || super._ready;
  }
};