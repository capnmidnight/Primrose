/*
pliny.function({
  parent: "Live API",
  name: "material",
  description: "A mechanism for creating and caching Three.js Materials so they don't get duplicated, as duplicate materials can severally slow down the system.\n\
\n\
You typically won't use this function on your own. It's usually called by one of the functions [`textured()`](#LiveAPI_textured] or [`colored()`](#LiveAPI_colored) to handle common material handling between the two.",
  returns: "THREE.MeshStandardMaterial or THREE.MeshBasicMaterial",
  parameters: [{
    name: "textureDescription",
    type: "String",
    optional: true,
    default: "none",
    description: "When called from `textured()`, it is the string that uniquely identifies the texture being used as part of the material. When called from `colored()`, it's just an empty string. The `textureDescription` is then used as part of a `materialDescription` that is used to cache the material."
  }, {
    name: "options",
    type: "Live API.material.optionsHash",
    optional: true,
    description: "Options to pass to the THREE.MeshStandardMaterial or THREE.MeshBasicMaterial constructor, or infrequently-used options to change the behavior of the setup. See [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }]
});
*/

/*
pliny.record({
  parent: "Live API.material",
  name: "optionsHash",
  type: "Object",
  description: "Optional options to alter how the material is created.",
  parameters: [{
    name: "color",
    type: "Number",
    optional: true,
    default: "0xffffff",
    description: "A hex-value RGB color to apply to the material."
  }, {
    name: "unshaded",
    type: "Boolean",
    optional: true,
    default: false,
    description: "Set to true to use THREE.MeshBasicMaterial instead of THREE.MeshStandardMaterial."
  }, {
    name: "side",
    type: "Number",
    optional: true,
    default: "THREE.FrontSide",
    description: "Used to set the sides of the material that get rendered. Options are:\n\
\n\
* `THREE.FontSide`\n\
* `THREE.BackSide`\n\
* `THREE.DoubleSide`\n\
\n\n"
  }, {
    name: "opacity",
    type: "Number",
    optional: true,
    default: 1,
    description: "Set how opaque the material will be. When this value is set to a value less than 1, the `transparent` option is automatically set as well"
  }, {
    name: "transparent",
    type: "Boolean",
    optional: true,
    description: "Set to true to make the material participate in z-buffered transparency rendering."
  }, {
    name: "useFog",
    type: "Boolean",
    optional: true,
    default: true,
    description: "Set whether or not the material is affected by fog in the scene."
  }, {
    name: "wireframe",
    type: "Boolean",
    optional: true,
    default: true,
    description: "Set whether or not the material is rendered as a wireframe, rather than full polygons."
  }, {
    name: "roughness",
    type: "Number",
    optional: true,
    default: 0.5,
    description: "When `unshaded` is falsey, sets the THREE.MeshStandardMaterial's diffuse scattering parameter."
  }, {
    name: "metalness",
    type: "Number",
    optional: true,
    default: 0,
    description: "When `unshaded` is falsey, sets the THREE.MeshStandardMaterial's specular reflection parameter."
  }, {
    name: "emissive",
    type: "Boolean",
    optional: true,
    default: true,
    description: "When `unshaded` is falsey, sets the light that the THREE.MeshStandardMaterial emits onto the scene."
  } ]
});
*/

import { FrontSide, FlatShading, MeshStandardMaterial, MeshBasicMaterial } from "three";

import { cache } from "../util";


export default function material(textureDescription, options){
  if(options === undefined && typeof textureDescription !== "string") {
    options = textureDescription;
    textureDescription = "none";
  }
  options = Object.assign({}, {
    opacity: 1,
    roughness: 0.5,
    metalness: 0,
    color: 0xffffff,
    useFog: true,
    unshaded: false,
    wireframe: false,
    side: FrontSide
  }, options);

  var materialDescription = `Primrose.material(${textureDescription}, ${options.color}, ${options.unshaded}, ${options.side}, ${options.opacity}, ${options.roughness}, ${options.metalness}, ${options.color}, ${options.emissive}, ${options.wireframe}, ${options.useFog})`;

  return cache(materialDescription, () => {
    var materialOptions = {
        fog: options.useFog,
        transparent: options.transparent || (options.opacity !== undefined && options.opacity < 1),
        opacity: options.opacity,
        side: options.side || FrontSide
      },
      MaterialType = MeshStandardMaterial;

    if (options.unshaded) {
      materialOptions.shading = FlatShading;
      MaterialType = MeshBasicMaterial;
    }
    else {
      materialOptions.roughness = options.roughness;
      materialOptions.metalness = options.metalness;

      if (options.emissive !== undefined) {
        materialOptions.emissive = options.emissive;
      }
    }

    var mat = new MaterialType(materialOptions);
    if (typeof options.color === "number" || options.color instanceof Number) {
      mat.color.set(options.color);
    }
    mat.wireframe = options.wireframe;
    return mat;
  });
};
