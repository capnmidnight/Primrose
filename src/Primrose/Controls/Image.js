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

    options = patch(options, {
      id: "Primrose.Controls.Image[" + (COUNTER++) + "]"
    });

    super(options.id);

    this.options = options;

    Primrose.Entity.registerEntity(this);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    this._canvases = [];
    this._contexts = [];
    this._elements = [];
    this._meshes = [];
    this._textures = [];
    this._currentImageIndex = 0;
    this.isVideo = false;
  }

  add(child){
    this._meshes[0].add(child);
  }

  get matrixWorld() {
    return this._meshes[0].matrixWorld;
  }

  get position(){
    return this._meshes[0].position;
  }

  get quaternion(){
    return this._meshes[0].quaternion;
  }

  get scale(){
    return this._meshes[0].scale;
  }

  get visible(){
    for(var i = 0; i < this._meshes.length; ++i){
      if(this._meshes[i].visible){
        return true;
      }
    }
    return false;
  }

  set visible(v){
    var img = this._meshes[this._currentImageIndex];
    if(img){
      img.visible = v;
    }
  }

  addToBrowserEnvironment(env, scene) {
    this._meshes.forEach((mesh, i) => {
      scene.add(mesh);
      mesh.name = this.id + "-" + i;
      if(i > 0){
        mesh.visible = false;
      }
      else if(this.options.pickable) {
        env.registerPickableObject(mesh);
      }
    });
  }

  _setGeometry(options) {
    if(this.options.radius){
      this.options.geometry = shell(
        this.options.radius,
        72,
        36,
        Math.PI * 2,
        Math.PI,
        options);
    }
    else if(!this.options.geometry){
      this.options.geometry = quad(0.5, 0.5, options);
    }
  }

  loadImages(images, progress) {
    return Promise.all(Array.prototype.map.call(images, (src, i) => new Promise((resolve, reject) => {
      const txt = Primrose.loadTexture(src, resolve, progress, reject);
      this._textures[i] = txt;
      this._setGeometry();
      this._meshes[i] = textured(
          this.options.geometry,
          txt,
          this.options);
    })))
    .then(() => this.isVideo = false)
    .then(() => this);
  }

  loadVideos(videos, progress){
    return Promise.all(Array.prototype.map.call(videos, (spec, i) => new Promise((resolve, reject) => {
      var video = null;
      if(typeof spec === "string"){
        video = document.querySelector(`video[src='${spec}']`) ||
          document.createElement("video");
        video.src = spec;
      }
      else if(spec instanceof HTMLVideoElement){
        video = spec;
      }
      video.oncanplaythrough = () => {
        const width = video.videoWidth,
          height = video.videoHeight,
          p2Width = Math.pow(2, Math.ceil(Math.log2(width))),
          p2Height = Math.pow(2, Math.ceil(Math.log2(height)));

        if(width === p2Width && height === p2Height){
          this._meshes[i] = textured(
            this.options.geometry,
            elem,
            this.options);
        }
        else{
          this._elements[i] = video;

          this._canvases[i] = document.createElement("canvas");
          this._canvases[i].id = (video.id || this.id) + "-canvas";
          this._canvases[i].width = p2Width;
          this._canvases[i].height = p2Height;

          this._contexts[i] = this._canvases[i].getContext("2d");

          this._setGeometry({
            maxU: width / p2Width,
            maxV: height / p2Height
          });

          this._meshes[i] = textured(
            this.options.geometry,
            this._canvases[i],
            this.options);
        }

        this._textures[i] = this._meshes[i].material.map;
        video.oncanplaythrough = null;
        resolve();
      };
      video.onprogress = progress;
      video.onerror = reject;
      video.muted = true;
      video.preload = "auto";
      video.autoplay = true;
      video.loop = true;
      if(!video.parentElement){
        document.body.insertBefore(video, document.body.children[0]);
      }
    })))
    .then(() => this.isVideo = true)
    .then(() => this);
  }

  eyeBlank(eye) {
    if(this._meshes) {
      this._currentImageIndex = eye % this._meshes.length;
      var isVisible = this.visible;
      for(var i = 0; i < this._meshes.length; ++i){
        var m = this._meshes[i];
        m.visible = isVisible && (i === this._currentImageIndex);
        if(i > 0) {
          m.position.copy(this.position);
          m.quaternion.copy(this.quaternion);
          m.scale.copy(this.scale);
        }
      }
    }
  }

  update(){
    if(this.isVideo){
      for(var i = 0; i < this._textures.length; ++i) {
        if(i < this._contexts.length) {
          this._contexts[i].drawImage(this._elements[i], 0, 0);
        }
        this._textures[i].needsUpdate = true;
      }
    }
  }
}