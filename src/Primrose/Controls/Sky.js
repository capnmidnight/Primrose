import { box, quad, sphere } from "../../live-api";
import { isMobile } from "../../flags";
import Entity from "./Entity";
import Image from "./Image";

import { DirectionalLight, AmbientLight, BackSide } from "three";

export default class Sky extends Entity {

  constructor(options) {
    super("Sky", {
      transparent: false,
      useFog: false,
      unshaded: true,
      skyRadius: options.drawDistance,
      texture: options.skyTexture,
      progress: options.progress,
      enableShadows: options.enableShadows,
      shadowMapSize: options.shadowMapSize,
      shadowCameraSize: options.shadowCameraSize,
      shadowRadius: options.shadowRadius
    });

    this._image = null;

    if(options.disableDefaultLighting) {
      this.ambient = null;
      this.sun = null;
    }
    else{

      /*
      pliny.property({
        parent: "Primrose.Controls.Sky",
        name: "ambient",
        type: "THREE.AmbientLight",
        description: "If the `disableDefaultLighting` option is not present, the ambient light provides a fill light so that dark shadows do not completely obscure object details."
      });
      */
      this.ambient = new AmbientLight(0xffffff, 0.5)
        .addTo(this);

      /*
      pliny.property({
        parent: "Primrose.Controls.Sky",
        name: "sun",
        type: "THREE.PointLight",
        description: "If the `disableDefaultLighting` option is not present, the sun light provides a key light so that objects have shading and relief."
      });
      */
      this.sun = new DirectionalLight(0xffffff, 1)
        .addTo(this)
        .at(0, 100, 100);

      this.add(this.sun.target);

      if(this.options.enableShadows) {
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width =
        this.sun.shadow.mapSize.height = this.options.shadowMapSize;
        this.sun.shadow.radius = this.options.shadowRadius;
        this.sun.shadow.camera.top = this.sun.shadow.camera.right = this.options.shadowCameraSize;
        this.sun.shadow.camera.bottom = this.sun.shadow.camera.left = -this.options.shadowCameraSize;
        this.sun.shadow.camera.updateProjectionMatrix();
      }
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
      const skyDim = this.options.skyRadius / Math.sqrt(2);
      this.options.side = BackSide;
      this.add(box(skyDim, skyDim, skyDim)
        .colored(this.options.texture, this.options));
    }
    else if(type === "string") {
      this.options.side = BackSide;
      this.add(sphere(0.95 * this.options.skyRadius, 46, 24)
        .textured(this.options.texture, this.options));
    }
    else if(this.options.texture instanceof Array && this.options.texture.length === 6 && typeof this.options.texture[0] === "string") {
      this._image = new Image(this.options.texture, this.options);
      this.add(this._image);
    }

    return this._image && this._image.ready || super._ready;
  }


};
