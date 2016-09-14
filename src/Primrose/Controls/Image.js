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
    this.isVideo = false;
  }

  get position(){
    return this.meshes[0].position;
  }

  get quaternion(){
    return this.meshes[0].quaternion;
  }

  get scale(){
    return this.meshes[0].scale;
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

  loadImages(images, progress) {
    return Promise.all(images.map((src, i) =>
      Primrose.loadTexture(src, progress).then((txt) => this._images[i] = txt))
    ).then(() => this.isVideo = false)
    .then(() => this);
  }

  loadVideos(videos){
    return Promise.all(videos.map((src, i) => new Promise((resolve, reject) => {
      var video = document.createElement("video"),
        source = document.createElement("source");
      video.muted = true;
      video.preload = "auto";
      video.autoplay = true;
      video.loop = true;
      video.oncanplay = () => {
        this._images[i] = video;
        resolve();
      };
      video.onerror = reject;
      video.src = src;
      document.body.insertBefore(video, document.body.children[0]);
    }))).then(() => this.isVideo = true)
    .then(() => this);
  }

  eyeBlank(eye) {
    if(this.meshes) {
      this._currentImageIndex = eye % this.meshes.length;
      for(var i = 0; i < this.meshes.length; ++i){
        var m = this.meshes[i];
        m.visible = (i === this._currentImageIndex);
        if(i > 0) {
          m.position.copy(this.position);
          m.quaternion.copy(this.quaternion);
          m.scale.copy(this.scale);
        }
      }
    }
  }

  update(){
    if(this.meshes && this.isVideo){
      for(var i = 0; i < this.meshes.length; ++i){
        this.meshes[i].material.map.needsUpdate = true;
      }
    }
  }
}