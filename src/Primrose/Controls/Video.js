pliny.class({
  parent: "Primrose.Controls",
  name: "Videa",
  baseClass: "Primrose.Controls.BaseTextured",
  description: "A simple 2D video to put on a Surface.",
  parameters: [{
    name: "options",
    type: "Object",
    description: "Named parameters for creating the Video."
  }]
});

let COUNTER = 0;

const processedVideos = [];

function getNetworkStateName(state){
  for(var key in HTMLMediaElement) {
    if(key.indexOf("NETWORK_") >= 0 && HTMLMediaElement[key] === state) {
      return key;
    }
  }
  return state;
}

import makeVideoPlayableInline from "iphone-inline-video";

import BaseTextured from "./BaseTextured";
import textured from "../../live-api/textured";
export default class Video extends BaseTextured {

  constructor(videos, options) {
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////
    if(!(videos instanceof Array)) {
      videos = [videos];
    }

    options = Object.assign({}, {
      id: "Primrose.Controls.Video[" + (COUNTER++) + "]"
    }, options);

    super(videos, options);
  }

  _loadFiles(videos, progress) {
    this._elements = [];
    return Promise.all(Array.prototype.map.call(videos, (spec, i) => new Promise((resolve, reject) => {
      let video = null;
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
      else if(spec.toString() === "[object MediaStream]" || spec.toString() === "[object LocalMediaStream]"){
        video = document.createElement("video");
        video.srcObject = spec;
      }
      video.onprogress = progress;
      video.onloadedmetadata = progress;
      video.onerror = (evt) => reject({
        type: "error",
        source: "videoElement",
        fileName: spec,
        networkState: getNetworkStateName(video.networkState)
      });
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

        this._meshes[i] = textured(
          this.options.geometry,
          this._elements[i],
          this.options);

        this.options.promise.then((txt) => {
          this._textures[i] = txt;
          resolve();
        });
      };
      if(!video.parentElement){
        document.body.insertBefore(video, document.body.children[0]);
      }

      if(processedVideos.indexOf(video) === -1) {
        processedVideos.push(video);
        makeVideoPlayableInline(video);
        video.play();
      }
    })));
  }

  update(){
    super.update();
    for (let i = 0; i < this._textures.length; ++i) {
      const elem = this._elements[i];
      if(elem.currentTime !== this._lastTime){
        this._textures[i].needsUpdate = true;
        this._lastTime = elem.currentTime;
      }
    }
  }
}