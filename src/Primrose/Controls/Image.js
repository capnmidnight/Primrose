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

  get position(){
    return this._meshes[0].position;
  }

  get quaternion(){
    return this._meshes[0].quaternion;
  }

  get scale(){
    return this._meshes[0].scale;
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

  loadImages(images, progress) {
    return Promise.all(images.map((src, i) =>
      Primrose.loadTexture(src, progress).then((txt) => {
        this._textures[i] = txt;
        this._meshes[i] = textured(
          this.options.geometry,
          txt,
          this.options);
      })))
    .then(() => this.isVideo = false)
    .then(() => this);
  }

  loadVideos(videos, progress){
    return Promise.all(videos.map((spec, i) => new Promise((resolve, reject) => {
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

          this._meshes[i] = textured(
            this.options.geometry,
            this._canvases[i],
            this.options);

          if((p2Width !== width || p2Height !== height)){
            const maxU = width / p2Width,
              maxV = height / p2Height,
              oldMaxU = this.options.scaleTextureWidth || 1,
              oldMaxV = this.options.scaleTextureHeight || 1,
              pU = maxU / oldMaxU,
              pV = maxV / oldMaxV;

            this.options.scaleTextureWidth = maxU;
            this.options.scaleTextureHeight = maxV;
            const geometry = this._meshes[i].geometry,
              attrs = geometry.attributes || (geometry._bufferGeometry && geometry._bufferGeometry.attributes);
            if (attrs && attrs.uv && attrs.uv.array) {
              const uv = attrs.uv,
                arr = uv.array;
              for (let j = 0; j < arr.length; j += uv.itemSize) {
                arr[j] *= pU;
              }
              for (let j = 1; j < arr.length; j += uv.itemSize) {
                arr[j] = 1 - (1 - arr[j]) * pV;
              }
            }
            else if(geometry.faceVertexUvs) {
              const faces = geometry.faceVertexUvs;
              for(let i = 0; i < faces.length; ++i){
                const face = faces[i];
                for(let j = 0; j < face.length; ++j){
                  const uvs = face[j];
                  for(let k = 0; k < uvs.length; ++k){
                    const uv = uvs[k];
                    uv.x *= pU;
                    uv.y = 1 - (1 - uv.y) * pV;
                  }
                }
              }
            }
          }
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
      for(var i = 0; i < this._meshes.length; ++i){
        var m = this._meshes[i];
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