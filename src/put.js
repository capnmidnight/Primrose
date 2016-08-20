"use strict";

pliny.function({
  name: "put",
  description: "A literate interface for putting objects onto scenes with basic, common transformations. You call `put()` with an object, then have access to a series of methods that you can chain together, before receiving the object back again. This makes it possible to create objects in the parameter position of `put()` at the same time as declaring the variable that will hold it.\n\
\n\
* .on(scene) - the Primrose.Entity or THREE.Object3D on which to append the element.\n\
* .at(x, y, z) - set the translation for the object.\n\
* .rot(x, y, z) - set the rotation for the object.\n\
* .scale(x, y, z) - set the scale for the object.\n\
* .obj() - return the naked object, if not all of the transformations are desired.",
  parameters: [{
    name: "object",
    type: "Object",
    description: "The object to manipulate."
  }],
  returns: "Object",
  examples: [{
    name: "Put an object on a scene at a specific location.",
    description: "    grammar(\"JavaScript\");\n\
    var myCylinder = put(textured(cylinder(), 0x00ff00))\n\
      .on(scene)\n\
      .at(1, 2, 3)\n\
      .obj();"
  }]
});

function put(object) {
  var box = {
      on: null,
      at: null,
      rot: null,
      scale: null,
      obj: () => object
    },
    on = function (scene) {
      if (scene.appendChild) {
        scene.appendChild(object);
      }
      else {
        scene.add(object);
      }
      box.on = null;
      if (box.at || box.rot || box.scale) {
        return box;
      }
      else {
        return object;
      }
    },
    at = function (x, y, z) {
      object.position.set(x, y, z);
      box.at = null;
      if (box.on || box.rot || box.scale) {
        return box;
      }
      else {
        return object;
      }
    },
    rot = function (x, y, z) {
      object.rotation.set(x, y, z);
      box.rot = null;
      if (box.on || box.at || box.scale) {
        return box;
      }
      else {
        return object;
      }
    },
    scale = function (x, y, z) {
      object.scale.set(x, y, z);
      box.scale = null;
      if (box.on || box.at || box.rot) {
        return box;
      }
      else {
        return object;
      }
    };

  box.on = on;
  box.at = at;
  box.rot = rot;
  box.scale = scale;

  return box;
}