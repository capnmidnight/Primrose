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
function textured(geometry, txt, unshaded, o, s, t) {
  var material, surface;
  if (o === undefined) {
    o = 1;
  }

  if (typeof txt === "number") {
    if (unshaded) {
      material = new THREE.MeshBasicMaterial({
        transparent: true,
        color: txt,
        opacity: o,
        shading: THREE.FlatShading
      });
    }
    else {
      material = new THREE.MeshLambertMaterial({
        transparent: true,
        color: txt,
        opacity: o
      });
    }
  }
  else if (txt instanceof Primrose.Surface) {
    material = txt.material;
    surface = txt;
  }
  else {
    if (unshaded) {
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        opacity: o
      });
    }
    else {
      material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: o
      });
    }

    var setTexture = function (texture) {
      if (!texture) {
        console.log(txt);
        console.trace();
      }
      else {
        material.map = texture;
        material.needsUpdate = true;
        if (s * t > 1) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(s, t);
        }
      }
    };
    
    if (typeof txt === "string") {
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

  return obj;
}