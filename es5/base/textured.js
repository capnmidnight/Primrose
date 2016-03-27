"use strict";

pliny.issue("", {
  name: "document textured",
  type: "open",
  description: "Finish writing the documentation for the [`textured`](#textured) function\n\
in the helpers/graphics.js file."
});
pliny.function("", {
  name: "textured",
  description: "| [under construction]"
});
var textured = function () {
  var materialCache = {},
      textureCache = {};
  function textured(geometry, txt, options) {
    options = options || {};
    if (options.opacity === undefined) {
      options.opacity = 1;
    }

    var textureDescription = [txt.id || txt.toString(), options.txtRepeatS, options.txtRepeatT].join(","),
        materialDescription = [textureDescription, options.unshaded, options.opacity].join(",");

    if (!materialCache[materialDescription]) {
      if (options.unshaded) {
        materialCache[materialDescription] = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: options.opacity,
          shading: THREE.FlatShading,
          side: THREE.DoubleSide
        });
      } else {
        materialCache[materialDescription] = new THREE.MeshLambertMaterial({
          transparent: true,
          opacity: options.opacity,
          side: THREE.DoubleSide
        });
      }
    }

    var material = materialCache[materialDescription];
    material.wireframe = !!options.wireframe;

    var obj = null;
    if (geometry.type.indexOf("Geometry") > -1) {
      obj = new THREE.Mesh(geometry, material);
    } else if (geometry instanceof THREE.Object3D) {
      geometry.material = material;
      obj = geometry;
    }

    if (typeof txt === "number" || txt instanceof Number) {
      material.color.set(txt);
    } else {
      material.color.set(0xffffff);

      var setTexture = function setTexture(texture) {
        if (texture instanceof Primrose.Surface) {
          if (options.scaleTextureWidth || !options.scaleTextureHeight) {
            var imgWidth = texture.imageWidth,
                imgHeight = texture.imageHeight,
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

              texture.bounds.width = newWidth;
              texture.bounds.height = newHeight;
              texture.resize();
              texture.invalidate();
            }
          }

          texture = texture.texture;
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
        Primrose.loadTexture(txt, setTexture, null, console.error.bind(console, "Error loading texture", txt));
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
