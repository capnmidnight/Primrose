import quad from "../../live-api/quad";
import Entity from "./Entity";
import Image from "./Image";
import Pointer from "../Pointer";
import ModelFactory from "../Graphics/ModelFactory";

export default class Ground extends Entity {

  constructor(options) {
    super("Ground", {
      transparent: false,
      dim: options.drawDistance,
      texture: options.groundTexture,
      model: options.groundModel,
      shadow: options.enableShadows,
      progress: options.progress
    });

    this.model = null;
    this.isInfinite = true;
  }

  get _ready() {
    const dim = this.options.dim,
      type = typeof  this.options.texture;

    let promise = null;

    if(this.options.model) {
      promise = ModelFactory.loadObject(this.options.model)
        .then((model) => {
          this.model = model;
          this.isInfinite = false;
        });
    }
    else {
      if(type === "number") {
        this.model = quad(dim, dim)
          .colored(this.options.texture, this.options);
        promise = Promise.resolve();
      }
      else if(type === "string") {
        this.model = new Image(this.options.texture, Object.assign({}, this.options, {
          width: dim,
          height: dim,
          txtRepeatX: dim,
          txtRepeatY: dim,
          anisotropy: 8
        }));

        promise = this.model.ready;
      }

      promise = promise.then(() => {
        this.children.forEach((mesh) =>
          mesh.rot(-Math.PI / 2, 0, 0));
      });
    }

    promise = promise.then(() => {
      this.model.receiveShadow = this.options.shadow;
      this.model
        .named(this.name + "-" + (this.options.model || this.options.texture))
        .addTo(this);

      this.watch(this.model, Pointer.EVENTS);
    });

    return promise;
  }

  moveTo(pos) {
    if(this.isInfinite) {
      this.position.set(
        Math.floor(pos.x),
        0,
        Math.floor(pos.z))
    }
  }
};
