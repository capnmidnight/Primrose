var COUNTER = 0,
  _ = priv();

pliny.class({
  parent: "Primrose.Controls",
    name: "Image",
    baseClass: "Primrose.Surface",
    description: "A simple 2D image to put on a Surface.",
    parameters: [{
      name: "options",
      type: "Object",
      description: "Named parameters for creating the Image."
    }]
});
class Image extends Primrose.Entity {

  static create() {
    return new Image();
  }

  constructor(options) {
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    options = options || {};
    if (typeof options === "string") {
      options = {
        value: options
      };
    }

    if(options.radius){
      options.geometry = shell(
        options.radius,
        72,
        36,
        Math.PI * 2,
        Math.PI);
    }
    else if(!options.geometry){
      options.geometry = quad(0.5, 0.5);
    }

    super("Primrose.Controls.Image[" + (COUNTER++) + "]");
    this.options = options;
    Primrose.Entity.registerEntity(this);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    this._images = [];
    this._currentImageIndex = 0;
    this.meshes = null;
  }

  get position(){
    return this.meshes[0].position;
  }

  get quaternion(){
    return this.meshes[0].quaternion;
  }

  addToBrowserEnvironment(env, scene) {
    this.meshes = this._images.map((txt) => textured(this.options.geometry, txt, this.options));
    this.meshes.forEach((mesh, i) => {
      scene.add(mesh);
      mesh.name = this.id + "-" + i;
      if(i > 0){
        mesh.visible = false;
      }
      else{
        env.registerPickableObject(mesh);
      }
    });
  }

  loadImages(images) {
    return Promise.all(images.map((src, i) => Primrose.loadTexture(src)))
      .then((txts) => this._images.push.apply(this._images, txts))
      .catch((err) => {
        console.error("Failed to load image " + src);
        console.error(err);
      }).then(() => this);
  }

  eyeBlank(eye) {
    this._currentImageIndex = eye % this._images.length;
    for(var i = 0; i < this.meshes.length; ++i){
      var m = this.meshes[i];
      m.visible = (i === this._currentImageIndex);
      if(i > 0) {
        m.position.copy(this.position);
        m.quaternion.copy(this.quaternion);
      }
    }
  }
}