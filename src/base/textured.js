pliny.issue("", {
  name: "document textured",
  type: "open",
  description: "Finish writing the documentation for the [`textured`](#textured) function\n\
in the helpers/graphics.js file."
});
pliny.function("", {
  name: "textured",
  description: "<under construction>"
});
var textured = (function () {
  var materialCache = {},
    textureCache = {};
  function textured(geometry, txt, options) {
    var material, surface;

    options = options || {};
    if (options.opacity === undefined) {
      options.opacity = 1;
    }

    var textureDescription = [txt.id || txt.toString(), options.txtRepeatS, options.txtRepeatT].join(","),
      materialDescription = [textureDescription, options.unshaded, options.opacity].join(",");

    if ((options.scaleTextureWidth || options.scaleTextureHeight)) {
      if (geometry.attributes && geometry.attributes.uv && geometry.attributes.uv.array) {
        var uv = geometry.attributes.uv,
          arr = uv.array;
        if (options.scaleTextureWidth) {
          for (var i = 0; i < arr.length; i += uv.itemSize) {
            arr[i] *= options.scaleTextureWidth;
          }
        }
        if (options.scaleTextureHeight) {
          for (var i = 1; i < arr.length; i += uv.itemSize) {
            arr[i] = 1 - (1 - arr[i]) * options.scaleTextureHeight;
          }
        }
      }
      else {
        console.trace(geometry);
      }
    }

    if (materialCache[materialDescription]) {
      material = materialCache[materialDescription];
    }
    else if (typeof txt === "number") {
      if (options.unshaded) {
        material = new THREE.MeshBasicMaterial({
          transparent: true,
          color: txt,
          opacity: options.opacity,
          shading: THREE.FlatShading
        });
      }
      else {
        material = new THREE.MeshLambertMaterial({
          transparent: true,
          color: txt,
          opacity: options.opacity
        });
      }
    }
    else if (txt instanceof Primrose.Surface) {
      material = txt.material;
      surface = txt;
    }
    else {
      if (options.unshaded) {
        material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          shading: THREE.FlatShading,
          side: THREE.DoubleSide,
          opacity: options.opacity
        });
      }
      else {
        material = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          transparent: true,
          side: THREE.DoubleSide,
          opacity: options.opacity
        });
      }

      var setTexture = function (texture) {
        if (!texture) {
          console.log(txt);
          console.trace();
        }
        else {
          textureCache[textureDescription] = texture;
          material.map = texture;
          material.needsUpdate = true;
          if (options.txtRepeatS * options.txtRepeatT > 1) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(options.txtRepeatS, options.txtRepeatT);
          }
        }
      };

      if (textureCache[textureDescription]) {
        setTexture(textureCache[textureDescription]);
      }
      else if (typeof txt === "string") {
        Primrose.loadTexture(txt, setTexture,
          null,
          console.error.bind(console, "Error loading texture", txt));
      }
      else if (txt instanceof Primrose.Text.Controls.TextBox) {
        setTexture(txt.renderer.texture);
      }
      else if (txt instanceof HTMLCanvasElement) {
        var txt2 = new THREE.Texture(txt);
        txt2.needsUpdate = true;
        setTexture(txt2);
      }
      else {
        setTexture(txt);
      }
    }
    material.wireframe = !!options.wireframe;
    var obj = null;
    if (geometry.type.indexOf("Geometry") > -1) {
      obj = new THREE.Mesh(geometry, material);
    }
    else if (geometry instanceof THREE.Object3D) {
      geometry.material = material;
      obj = geometry;
    }

    if (surface) {
      obj.surface = surface;
    }
    materialCache[materialDescription] = material;
    return obj;
  }

  return textured;
})();