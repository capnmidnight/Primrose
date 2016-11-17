import Entity from "./Entity";
import { textured, quad, shell } from "../../live-api";
import loadTexture from "../Graphics/loadTexture";

var COUNTER = 0;

// Videos don't auto-play on mobile devices, so let's make them all play whenever
// we tap the screen.
const processedVideos = [];
function findAndFixVideo(evt){
  const vids = document.querySelectorAll("video");
  for(let i = 0; i < vids.length; ++i){
    fixVideo(vids[i]);
  }
  window.removeEventListener("touchend", findAndFixVideo);
  window.removeEventListener("mouseup", findAndFixVideo);
  window.removeEventListener("keyup", findAndFixVideo);
}

function fixVideo(vid) {
  if(processedVideos.indexOf(vid) === -1){
    processedVideos.push(vid);
    makeVideoPlayableInline(vid, false);
  }
}

window.addEventListener("touchend", findAndFixVideo, false);
window.addEventListener("mouseup", findAndFixVideo, false);
window.addEventListener("keyup", findAndFixVideo, false);

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
export default class Image extends Entity {

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

    options = Object.assign({}, {
      id: "Primrose.Controls.Image[" + (COUNTER++) + "]"
    }, options);

    super(options.id);

    this.options = options;

    Entity.registerEntity(this);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    this._canvases = [];
    this._contexts = [];
    this._elements = [];
    this._meshes = [];
    this._textures = [];
    this._currentImageIndex = 0;
    this._lastTime = null;
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
      if(!this.options.width){
        this.options.width = 0.5;
      }
      if(!this.options.height){
        this.options.height = 0.5;
      }
      this.options.geometry = quad(this.options.width, this.options.height, options);
    }
  }

  loadImages(images, progress) {
    return Promise.all(Array.prototype.map.call(images, (src, i) => new Promise((resolve, reject) => {
      const txt = loadTexture(src, resolve, progress, reject);
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
    this._elements.splice(0);
    this._canvases.splice(0);
    this._contexts.splice(0);
    this._textures.splice(0);

    return Promise.all(Array.prototype.map.call(videos, (spec, i) => new Promise((resolve, reject) => {
      var video = null;
      if(typeof spec === "string"){
        video = document.querySelector(`video[src='${spec}']`);
        if(!video) {
          video = document.createElement("video");
          video.src = spec;
        }
      }
      else if(spec instanceof HTMLVideoElement){
        video = spec;
      }
      video.onprogress = progress;
      video.onloadedmetadata = progress;
      video.onerror = reject;
      video.muted = true;
      video.preload = "auto";
      video.autoplay = true;
      video.loop = true;
      video.controls = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.oncanplay = () => {
        video.oncanplay = null;
        video.onerror = null;

        const width = video.videoWidth,
          height = video.videoHeight,
          p2Width = Math.pow(2, Math.ceil(Math.log2(width))),
          p2Height = Math.pow(2, Math.ceil(Math.log2(height)));

        this._elements[i] = video;

        this._setGeometry({
          maxU: width / p2Width,
          maxV: height / p2Height
        });

        if((width !== p2Width || height !== p2Height) && !this.options.disableVideoCopying){
          this._canvases[i] = document.createElement("canvas");
          this._canvases[i].id = (video.id || this.id) + "-canvas";
          this._canvases[i].width = p2Width;
          this._canvases[i].height = p2Height;

          this._contexts[i] = this._canvases[i].getContext("2d");
        }

        this._meshes[i] = textured(
          this.options.geometry,
          this._canvases[i] || this._elements[i],
          this.options);

        this._textures[i] = this._meshes[i].material.map;
        resolve();
      };
      if(!video.parentElement){
        document.body.insertBefore(video, document.body.children[0]);
      }
      video.play();
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
        const elem = this._elements[i];
        if(elem.currentTime !== this._lastTime){
          if(i < this._contexts.length) {
            this._contexts[i].drawImage(elem, 0, 0);
          }
          this._textures[i].needsUpdate = true;
          this._lastTime = elem.currentTime;
        }
      }
    }
  }
}