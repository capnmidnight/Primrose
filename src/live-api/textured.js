pliny.function({
  name: "textured",
  description: "| [under construction]"
});

import cache from "../util/cache";
import material from "./material";
import { Texture, Mesh, RepeatWrapping } from "three/Three";
import { Surface, loadTexture } from "../Primrose";
import TextBox from "../Primrose/Text/Controls/TextBox";

function textured(geometry, txt, options) {
  options = options || {};
  if (options.txtRepeatS === undefined) {
    options.txtRepeatS = 1;
  }
  if (options.txtRepeatT === undefined) {
    options.txtRepeatT = 1;
  }

  var txtID = (txt.id || txt).toString(),
    textureDescription = `Primrose.textured(${txtID}, ${options.txtRepeatS}, ${options.txtRepeatT}, ${options.anisotropy})`,
    texture = cache(textureDescription, () => {
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
        return txt.texture;
      }
      else if (typeof txt === "string" || (txt instanceof Array || txt.length === 6)) {
        return loadTexture(txt, options.resolve, options.progress, options.reject);
      }
      else if (txt instanceof TextBox) {
        return txt.renderer.texture;
      }
      else if (txt instanceof HTMLCanvasElement || txt instanceof HTMLVideoElement) {
        return new Texture(txt);
      }
      else if(txt instanceof Texture) {
        return txt;
      }
      else {
        throw new Error("Texture description couldn't be converted to a THREE.Texture object");
      }
    });

  options.texture = texture;

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

  if (options.txtRepeatS * options.txtRepeatT > 1) {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(options.txtRepeatS, options.txtRepeatT);
  }

  if(options.anisotropy){
    texture.anisotropy = options.anisotropy;
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

  mat.needsUpdate = true;
  texture.needsUpdate = true;

  return obj;
}