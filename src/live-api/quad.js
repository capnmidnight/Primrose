pliny.function({
  name: "quad",
  description: "A shortcut function for the THREE.PlaneBufferGeometry class. Creates a flat rectangle, oriented in the XY plane.",
  parameters: [{
    name: "width",
    type: "Number",
    description: "The width of the rectangle."
  }, {
    name: "height",
    type: "Number",
    description: "The height of the rectangle.",
    optional: true,
    default: "The value of the `width` parameter."
  }, {
    name: "options",
    type: "Object",
    optional: true,
    description: "Optional settings for creating the quad geometry."
  }, {
    name: "options.s",
    type: "Number",
    description: "The number of sub-quads in which to divide the quad horizontally.",
    optional: true,
    default: 1
  }, {
    name: "options.t",
    type: "Number",
    description: "The number of sub-quads in which to divide the quad vertically.",
    optional: true,
    default: 1
  }, {
    name: "options.maxU",
    type: "Number",
    description: "A scalar value for the texture coordinate U component.",
    optional: true,
    default: 1
  }, {
    name: "options.maxV",
    type: "Number",
    description: "A scalar value for the texture coordinate V component.",
    optional: true,
    default: 1
  }],
  returns: "THREE.CircleBufferGeometry",
  examples: [{
    name: "Basic usage",
    description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple circle geometry object that you can then add a material to create a mesh:\n\
  \n\
    grammar(\"JavaScript\");\n\
    var geom = quad(1, 2),\n\
      mesh = colored(geom, 0xff0000);\n\
    put(mesh)\n\
      .on(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/quad.jpg\">"
  }]
});

import cache from "../util/cache";
import fixGeometry from "../Primrose/fixGeometry";
import { PlaneBufferGeometry } from "three/Three";
export default function quad(width, height, options) {
  if (height === undefined) {
    height = width;
  }
  options = options || {};
  if(options.s === undefined){
    options.s = 1;
  }
  if(options.t === undefined){
    options.t = 1;
  }
  return cache(
    `PlaneBufferGeometry(${width}, ${height}, ${options.s}, ${options.t}, ${options.maxU}, ${options.maxV})`,
    () => fixGeometry(new THREE.PlaneBufferGeometry(width, height, options.s, options.t), options));
};