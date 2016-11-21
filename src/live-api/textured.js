pliny.function({
  name: "textured",
  description: "| [under construction]"
});

import cache from "../util/cache";
import material from "./material";
import { CubeTexture } from "three/src/textures/CubeTexture";
import { Texture } from "three/src/textures/Texture";
import { Mesh } from "three/src/objects/Mesh";
import { RepeatWrapping } from "three/src/constants";
import Surface from "../Primrose/Controls/Surface";
import loadTexture from "../Primrose/Graphics/loadTexture";
import TextBox from "../Primrose/Text/Controls/TextBox";

export default function textured(geometry, txt, options) {
  options = Object.assign({}, {
    txtRepeatS: 1,
    txtRepeatT: 1,
    anisotropy: 1
  }, options);

  const txtID = (txt.id || txt).toString(),
    textureDescription = `Primrose.textured(${txtID}, ${options.txtRepeatS}, ${options.txtRepeatT}, ${options.anisotropy}, ${options.scaleTextureWidth}, ${options.scaleTextureHeight})`;
  const texturePromise = cache(textureDescription, () => {
      if (typeof txt === "string" || (txt instanceof Array || txt.length === 6)) {
        return loadTexture(textureDescription, txt, options.progress);
      }
      else {
        let retValue = null;
        if (txt instanceof Surface) {
          if (!options.scaleTextureWidth || !options.scaleTextureHeight) {
            var imgWidth = txt.imageWidth,
              imgHeight = txt.imageHeight,
              dimX = Math.ceil(Math.log(imgWidth) / Math.LN2),
              dimY = Math.ceil(Math.log(imgHeight) / Math.LN2),
              newWidth = Math.pow(2, dimX),
              newHeight = Math.pow(2, dimY);

            if(options.scaleTexture){
              newWidth *= options.scaleTexture;
              newHeight *= options.scaleTexture;
            }

            var scaleX = imgWidth / newWidth,
              scaleY = imgHeight / newHeight;

            if (scaleX !== 1 || scaleY !== 1) {
              if (scaleX !== 1) {
                options.scaleTextureWidth = scaleX;
              }

              if (scaleY !== 1) {
                options.scaleTextureHeight = scaleY;
              }

              txt.bounds.width = newWidth;
              txt.bounds.height = newHeight;
              txt.resize();
              txt.render(true);
            }
          }
          txt._material = mat;
          retValue = txt.texture;
        }
        else if (txt instanceof TextBox) {
          retValue = txt.renderer.texture;
        }
        else if (txt instanceof HTMLCanvasElement || txt instanceof HTMLVideoElement) {
          retValue = new Texture(txt);
        }
        else if(txt instanceof Texture) {
          retValue = txt;
        }
        else {
          Promise.reject("Texture description couldn't be converted to a THREE.Texture object");
        }

        return Promise.resolve(retValue);
      }
    });

  var mat = material(textureDescription, options),
    obj = null;
  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new Mesh(geometry, mat);
  }
  else if (geometry instanceof Mesh) {
    obj = geometry;
    obj.material = mat;
    geometry = obj.geometry;
  }

  if (txt instanceof Surface) {
    obj.surface = txt;
  }

  if(options.shadow){
    obj.receiveShadow = true;
    obj.castShadow = true;
  }

  if ((options.scaleTextureWidth || options.scaleTextureHeight)) {
    if (geometry.attributes && geometry.attributes.uv && geometry.attributes.uv.array) {
      var uv = geometry.attributes.uv,
        arr = uv.array,
        i;
      if (options.scaleTextureWidth) {
        for (i = 0; i < arr.length; i += uv.itemSize) {
          arr[i] *= options.scaleTextureWidth;
        }
      }
      if (options.scaleTextureHeight) {
        for (i = 1; i < arr.length; i += uv.itemSize) {
          arr[i] = 1 - (1 - arr[i]) * options.scaleTextureHeight;
        }
      }
    }
    else {
      console.trace(geometry, options);
    }
  }

  texturePromise.then((texture) => {
    if (options.txtRepeatS * options.txtRepeatT > 1) {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(options.txtRepeatS, options.txtRepeatT);
    }

    texture.anisotropy = options.anisotropy;

    if(texture instanceof CubeTexture){
      mat.envMap = texture;
    }
    else if(texture instanceof Texture){
      mat.map = texture;
    }

    mat.needsUpdate = true;
    texture.needsUpdate = true;
    return texture;
  }).then(options.resolve)
    .catch(options.reject);

  return obj;
}