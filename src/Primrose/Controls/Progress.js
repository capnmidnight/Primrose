/*
pliny.class({
  parent: "Primrose.Controls",
  name: "Progress",
  description: "| [under construction]"
});
*/

import { BackSide } from "three";

import { colored, box } from "../../live-api";


const SIZE = 1,
  INSET = 0.8,
  PROPORTION = 10,
  SIZE_SMALL = SIZE / PROPORTION,
  INSET_LARGE = (1 - (1 - INSET) / PROPORTION);

export default class Progress {

  constructor(majorColor, minorColor) {
    majorColor = majorColor || 0xffffff;
    minorColor = minorColor || 0x000000;
    var geom = box(SIZE, SIZE_SMALL, SIZE_SMALL);

    this.totalBar = geom
      .colored(minorColor, {
        unshaded: true,
        side: BackSide
      });

    this.valueBar = geom
      .colored(majorColor, {
        unshaded: true
      })
      .scl(0, INSET, INSET)
      .addTo(this.totalBar);

    this.fileState = null;
    this.reset();
  }

  reset(){
    this.fileState = {};
    this.value = 0;
  }

  get visible(){
    return this.totalBar.visible;
  }

  set visible(v){
    this.totalBar.visible = v;
  }

  get position(){
    return this.totalBar.position;
  }

  get quaternion(){
    return this.totalBar.quaternion;
  }

  get value(){
    return this.valueBar.scale.x / INSET_LARGE;
  }

  set value(v){
    this.valueBar.scale.x = v * INSET_LARGE;
    this.valueBar.position.x = -SIZE * (1 - v) * INSET_LARGE / 2;
  }

  onProgress(evt){
    const file = evt.target.responseURL || evt.target.currentSrc;
    if(file && evt.loaded !== undefined){
      if(!this.fileState[file]){
        this.fileState[file] = {};
      }
      const f = this.fileState[file];
      f.loaded = evt.loaded;
      f.total = evt.total;
    }

    let total = 0, loaded = 0;
    for(let key in this.fileState){
      const f = this.fileState[key];
      total += f.total;
      loaded += f.loaded;
    }

    if(total > 0){
      this.value = loaded / total;
    }
    else{
      this.value = 0;
    }
  }
}
