pliny.function({
  name: "textured",
  description: "| [under construction]"
});

function textured(geometry, txt, options) {
  options = options || {};
  if (options.txtRepeatS === undefined) {
    options.txtRepeatS = 1;
  }
  if (options.txtRepeatT === undefined) {
    options.txtRepeatT = 1;
  }

  var txtID = (txt.id || txt).toString(),
    textureDescription = `Primrose.textured(${txtID}, ${options.txtRepeatS}, ${options.txtRepeatT})`,
    texture = cache(textureDescription, () => {
      if (txt instanceof Primrose.Surface) {
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
        return Primrose.loadTexture(txt, options.resolve, options.progress, options.reject);
      }
      else if (txt instanceof Primrose.Text.Controls.TextBox) {
        return txt.renderer.texture;
      }
      else if (txt instanceof HTMLCanvasElement || txt instanceof HTMLVideoElement) {
        return new THREE.Texture(txt);
      }
      else if(txt instanceof THREE.Texture) {
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
    obj = new THREE.Mesh(geometry, mat);
  }
  else if (geometry instanceof THREE.Mesh) {
    obj = geometry;
    obj.material = mat;
    geometry = obj.geometry;
  }


  if (txt instanceof Primrose.Surface) {
    obj.surface = txt;
  }

  if (options.txtRepeatS * options.txtRepeatT > 1) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(options.txtRepeatS, options.txtRepeatT);
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