import { CubeTextureLoader } from "three/src/loaders/CubeTextureLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Texture } from "three/src/textures/Texture";
import cache from "../../util/cache";

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