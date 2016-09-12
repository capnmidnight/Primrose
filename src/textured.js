var textureLoader = null,
  textureCache = {};

Primrose.loadTexture = function (url, progress) {
  progress = progress || function(){};
  if (!textureLoader) {
    textureLoader = new THREE.TextureLoader();
  }
  textureLoader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
  return cache(
    `Image(${url})`,
    () => new Promise((resolve, reject) => textureLoader.load(url, resolve, progress, reject)));
};

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

  options.unshaded = !!options.unshaded;
  options.wireframe = !!options.wireframe;

  var material = null, textureDescription;
  if (txt instanceof THREE.Material) {
    material = txt;
    txt = null;
  }
  else {
    var txtID = (txt.id || txt)
      .toString();
      textureDescription = `Primrose.textured(${txtID}, ${options.txtRepeatS}, ${options.txtRepeatT})`;
    var materialDescription = `Primrose.material(${textureDescription}, ${options.unshaded}, ${options.opacity}, ${options.roughness}, ${options.metalness}, ${options.wireframe}, ${options.emissive})`;
    material = cache(materialDescription, () => {
      var materialOptions = {
          transparent: options.opacity < 1,
          opacity: options.opacity,
          side: options.side || THREE.FrontSide
        },
        MaterialType = THREE.MeshStandardMaterial;

      if (options.unshaded) {
        materialOptions.shading = THREE.FlatShading;
        MaterialType = THREE.MeshBasicMaterial;
      }
      else {
        materialOptions.roughness = options.roughness;
        materialOptions.metalness = options.metalness;

        if (options.emissive !== undefined) {
          materialOptions.emissive = options.emissive;
        }
      }
      return new MaterialType(materialOptions);
    });
  }

  material.wireframe = options.wireframe;

  var obj = null;
  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new THREE.Mesh(geometry, material);
  }
  else if (geometry instanceof THREE.Object3D) {
    obj = geometry;
    obj.material = material;
  }

  if (typeof txt === "number" || txt instanceof Number) {
    material.color.set(txt);
  }
  else if (txt) {
    material.color.set(0xffffff);

    var setTexture = function (texture) {
      var surface;
      if (texture instanceof Primrose.Surface) {
        surface = texture;
        texture = surface.texture;
        if (!options.scaleTextureWidth || !options.scaleTextureHeight) {
          var imgWidth = surface.imageWidth,
            imgHeight = surface.imageHeight,
            dimX = Math.ceil(Math.log(imgWidth) / Math.LN2),
            dimY = Math.ceil(Math.log(imgHeight) / Math.LN2),
            newWidth = Math.pow(2, dimX),
            newHeight = Math.pow(2, dimY),
            scaleX = imgWidth / newWidth,
            scaleY = imgHeight / newHeight;

          if (scaleX !== 1 || scaleY !== 1) {
            if (scaleX !== 1) {
              options.scaleTextureWidth = scaleX;
            }

            if (scaleY !== 1) {
              options.scaleTextureHeight = scaleY;
            }

            surface.bounds.width = newWidth;
            surface.bounds.height = newHeight;
            surface.resize();
            surface.render(true);
          }
        }
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
          console.trace(geometry);
        }
      }

      textureCache[textureDescription] = texture;
      material.map = texture;
      material.needsUpdate = true;
      texture.needsUpdate = true;
    };


    if (textureCache[textureDescription]) {
      setTexture(textureCache[textureDescription]);
    }
    else if (txt instanceof Primrose.Surface) {
      txt._material = material;
      setTexture(txt);
      obj.surface = txt;
    }
    else if (typeof txt === "string") {
      Primrose.loadTexture(txt, options.progress)
        .then(setTexture)
        .catch(console.error.bind(console, "Error loading texture", txt));
    }
    else if (txt instanceof Primrose.Text.Controls.TextBox) {
      setTexture(txt.renderer.texture);
    }
    else if (txt instanceof HTMLCanvasElement) {
      setTexture(new THREE.Texture(txt));
    }
    else {
      setTexture(txt);
    }
  }

  return obj;
}