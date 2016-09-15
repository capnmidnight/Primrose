var textureCache = {};

pliny.function({
  name: "textured",
  description: "| [under construction]"
});

function textured(geometry, txt, options) {
  options = options || {};
  if (options.opacity === undefined) {
    options.opacity = 1;
  }
  if (options.txtRepeatS === undefined) {
    options.txtRepeatS = 1;
  }
  if (options.txtRepeatT === undefined) {
    options.txtRepeatT = 1;
  }
  if (options.roughness === undefined) {
    options.roughness = 0.5;
  }
  if (options.metalness === undefined) {
    options.metalness = 0;
  }
  if(options.color === undefined){
    options.color = 0xffffff;
  }

  options.unshaded = !!options.unshaded;
  options.wireframe = !!options.wireframe;

  var mat = null,
    textureDescription;
  if (txt instanceof THREE.Material) {
    mat = txt;
    txt = null;
  }
  else {
    var txtID = (txt.id || txt).toString();
    textureDescription = `Primrose.textured(${txtID}, ${options.txtRepeatS}, ${options.txtRepeatT})`;
    mat = material(textureDescription, options);
  }

  var obj = null;
  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new THREE.Mesh(geometry, mat);
  }
  else if (geometry instanceof THREE.Object3D) {
    obj = geometry;
    obj.material = mat;
  }

  if (txt) {
    var setTexture = function (texture) {
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

      textureCache[textureDescription] = texture;
      mat.map = texture;
      mat.needsUpdate = true;
      texture.needsUpdate = true;
    };


    if (textureCache[textureDescription]) {
      setTexture(textureCache[textureDescription]);
    }
    else if (txt instanceof Primrose.Surface) {
      if (!options.scaleTextureWidth || !options.scaleTextureHeight) {
        obj.surface = txt;
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
      setTexture(txt.texture);
    }
    else if (typeof txt === "string") {
      Primrose.loadTexture(txt, options.progress)
        .then(setTexture)
        .catch(console.error.bind(console, "Error loading texture", txt));
    }
    else if (txt instanceof Primrose.Text.Controls.TextBox) {
      setTexture(txt.renderer.texture);
    }
    else if (txt instanceof HTMLCanvasElement || txt instanceof HTMLVideoElement) {
      setTexture(new THREE.Texture(txt));
    }
    else {
      setTexture(txt);
    }
  }

  return obj;
}