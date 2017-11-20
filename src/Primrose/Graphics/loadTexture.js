/*
pliny.function({
  parent: "Primrose.Graphics",
  name: "loadTexture",
  description: "Loads an image as a texture",
  returns: "THREE.Texture or THREE.CubteTexture",
  parameters: [{
    name: "id",
    type: "String",
    description: "The key to use to cache the texture."
  }, {
    name: "url",
    type: "String or 6-item Array of String",
    description: "The texture path(s) to load."
  }, {
    name: "progress",
    type: "Function",
    optional: true,
    description: "A callback function to use for tracking progress. The callback function should accept a standard [`ProgressEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent)."
  }]
})
*/

import { CubeTextureLoader, TextureLoader, Texture } from "three";
import { cache } from "../../util";

export default function loadTexture(id, url, progress) {
  var textureLoader = null;
  if(url instanceof Array && url.length === 6) {
    textureLoader = new CubeTextureLoader();;
  }
  else {
    if(url instanceof HTMLImageElement){
      url = url.src;
    }

    if(typeof url === "string") {
      textureLoader = new TextureLoader();
    }
  }

  if(textureLoader){
    textureLoader.setCrossOrigin("anonymous");
  }

  return cache(
    `Texture(${id})`,
    () => new Promise((resolve, reject) => {
      if(textureLoader){
        textureLoader.load(url, resolve, progress, reject);
      }
      else{
        resolve(new Texture(url))
      };
    }));
}
