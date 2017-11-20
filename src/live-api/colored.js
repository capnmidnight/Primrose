/*
pliny.function({
  parent: "Live API",
  name: "colored",
  description: "Apply a color to a geometry, creating the intermediate material as necessary, and returning the resulting mesh",
  returns: "THREE.Mesh",
  parameters: [{
    name: "geometry",
    type: "THREE.Geometry",
    description: "The geometry to which to apply the color."
  }, {
    name: "color",
    type: "Number",
    description: "A hexadecimal color value in RGB format."
  }, {
    name: "options",
    type: "Live API.colored.optionsHash",
    optional: true,
    description: "Options to pass on to [`material()`](#LiveAPI_material), or infrequently-used options to change the behavior of the setup. See [`Live API.colored.optionsHash`](#LiveAPI_colored_optionsHash) and [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }],
  examples: [{
    name: "Usage",
    description: `Apply color to a geometry:

    grammar("JavaScript");
    var geom = box(),
      red = colored(geom, 0xff0000),
      green = colored(geom, 0x00ff00),
      blue = colored(geom, 0x0000ff);

    red.position.set(-2, 1, -1);
    green.position.set(0, 1, -1);
    blue.position.set(2, 1, -1);

    env.scene.add(red);
    env.scene.add(green);
    env.scene.add(blue);

The results should look like this:

<img src="images/colored.jpg">`
  }]
});
*/


/*
pliny.record({
  parent: "Live API.colored",
  name: "optionsHash",
  type: "Object",
  description: "Optional options to alter how the texture is applied to the geometry. This also includes options that are passed on to the [`material()`](#LiveAPI_material) function.",
  parameters: [{
    name: "resolve",
    type: "Function",
    optional: true,
    description: "A callback function to use when the material is successfully created, so that `colored()` can be used in place of `textured()`."
  }]
});
*/

import { Mesh } from "three";

import material from "./material";


export default function colored(geometry, color, options) {
  options = options || {};
  options.color = color;

  var mat = material("", options),
    obj = null;

  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new Mesh(geometry, mat);
  }
  else if (geometry.isObject3D) {
    obj = geometry;
    obj.material = mat;
  }

  if(options.shadow){
    obj.receiveShadow = true;
    obj.castShadow = true;
  }

  if(options.resolve){
    options.resolve();
  }
  return obj;
};
