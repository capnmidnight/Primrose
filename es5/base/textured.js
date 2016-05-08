"use strict";

pliny.function({
  name: "textured",
  description: "| [under construction]"
});
var textured = function () {
  var textureLoader = null,
      textureCache = {};
  Primrose.loadTexture = function (url) {
    if (!textureLoader) {
      textureLoader = new THREE.TextureLoader();
    }
    textureLoader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
    return cache("Image(" + url + ")", function () {
      return new Promise(function (resolve, reject) {
        return textureLoader.load(url, resolve, null, reject);
      });
    });
  };

  function textured(geometry, txt, options) {
    options = options || {};
    if (options.opacity === undefined) {
      options.opacity = 1;
    }

    var material = null;
    if (txt instanceof THREE.Material) {
      material = txt;
      txt = null;
    } else {
      var txtID = txt.id || txt.toString(),
          textureDescription = "Primrose.textured(" + txtID + ", " + options.txtRepeatS + ", " + options.txtRepeatT + ")",
          materialDescription = "material(" + textureDescription + ", " + options.unshaded + ", " + options.opacity + ")";
      material = cache(materialDescription, function () {
        var materialOptions = {
          transparent: options.opacity < 1,
          opacity: options.opacity,
          side: THREE.DoubleSide
        },
            MaterialType = THREE.MeshStandardMaterial;

        if (options.unshaded) {
          materialOptions.shading = THREE.FlatShading;
          MaterialType = THREE.MeshBasicMaterial;
        } else {
          if (options.roughness === undefined) {
            options.roughness = 0.5;
          }
          if (options.metalness === undefined) {
            options.metalness = 0;
          }
          materialOptions.roughness = options.roughness;
          materialOptions.metalness = options.metalness;
        }
        return new MaterialType(materialOptions);
      });
    }

    material.wireframe = !!options.wireframe;

    var obj = null;
    if (geometry.type.indexOf("Geometry") > -1) {
      obj = new THREE.Mesh(geometry, material);
    } else if (geometry instanceof THREE.Object3D) {
      obj = geometry;
      obj.material = material;
    }

    if (typeof txt === "number" || txt instanceof Number) {
      material.color.set(txt);
    } else if (txt) {
      material.color.set(0xffffff);

      var setTexture = function setTexture(texture) {
        var surface;
        if (texture instanceof Primrose.Surface) {
          surface = texture;
          texture = surface.texture;
          if (options.scaleTextureWidth || !options.scaleTextureHeight) {
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

        if (options.scaleTextureWidth || options.scaleTextureHeight) {
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
          } else {
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
      } else if (txt instanceof Primrose.Surface) {
        txt._material = material;
        Primrose.Entity.registerEntity(txt);
        setTexture(txt);
        obj.surface = txt;
      } else if (typeof txt === "string") {
        Primrose.loadTexture(txt).then(setTexture).catch(console.error.bind(console, "Error loading texture", txt));
      } else if (txt instanceof Primrose.Text.Controls.TextBox) {
        setTexture(txt.renderer.texture);
      } else if (txt instanceof HTMLCanvasElement) {
        setTexture(new THREE.Texture(txt));
      } else {
        setTexture(txt);
      }
    }

    return obj;
  }

  return textured;
}();