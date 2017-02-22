import quad from "../../live-api/quad";
import Entity from "./Entity";
import Image from "./Image";
import Pointer from "../Pointer";
import ModelFactory from "../Graphics/ModelFactory";

import { Raycaster, Vector3 } from "three";

const heightTester = new Raycaster();

heightTester.ray.direction.set(0, -1, 0);

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
  }

  get _ready() {
    const dim = this.options.dim,
      type = typeof  this.options.texture;

    let promise = null;

    this.model = null;
    this.isInfinite = null;

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
          .colored(this.options.texture, this.options)
          .rot(-Math.PI / 2, 0, 0);
        promise = Promise.resolve();
      }
      else if(type === "string") {
        this.model = new Image(this.options.texture, Object.assign({}, this.options, {
          width: dim,
          height: dim,
          txtRepeatX: dim,
          txtRepeatY: dim,
          anisotropy: 8
        })).rot(-Math.PI / 2, 0, 0);
        console.log("A", !!this.model);

        promise = this.model.ready;
      }

      if(promise) {
        this.isInfinite = true;
      }
      else{
        promise = Promise.reject("Couldn't figure out how to make the ground out of " + this.options.texture);
      }
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

  getHeightAt(pos) {
    if(this.model) {
      heightTester.ray.origin.copy(pos);
      heightTester.ray.origin.y = 100;
      const hits = heightTester.intersectObject(this.model);
      if(hits.length > 0) {
        const hit = hits[0];
        return 100 - hit.distance;
      }
    }

    return 0;
  }
};
